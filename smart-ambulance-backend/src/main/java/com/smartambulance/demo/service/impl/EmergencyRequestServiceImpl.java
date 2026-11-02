package com.smartambulance.demo.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.smartambulance.demo.dto.EmergencyResponseDTO;
import com.smartambulance.demo.entity.Ambulance;
import com.smartambulance.demo.entity.EmergencyRequest;
import com.smartambulance.demo.entity.Hospital;
import com.smartambulance.demo.entity.User;
import com.smartambulance.demo.exception.ResourceNotFoundException;
import com.smartambulance.demo.repository.AmbulanceRepository;
import com.smartambulance.demo.repository.EmergencyRequestRepository;
import com.smartambulance.demo.repository.HospitalRepository;
import com.smartambulance.demo.repository.UserRepository;
import com.smartambulance.demo.service.EmergencyRequestService;

@Service
@Transactional
public class EmergencyRequestServiceImpl implements EmergencyRequestService {
                
    private final EmergencyRequestRepository emergencyRepository;
    private final UserRepository userRepository;
    private final AmbulanceRepository ambulanceRepository;
    private final HospitalRepository hospitalRepository;

    public EmergencyRequestServiceImpl(
            EmergencyRequestRepository emergencyRepository,
            UserRepository userRepository,
            AmbulanceRepository ambulanceRepository,
            HospitalRepository hospitalRepository
    ) {
        this.emergencyRepository = emergencyRepository;
        this.userRepository = userRepository;
        this.ambulanceRepository = ambulanceRepository;
        this.hospitalRepository = hospitalRepository;
    }

    private EmergencyResponseDTO mapToDTO(EmergencyRequest req) {
        return EmergencyResponseDTO.from(req);
    }

    private Hospital findNearestHospital(double lat, double lon) {
        List<Hospital> hospitals = hospitalRepository.findAll();
        if (hospitals.isEmpty()) {
            return null;
        }

        return hospitals.stream()
                .min(java.util.Comparator.comparingDouble(h -> {
                    if (h.getLatitude() != null && h.getLongitude() != null) {
                        return calculateDistance(lat, lon, h.getLatitude(), h.getLongitude());
                    }
                    return 999999.0;
                }))
                .orElse(hospitals.get(0));
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        double earthRadiusKm = 6371.0;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadiusKm * c;
    }

    @Override
    public EmergencyResponseDTO createEmergency(double lat, double lon) {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean exists = emergencyRepository
                .existsByUserAndStatusIn(user,
                        List.of("PENDING", "ACCEPTED", "PICKED_UP", "DROPPED"));

        if (exists) {
            throw new IllegalStateException("You already have an active emergency in progress");
        }

        EmergencyRequest request = new EmergencyRequest();
        request.setLatitude(lat);
        request.setLongitude(lon);
        request.setStatus("PENDING");
        request.setCreatedAt(LocalDateTime.now());
        request.setUser(user);

        // Automatically assign nearest hospital at emergency creation
        Hospital nearestHospital = findNearestHospital(lat, lon);
        request.setHospital(nearestHospital);
        
        EmergencyRequest saved = emergencyRepository.save(request);

        return mapToDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public EmergencyResponseDTO getMyActiveEmergency() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return emergencyRepository
                .findFirstByUserAndStatusInOrderByCreatedAtDesc(
                        user,
                        List.of("PENDING", "ACCEPTED", "PICKED_UP", "DROPPED")
                )
                .map(this::mapToDTO)
                .orElse(null);
    }

    @Override
    public EmergencyResponseDTO cancel(Long id) {
        EmergencyRequest req = emergencyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Emergency not found"));

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        boolean isAdmin = SecurityContextHolder.getContext()
                .getAuthentication()
                .getAuthorities()
                .stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin && (req.getUser() == null || !req.getUser().getEmail().equalsIgnoreCase(email))) {
            throw new IllegalStateException("You are not authorized to cancel this emergency");
        }

        if ("COMPLETED".equals(req.getStatus()) || "CANCELLED".equals(req.getStatus())) {
            throw new IllegalStateException("Emergency is already " + req.getStatus().toLowerCase());
        }

        if ("PICKED_UP".equals(req.getStatus()) || "DROPPED".equals(req.getStatus())) {
            throw new IllegalStateException("Cannot cancel an emergency after the patient has been picked up");
        }

        req.setStatus("CANCELLED");

        // Release assigned ambulance if any
        if (req.getAmbulance() != null) {
            Ambulance amb = req.getAmbulance();
            amb.setStatus("AVAILABLE");
            ambulanceRepository.save(amb);
        }

        return mapToDTO(emergencyRepository.save(req));
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmergencyResponseDTO> getPendingEmergencies() {
        return emergencyRepository.findByStatus("PENDING")
                .stream()
                .map(req -> {
                    if (req.getHospital() == null) {
                        Hospital nearest = findNearestHospital(req.getLatitude(), req.getLongitude());
                        if (nearest != null) {
                            req.setHospital(nearest);
                            req = emergencyRepository.save(req);
                        }
                    }
                    return mapToDTO(req);
                })
                .toList();
    }

    @Override
    public EmergencyResponseDTO assignAmbulance(Long requestId, Long ambulanceId) {
        EmergencyRequest request = emergencyRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Emergency not found"));
        
        if (!request.getStatus().equals("PENDING")) {
            throw new IllegalStateException("Emergency already accepted or completed");
        }

        Ambulance ambulance = ambulanceRepository.findById(ambulanceId)
                .orElseThrow(() -> new ResourceNotFoundException("Ambulance not found"));
        
        boolean busy = emergencyRepository
                .existsByAmbulanceAndStatusIn(ambulance,
                        List.of("ACCEPTED", "PICKED_UP", "DROPPED"));

        if (busy) {
            throw new IllegalStateException("Ambulance already on duty");
        }

        request.setAmbulance(ambulance);
        request.setStatus("ACCEPTED");

        // Ensure nearest hospital is linked
        if (request.getHospital() == null) {
            request.setHospital(findNearestHospital(request.getLatitude(), request.getLongitude()));
        }

        // Set ambulance status to BUSY
        ambulance.setStatus("BUSY");
        ambulanceRepository.save(ambulance);

        EmergencyRequest saved = emergencyRepository.save(request);

        return mapToDTO(saved);
    }

    private void validateStatus(String current, String expected) {
        if (!current.equals(expected)) {
            throw new IllegalStateException("Invalid status transition: current status is " + current + " but expected " + expected);
        }
    }

    @Override
    public EmergencyResponseDTO pickup(Long id) {
        EmergencyRequest req = emergencyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Emergency not found"));

        validateStatus(req.getStatus(), "ACCEPTED");

        req.setStatus("PICKED_UP");

        if (req.getHospital() == null) {
            req.setHospital(findNearestHospital(req.getLatitude(), req.getLongitude()));
        }

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        Ambulance ambulance = ambulanceRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Ambulance not found"));

        if (!req.getAmbulance().getId().equals(ambulance.getId())) {
            throw new IllegalStateException("You are not assigned to this emergency");
        }

        return mapToDTO(emergencyRepository.save(req));
    }

    @Override
    public EmergencyResponseDTO drop(Long id) {
        EmergencyRequest req = emergencyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Emergency not found"));

        validateStatus(req.getStatus(), "PICKED_UP");
        
        if (req.getHospital() == null) {
            Hospital hospital = findNearestHospital(req.getLatitude(), req.getLongitude());
            if (hospital == null) {
                throw new ResourceNotFoundException("No hospital available");
            }
            req.setHospital(hospital);
        }

        req.setStatus("DROPPED");

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        Ambulance ambulance = ambulanceRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Ambulance not found"));

        if (!req.getAmbulance().getId().equals(ambulance.getId())) {
            throw new IllegalStateException("You are not assigned to this emergency");
        }

        return mapToDTO(emergencyRepository.save(req));
    }

    @Override
    public EmergencyResponseDTO complete(Long id) {
        EmergencyRequest req = emergencyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Emergency not found"));

        validateStatus(req.getStatus(), "DROPPED");

        req.setStatus("COMPLETED");

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        Ambulance ambulance = ambulanceRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Ambulance not found"));

        if (!req.getAmbulance().getId().equals(ambulance.getId())) {
            throw new IllegalStateException("You are not assigned to this emergency");
        }

        // Release ambulance back to AVAILABLE
        ambulance.setStatus("AVAILABLE");
        ambulanceRepository.save(ambulance);

        return mapToDTO(emergencyRepository.save(req));
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmergencyResponseDTO> getActiveEmergencies() {
        return emergencyRepository
                .findByStatusIn(List.of(
                        "PENDING",
                        "ACCEPTED",
                        "PICKED_UP",
                        "DROPPED"
                ))
                .stream()
                .map(req -> {
                    if (req.getHospital() == null) {
                        Hospital nearest = findNearestHospital(req.getLatitude(), req.getLongitude());
                        if (nearest != null) {
                            req.setHospital(nearest);
                            req = emergencyRepository.save(req);
                        }
                    }
                    return mapToDTO(req);
                })
                .toList();
    }
}
