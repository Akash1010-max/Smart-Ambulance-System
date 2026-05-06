package com.smartambulance.demo.service.impl;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.smartambulance.demo.config.jwt.JwtUtil;
import com.smartambulance.demo.dto.AmbulanceRequestDTO;
import com.smartambulance.demo.dto.AmbulanceResponseDTO;
import com.smartambulance.demo.dto.AuthResponseDTO;
import com.smartambulance.demo.entity.Ambulance;
import com.smartambulance.demo.exception.InvalidCredentialsException;
import com.smartambulance.demo.exception.ResourceNotFoundException;
import com.smartambulance.demo.repository.AmbulanceRepository;
import com.smartambulance.demo.service.AmbulanceService;

@Service
public class AmbulanceServiceImpl implements AmbulanceService {

    private final AmbulanceRepository repository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    private AmbulanceResponseDTO mapToDTO(Ambulance amb) {
        return new AmbulanceResponseDTO(
                amb.getId(),
                amb.getDriverName(),
                amb.getEmail(),
                amb.getLatitude(),
                amb.getLongitude(),
                amb.getStatus()
        );
    }
    public AmbulanceServiceImpl(
            AmbulanceRepository repository,
            BCryptPasswordEncoder passwordEncoder,
            JwtUtil jwtUtil
    ) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }


    @Override
    public AmbulanceResponseDTO register(AmbulanceRequestDTO dto) {

        if (repository.existsByEmail(dto.getEmail())) {
            throw new IllegalStateException("Email already registered");
        }

        Ambulance amb = new Ambulance();
        amb.setDriverName(dto.getDriverName());
        amb.setEmail(dto.getEmail());
        amb.setPassword(passwordEncoder.encode(dto.getPassword()));
        amb.setLatitude(dto.getLatitude());
        amb.setLongitude(dto.getLongitude());
        amb.setStatus("AVAILABLE");

        Ambulance saved = repository.save(amb);

        return mapToDTO(saved);
    }

    @Override
    public AuthResponseDTO loginAmbulance(String email, String password) {

        Ambulance amb = repository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("Ambulance not found"));

        if (!passwordEncoder.matches(password, amb.getPassword())) {
            throw new InvalidCredentialsException("Wrong password");
        }

        String token = jwtUtil.generateToken(
                amb.getEmail(),
                "AMBULANCE"
        );

        return new AuthResponseDTO(token, amb.getId());
    }


    @Override
    public AmbulanceResponseDTO updateLocation(Long ambulanceId,
                                            Double latitude,
                                            Double longitude) {

        Ambulance amb = repository.findById(ambulanceId).orElseThrow();

        amb.setLatitude(latitude);
        amb.setLongitude(longitude);

        return mapToDTO(repository.save(amb));
    }
    @Override
public AmbulanceResponseDTO getAmbulance(Long id) {

    Ambulance ambulance = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Ambulance not found"));

    return mapToDTO(ambulance);

}

}
