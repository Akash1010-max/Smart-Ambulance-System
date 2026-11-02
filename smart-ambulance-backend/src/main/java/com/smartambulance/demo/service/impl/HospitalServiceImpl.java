package com.smartambulance.demo.service.impl;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

@Service
@Transactional
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
                h.getAddress(),
                h.getLatitude(),
                h.getLongitude()
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
        hospital.setLatitude(dto.getLatitude() != null ? dto.getLatitude() : 12.9716);
        hospital.setLongitude(dto.getLongitude() != null ? dto.getLongitude() : 77.5946);

        Hospital saved = repository.save(hospital);
        return mapToDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
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

        return new AuthResponseDTO(token, hospital.getId());
    }

    private EmergencyResponseDTO mapEmergencyToDTO(EmergencyRequest req) {
        return EmergencyResponseDTO.from(req);
    }

    @Override
    @Transactional(readOnly = true)
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

    @Override
    @Transactional(readOnly = true)
    public List<EmergencyResponseDTO> getMyEmergencies() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        Hospital hospital = repository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("Hospital not found"));

        return emergencyRepository.findByHospitalId(hospital.getId())
                .stream()
                .map(this::mapEmergencyToDTO)
                .toList();
    }
}
