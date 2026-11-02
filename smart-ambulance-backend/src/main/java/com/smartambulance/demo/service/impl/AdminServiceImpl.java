package com.smartambulance.demo.service.impl;

import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.smartambulance.demo.config.jwt.JwtUtil;
import com.smartambulance.demo.dto.AdminStatsDTO;
import com.smartambulance.demo.dto.AmbulanceRequestDTO;
import com.smartambulance.demo.dto.AmbulanceResponseDTO;
import com.smartambulance.demo.dto.AuthResponseDTO;
import com.smartambulance.demo.dto.EmergencyResponseDTO;
import com.smartambulance.demo.dto.HospitalRequestDTO;
import com.smartambulance.demo.dto.HospitalResponseDTO;
import com.smartambulance.demo.dto.LoginRequestDTO;
import com.smartambulance.demo.dto.UserRequestDTO;
import com.smartambulance.demo.dto.UserResponseDTO;
import com.smartambulance.demo.entity.Ambulance;
import com.smartambulance.demo.entity.EmergencyRequest;
import com.smartambulance.demo.entity.Hospital;
import com.smartambulance.demo.entity.User;
import com.smartambulance.demo.exception.InvalidCredentialsException;
import com.smartambulance.demo.exception.ResourceNotFoundException;
import com.smartambulance.demo.repository.AmbulanceRepository;
import com.smartambulance.demo.repository.EmergencyRequestRepository;
import com.smartambulance.demo.repository.HospitalRepository;
import com.smartambulance.demo.repository.UserRepository;
import com.smartambulance.demo.service.AdminService;

@Service
@Transactional
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final HospitalRepository hospitalRepository;
    private final AmbulanceRepository ambulanceRepository;
    private final EmergencyRequestRepository emergencyRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AdminServiceImpl(UserRepository userRepository,
                            HospitalRepository hospitalRepository,
                            AmbulanceRepository ambulanceRepository,
                            EmergencyRequestRepository emergencyRepository,
                            BCryptPasswordEncoder passwordEncoder,
                            JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.hospitalRepository = hospitalRepository;
        this.ambulanceRepository = ambulanceRepository;
        this.emergencyRepository = emergencyRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    private HospitalResponseDTO mapHospitalToDTO(Hospital h) {
        return new HospitalResponseDTO(
                h.getId(),
                h.getName(),
                h.getEmail(),
                h.getAddress(),
                h.getLatitude(),
                h.getLongitude()
        );
    }

    private AmbulanceResponseDTO mapAmbulanceToDTO(Ambulance amb) {
        return new AmbulanceResponseDTO(
                amb.getId(),
                amb.getDriverName(),
                amb.getEmail(),
                amb.getLatitude(),
                amb.getLongitude(),
                amb.getStatus()
        );
    }

    private EmergencyResponseDTO mapEmergencyToDTO(EmergencyRequest req) {
        return EmergencyResponseDTO.from(req);
    }

    // ==========================================
    // Admin Authentication
    // ==========================================
    @Override
    @Transactional(readOnly = true)
    public AuthResponseDTO login(LoginRequestDTO dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Admin account not found"));

        if (!"ADMIN".equalsIgnoreCase(user.getRole())) {
            throw new InvalidCredentialsException("Access denied: Account is not an administrator");
        }

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getEmail(), "ADMIN");
        return new AuthResponseDTO(token, user.getId());
    }

    @Override
    public UserResponseDTO createAdmin(UserRequestDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalStateException("Email already registered");
        }

        User admin = new User();
        admin.setName(dto.getName());
        admin.setEmail(dto.getEmail());
        admin.setPassword(passwordEncoder.encode(dto.getPassword()));
        admin.setRole("ADMIN");

        User saved = userRepository.save(admin);
        return new UserResponseDTO(saved.getId(), saved.getName(), saved.getEmail());
    }

    // ==========================================
    // Hospital Management
    // ==========================================
    @Override
    public HospitalResponseDTO createHospital(HospitalRequestDTO dto) {
        if (hospitalRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalStateException("Hospital email already registered");
        }

        Hospital hospital = new Hospital();
        hospital.setName(dto.getName());
        hospital.setEmail(dto.getEmail());
        hospital.setPassword(passwordEncoder.encode(dto.getPassword()));
        hospital.setAddress(dto.getAddress());
        hospital.setLatitude(dto.getLatitude());
        hospital.setLongitude(dto.getLongitude());

        Hospital saved = hospitalRepository.save(hospital);
        return mapHospitalToDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<HospitalResponseDTO> getAllHospitals() {
        return hospitalRepository.findAll()
                .stream()
                .map(this::mapHospitalToDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public HospitalResponseDTO getHospitalById(Long id) {
        Hospital hospital = hospitalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with id: " + id));
        return mapHospitalToDTO(hospital);
    }

    @Override
    public HospitalResponseDTO updateHospital(Long id, HospitalRequestDTO dto) {
        Hospital hospital = hospitalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with id: " + id));

        // Check if updating to an email that belongs to another hospital
        if (!hospital.getEmail().equalsIgnoreCase(dto.getEmail()) && hospitalRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalStateException("Hospital email already in use by another hospital");
        }

        hospital.setName(dto.getName());
        hospital.setEmail(dto.getEmail());
        hospital.setAddress(dto.getAddress());
        hospital.setLatitude(dto.getLatitude());
        hospital.setLongitude(dto.getLongitude());

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            hospital.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        Hospital updated = hospitalRepository.save(hospital);
        return mapHospitalToDTO(updated);
    }

    @Override
    public void deleteHospital(Long id) {
        Hospital hospital = hospitalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with id: " + id));
        hospitalRepository.delete(hospital);
    }

    // ==========================================
    // Ambulance Management
    // ==========================================
    @Override
    public AmbulanceResponseDTO createAmbulance(AmbulanceRequestDTO dto) {
        if (ambulanceRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalStateException("Ambulance email already registered");
        }

        Ambulance amb = new Ambulance();
        amb.setDriverName(dto.getDriverName());
        amb.setEmail(dto.getEmail());
        amb.setPassword(passwordEncoder.encode(dto.getPassword()));
        amb.setLatitude(dto.getLatitude() != null ? dto.getLatitude() : 12.9716);
        amb.setLongitude(dto.getLongitude() != null ? dto.getLongitude() : 77.5946);
        amb.setStatus("AVAILABLE");

        Ambulance saved = ambulanceRepository.save(amb);
        return mapAmbulanceToDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AmbulanceResponseDTO> getAllAmbulances() {
        return ambulanceRepository.findAll()
                .stream()
                .map(this::mapAmbulanceToDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AmbulanceResponseDTO getAmbulanceById(Long id) {
        Ambulance amb = ambulanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ambulance not found with id: " + id));
        return mapAmbulanceToDTO(amb);
    }

    @Override
    public AmbulanceResponseDTO updateAmbulance(Long id, AmbulanceRequestDTO dto) {
        Ambulance amb = ambulanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ambulance not found with id: " + id));

        if (!amb.getEmail().equalsIgnoreCase(dto.getEmail()) && ambulanceRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalStateException("Ambulance email already in use by another ambulance");
        }

        amb.setDriverName(dto.getDriverName());
        amb.setEmail(dto.getEmail());
        if (dto.getLatitude() != null) amb.setLatitude(dto.getLatitude());
        if (dto.getLongitude() != null) amb.setLongitude(dto.getLongitude());

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            amb.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        Ambulance updated = ambulanceRepository.save(amb);
        return mapAmbulanceToDTO(updated);
    }

    @Override
    public void deleteAmbulance(Long id) {
        Ambulance amb = ambulanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ambulance not found with id: " + id));
        ambulanceRepository.delete(amb);
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

    // ==========================================
    // Emergencies & System Stats
    // ==========================================
    @Override
    @Transactional(readOnly = true)
    public List<EmergencyResponseDTO> getAllEmergencies() {
        return emergencyRepository.findAll()
                .stream()
                .map(req -> {
                    if (req.getHospital() == null) {
                        Hospital nearest = findNearestHospital(req.getLatitude(), req.getLongitude());
                        if (nearest != null) {
                            req.setHospital(nearest);
                            req = emergencyRepository.save(req);
                        }
                    }
                    return mapEmergencyToDTO(req);
                })
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AdminStatsDTO getStats() {
        long totalHospitals = hospitalRepository.count();
        long totalAmbulances = ambulanceRepository.count();
        long availableAmbulances = ambulanceRepository.countByStatus("AVAILABLE");
        long busyAmbulances = ambulanceRepository.countByStatus("BUSY");
        long totalEmergencies = emergencyRepository.count();
        long pendingEmergencies = emergencyRepository.countByStatus("PENDING");
        long activeEmergencies = emergencyRepository.countByStatusIn(
                List.of("PENDING", "ACCEPTED", "PICKED_UP", "DROPPED")
        );
        long completedEmergencies = emergencyRepository.countByStatus("COMPLETED");

        return new AdminStatsDTO(
                totalHospitals,
                totalAmbulances,
                availableAmbulances,
                busyAmbulances,
                totalEmergencies,
                pendingEmergencies,
                activeEmergencies,
                completedEmergencies
        );
    }
}
