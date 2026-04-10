package com.smartambulance.demo.repository;

import com.smartambulance.demo.entity.Ambulance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface AmbulanceRepository
        extends JpaRepository<Ambulance, Long> {

    // Find ambulance by email (for login)
    Optional<Ambulance> findByEmail(String email);

    // Check if email already exists
    boolean existsByEmail(String email);

    // Get ambulance by id
    Optional<Ambulance> findById(Long id);

    // Get all ambulances
    List<Ambulance> findAll();

}