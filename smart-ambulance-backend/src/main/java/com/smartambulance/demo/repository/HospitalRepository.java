package com.smartambulance.demo.repository;

import com.smartambulance.demo.entity.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface HospitalRepository
        extends JpaRepository<Hospital, Long> {

    Optional<Hospital> findByEmail(String email);

    boolean existsByEmail(String email);
}
