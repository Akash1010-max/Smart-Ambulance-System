package com.smartambulance.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.smartambulance.demo.dto.EmergencyResponseDTO;
import com.smartambulance.demo.service.EmergencyRequestService;

@RestController
@RequestMapping("/api/emergency")
public class EmergencyRequestController {

    private final EmergencyRequestService service;

    public EmergencyRequestController(EmergencyRequestService service) {
        this.service = service;
    }

    // User creates emergency
    @PostMapping("/create")
    public EmergencyResponseDTO create(
            @RequestParam double lat,
            @RequestParam double lon) {

        return service.createEmergency(lat, lon);
    }

    // Driver sees pending emergencies
    @GetMapping("/pending")
    public List<EmergencyResponseDTO> getPending() {
        return service.getPendingEmergencies();
    }

    // NEW: driver sees active emergencies
    @GetMapping("/active")
    public List<EmergencyResponseDTO> getActive() {
        return service.getActiveEmergencies();
    }

    // Ambulance accepts emergency
    @PutMapping("/assign/{requestId}/{ambulanceId}")
    public EmergencyResponseDTO assignAmbulance(
            @PathVariable Long requestId,
            @PathVariable Long ambulanceId) {
        return service.assignAmbulance(requestId, ambulanceId);
    }

    @PutMapping("/{id}/pickup")
    public EmergencyResponseDTO pickup(@PathVariable Long id) {
        return service.pickup(id);
    }

    @PutMapping("/{id}/drop")
    public EmergencyResponseDTO drop(@PathVariable Long id) {
        return service.drop(id);
    }

    @PutMapping("/{id}/complete")
    public EmergencyResponseDTO complete(@PathVariable Long id) {
        return service.complete(id);
    }
}