package com.smartambulance.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smartambulance.demo.entity.Ambulance;
import com.smartambulance.demo.entity.EmergencyRequest;
import com.smartambulance.demo.entity.User;

public interface EmergencyRequestRepository 
        extends JpaRepository<EmergencyRequest, Long> {

    List<EmergencyRequest> findByStatus(String status);
    
    List<EmergencyRequest> findByStatusIn(List<String> statuses);

    boolean existsByUserAndStatusIn(User user, List<String> statuses);

    boolean existsByAmbulanceAndStatusIn(Ambulance ambulance, List<String> statuses);

    List<EmergencyRequest> findByHospitalId(Long hospitalId);

    List<EmergencyRequest> findByHospitalIdAndStatus(Long hospitalId, String status);
}
