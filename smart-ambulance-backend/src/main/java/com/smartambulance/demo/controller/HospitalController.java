package com.smartambulance.demo.controller;

import com.smartambulance.demo.dto.AuthResponseDTO;
import com.smartambulance.demo.dto.EmergencyResponseDTO;
import com.smartambulance.demo.dto.HospitalRequestDTO;
import com.smartambulance.demo.dto.HospitalResponseDTO;
import com.smartambulance.demo.entity.Hospital;
import com.smartambulance.demo.service.HospitalService;

import jakarta.validation.Valid;

import java.util.List;


import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/hospital")
public class HospitalController {

    private final HospitalService service;

    public HospitalController(HospitalService service) {
        this.service = service;
    }

    @PostMapping("/register")
    public HospitalResponseDTO register(@Valid @RequestBody HospitalRequestDTO dto) {
        return service.registerHospital(dto);
    }

    @PostMapping("/login")
    public AuthResponseDTO login(@RequestBody Hospital hospital) {
        return service.loginHospital(
                hospital.getEmail(),
                hospital.getPassword()
        );
    }

    @GetMapping("/completed")
    public List<EmergencyResponseDTO> getCompleted() {
        return service.getCompletedEmergencies();
    }
}
