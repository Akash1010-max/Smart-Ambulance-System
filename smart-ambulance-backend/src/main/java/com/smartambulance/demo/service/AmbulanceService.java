package com.smartambulance.demo.service;

import com.smartambulance.demo.dto.AmbulanceRequestDTO;
import com.smartambulance.demo.dto.AmbulanceResponseDTO;
import com.smartambulance.demo.dto.AuthResponseDTO;

public interface AmbulanceService {

    AmbulanceResponseDTO register(AmbulanceRequestDTO dto);

    AuthResponseDTO loginAmbulance(String email, String password);

    AmbulanceResponseDTO updateLocation(Long ambulanceId,Double latitude,Double longitude);

    AmbulanceResponseDTO getAmbulance(Long id);
}
