package com.smartambulance.demo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

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
import com.smartambulance.demo.service.AdminService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // ==========================================
    // Admin Authentication & Account Setup
    // ==========================================
    @PostMapping("/login")
    public AuthResponseDTO login(@Valid @RequestBody LoginRequestDTO dto) {
        return adminService.login(dto);
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponseDTO createAdmin(@Valid @RequestBody UserRequestDTO dto) {
        return adminService.createAdmin(dto);
    }

    // ==========================================
    // System Overview & Emergencies
    // ==========================================
    @GetMapping("/stats")
    public AdminStatsDTO getStats() {
        return adminService.getStats();
    }

    @GetMapping("/emergencies")
    public List<EmergencyResponseDTO> getAllEmergencies() {
        return adminService.getAllEmergencies();
    }

    // ==========================================
    // Hospital Management (Create Hospital Login, View, Update, Delete)
    // ==========================================
    @PostMapping("/hospitals")
    @ResponseStatus(HttpStatus.CREATED)
    public HospitalResponseDTO createHospital(@Valid @RequestBody HospitalRequestDTO dto) {
        return adminService.createHospital(dto);
    }

    @GetMapping("/hospitals")
    public List<HospitalResponseDTO> getAllHospitals() {
        return adminService.getAllHospitals();
    }

    @GetMapping("/hospitals/{id}")
    public HospitalResponseDTO getHospitalById(@PathVariable Long id) {
        return adminService.getHospitalById(id);
    }

    @PutMapping("/hospitals/{id}")
    public HospitalResponseDTO updateHospital(@PathVariable Long id, @Valid @RequestBody HospitalRequestDTO dto) {
        return adminService.updateHospital(id, dto);
    }

    @DeleteMapping("/hospitals/{id}")
    public ResponseEntity<Void> deleteHospital(@PathVariable Long id) {
        adminService.deleteHospital(id);
        return ResponseEntity.noContent().build();
    }

    // ==========================================
    // Ambulance Management (Create Ambulance Login, View, Update, Delete)
    // ==========================================
    @PostMapping("/ambulances")
    @ResponseStatus(HttpStatus.CREATED)
    public AmbulanceResponseDTO createAmbulance(@Valid @RequestBody AmbulanceRequestDTO dto) {
        return adminService.createAmbulance(dto);
    }

    @GetMapping("/ambulances")
    public List<AmbulanceResponseDTO> getAllAmbulances() {
        return adminService.getAllAmbulances();
    }

    @GetMapping("/ambulances/{id}")
    public AmbulanceResponseDTO getAmbulanceById(@PathVariable Long id) {
        return adminService.getAmbulanceById(id);
    }

    @PutMapping("/ambulances/{id}")
    public AmbulanceResponseDTO updateAmbulance(@PathVariable Long id, @Valid @RequestBody AmbulanceRequestDTO dto) {
        return adminService.updateAmbulance(id, dto);
    }

    @DeleteMapping("/ambulances/{id}")
    public ResponseEntity<Void> deleteAmbulance(@PathVariable Long id) {
        adminService.deleteAmbulance(id);
        return ResponseEntity.noContent().build();
    }
}
