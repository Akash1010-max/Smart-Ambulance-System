package com.smartambulance.demo.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

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
public class EmergencyRequestServiceImpl
        implements EmergencyRequestService {
                
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
        return new EmergencyResponseDTO(
                req.getId(),
                req.getLatitude(),
                req.getLongitude(),
                req.getStatus(),
                req.getCreatedAt(),
                req.getUser().getId(),
                req.getAmbulance() != null ? req.getAmbulance().getId() : null,
                req.getHospital() != null ? req.getHospital().getId() : null
        );
    }

    @Override
    public EmergencyResponseDTO createEmergency(double lat, double lon) {

        // Get logged-in user email from JWT
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
                
        System.out.println("Logged user email: " + email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        EmergencyRequest request = new EmergencyRequest();
        request.setLatitude(lat);
        request.setLongitude(lon);
        request.setStatus("PENDING");
        request.setCreatedAt(LocalDateTime.now());
        request.setUser(user);

        boolean exists = emergencyRepository
                .existsByUserAndStatusIn(user,
                        List.of("PENDING","ACCEPTED","PICKED_UP","DROPPED"));

        if(exists){
           throw new RuntimeException("User already has active emergency");
        }
        
        EmergencyRequest saved = emergencyRepository.save(request);

        return mapToDTO(saved);
    }

    @Override
    public List<EmergencyResponseDTO> getPendingEmergencies() {

        return emergencyRepository.findByStatus("PENDING")
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Override
    public EmergencyResponseDTO assignAmbulance(Long requestId,
                                        Long ambulanceId) {

        EmergencyRequest request = emergencyRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Emergency not found"));
        
        if (!request.getStatus().equals("PENDING")) {
                throw new IllegalStateException("Emergency already accepted");
        }

        Ambulance ambulance = ambulanceRepository.findById(ambulanceId)
                .orElseThrow(() -> new ResourceNotFoundException("Ambulance not found"));
        
        boolean busy = emergencyRepository
                .existsByAmbulanceAndStatusIn(ambulance,
                        List.of("ACCEPTED","PICKED_UP","DROPPED"));

        if (busy) {
                throw new IllegalStateException("Ambulance already on duty");
        }

        request.setAmbulance(ambulance);
        request.setStatus("ACCEPTED");

        EmergencyRequest saved = emergencyRepository.save(request);

        return mapToDTO(saved);
    }

    private void validateStatus(String current, String expected) {
        if (!current.equals(expected)) {
                throw new IllegalStateException("Invalid status transition");
        }
    }

    //pickup
    @Override
    public EmergencyResponseDTO pickup(Long id) {

    EmergencyRequest req = emergencyRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Emergency not found"));

     validateStatus(req.getStatus(), "ACCEPTED");

     req.setStatus("PICKED_UP");

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

    //drop
    @Override
        public EmergencyResponseDTO drop(Long id) {

        EmergencyRequest req = emergencyRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Emergency not found"));

        validateStatus(req.getStatus(), "PICKED_UP");
        
        Hospital hospital = hospitalRepository.findAll()
                .stream()
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("No hospital available"));

        req.setHospital(hospital);

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


    //complete
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

        return mapToDTO(emergencyRepository.save(req));
        }
    @Override
public List<EmergencyResponseDTO> getActiveEmergencies() {

    return emergencyRepository
            .findByStatusIn(List.of(
                    "PENDING",
                    "ACCEPTED",
                    "PICKED_UP",
                    "DROPPED"
            ))
            .stream()
            .map(this::mapToDTO)
            .toList();
}
}
