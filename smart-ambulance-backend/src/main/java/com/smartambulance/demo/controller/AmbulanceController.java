package com.smartambulance.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.smartambulance.demo.dto.AmbulanceRequestDTO;
import com.smartambulance.demo.dto.AmbulanceResponseDTO;
import com.smartambulance.demo.dto.AuthResponseDTO;
import com.smartambulance.demo.entity.Ambulance;
import com.smartambulance.demo.service.AmbulanceService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/ambulance")
public class AmbulanceController {

    private final AmbulanceService service;

    public AmbulanceController(AmbulanceService service) {
        this.service = service;
    }

    // ===============================
    // Register Ambulance Driver
    // ===============================
    @PostMapping("/register")
    public AmbulanceResponseDTO register(@Valid @RequestBody AmbulanceRequestDTO dto) {

        return service.register(dto);

    }

    // ===============================
    // Ambulance Login
    // ===============================
    @PostMapping("/login")
    public AuthResponseDTO login(@RequestBody Ambulance ambulance) {

        return service.loginAmbulance(
                ambulance.getEmail(),
                ambulance.getPassword()
        );

    }

    // ===============================
    // Update Ambulance GPS Location
    // ===============================
    @PutMapping("/location/{id}")
    public AmbulanceResponseDTO updateLocation(
            @PathVariable Long id,
            @RequestParam Double lat,
            @RequestParam Double lon) {

        return service.updateLocation(id, lat, lon);

    }

// Get Ambulance Location
// ===============================
@GetMapping("/id/{id}")
public AmbulanceResponseDTO getAmbulance(@PathVariable Long id) {

    return service.getAmbulance(id);

}
}