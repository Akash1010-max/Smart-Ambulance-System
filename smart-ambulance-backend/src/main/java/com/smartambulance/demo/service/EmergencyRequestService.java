package com.smartambulance.demo.service;

import java.util.List;

import com.smartambulance.demo.dto.EmergencyResponseDTO;

public interface EmergencyRequestService {

    EmergencyResponseDTO createEmergency(double lat, double lon);

    List<EmergencyResponseDTO> getPendingEmergencies();

    // NEW
    List<EmergencyResponseDTO> getActiveEmergencies();

    EmergencyResponseDTO assignAmbulance(Long emergencyId, Long ambulanceId);

    EmergencyResponseDTO pickup(Long id);

    EmergencyResponseDTO drop(Long id);

    EmergencyResponseDTO complete(Long id);
}