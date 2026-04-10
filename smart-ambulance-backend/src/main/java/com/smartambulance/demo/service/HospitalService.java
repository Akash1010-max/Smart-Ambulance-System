package com.smartambulance.demo.service;

import com.smartambulance.demo.dto.AuthResponseDTO;
import com.smartambulance.demo.dto.EmergencyResponseDTO;
import com.smartambulance.demo.dto.HospitalRequestDTO;
import com.smartambulance.demo.dto.HospitalResponseDTO;

import java.util.List;

public interface HospitalService {

    HospitalResponseDTO registerHospital(HospitalRequestDTO dto);

    List<EmergencyResponseDTO> getCompletedEmergencies();

    AuthResponseDTO loginHospital(String email, String password);

}
