package com.smartambulance.demo.service.impl;

import com.smartambulance.demo.config.jwt.JwtUtil;
import com.smartambulance.demo.dto.AuthResponseDTO;
import com.smartambulance.demo.dto.EmergencyResponseDTO;
import com.smartambulance.demo.dto.HospitalRequestDTO;
import com.smartambulance.demo.dto.HospitalResponseDTO;
import com.smartambulance.demo.entity.EmergencyRequest;
import com.smartambulance.demo.entity.Hospital;
import com.smartambulance.demo.exception.InvalidCredentialsException;
import com.smartambulance.demo.exception.ResourceNotFoundException;
import com.smartambulance.demo.repository.EmergencyRequestRepository;
import com.smartambulance.demo.repository.HospitalRepository;
import com.smartambulance.demo.service.HospitalService;
import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class HospitalServiceImpl implements HospitalService {

    private final HospitalRepository repository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmergencyRequestRepository emergencyRepository;

    public HospitalServiceImpl(
            HospitalRepository repository,
            BCryptPasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            EmergencyRequestRepository emergencyRepository
    ) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.emergencyRepository = emergencyRepository;
    }

    private HospitalResponseDTO mapToDTO(Hospital h) {
        return new HospitalResponseDTO(
                h.getId(),
                h.getName(),
                h.getEmail(),
                h.getAddress()
        );
    }

    @Override
    public HospitalResponseDTO registerHospital(HospitalRequestDTO dto) {

        if (repository.existsByEmail(dto.getEmail())) {
            throw new IllegalStateException("Email already registered");
        }

        Hospital hospital = new Hospital();
        hospital.setName(dto.getName());
        hospital.setEmail(dto.getEmail());
        hospital.setPassword(passwordEncoder.encode(dto.getPassword()));
        hospital.setAddress(dto.getAddress());

        Hospital saved = repository.save(hospital);

        return mapToDTO(saved);
    }

    @Override
    public AuthResponseDTO loginHospital(String email, String password) {

        Hospital hospital = repository.findByEmail(email)
        .orElseThrow(() -> new ResourceNotFoundException("Hospital not found"));

        if (!passwordEncoder.matches(password, hospital.getPassword())) {
            throw new InvalidCredentialsException("Wrong password");
        }

        String token = jwtUtil.generateToken(
                hospital.getEmail(),
                "HOSPITAL"
        );

        return new AuthResponseDTO(token);
    }

    private EmergencyResponseDTO mapEmergencyToDTO(EmergencyRequest req) {
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

    public List<EmergencyResponseDTO> getCompletedEmergencies() {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        Hospital hospital = repository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found"));

        return emergencyRepository
                .findByHospitalIdAndStatus(hospital.getId(), "COMPLETED")
                .stream()
                .map(this::mapEmergencyToDTO)
                .toList();
    }

    public List<EmergencyResponseDTO> getMyEmergencies() {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        Hospital hospital = repository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("Hospital not found"));

        return emergencyRepository.findByHospitalId(hospital.getId())
                .stream()
                .map(e -> new EmergencyResponseDTO(
                        e.getId(),
                        e.getLatitude(),
                        e.getLongitude(),
                        e.getStatus(),
                        e.getCreatedAt(),
                        e.getUser().getId(),
                        e.getAmbulance() != null ? e.getAmbulance().getId() : null,
                        e.getHospital() != null ? e.getHospital().getId() : null
                ))
                .toList();
    }
}
