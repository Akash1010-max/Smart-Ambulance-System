package com.smartambulance.demo.service;

import java.util.List;

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

public interface AdminService {

    AuthResponseDTO login(LoginRequestDTO dto);

    UserResponseDTO createAdmin(UserRequestDTO dto);

    // ==========================================
    // Hospital Management (Admin creates login credentials)
    // ==========================================
    HospitalResponseDTO createHospital(HospitalRequestDTO dto);

    List<HospitalResponseDTO> getAllHospitals();

    HospitalResponseDTO getHospitalById(Long id);

    HospitalResponseDTO updateHospital(Long id, HospitalRequestDTO dto);

    void deleteHospital(Long id);

    // ==========================================
    // Ambulance Management (Admin creates login credentials)
    // ==========================================
    AmbulanceResponseDTO createAmbulance(AmbulanceRequestDTO dto);

    List<AmbulanceResponseDTO> getAllAmbulances();

    AmbulanceResponseDTO getAmbulanceById(Long id);

    AmbulanceResponseDTO updateAmbulance(Long id, AmbulanceRequestDTO dto);

    void deleteAmbulance(Long id);

    // ==========================================
    // Oversight & Statistics
    // ==========================================
    List<EmergencyResponseDTO> getAllEmergencies();

    AdminStatsDTO getStats();
}
