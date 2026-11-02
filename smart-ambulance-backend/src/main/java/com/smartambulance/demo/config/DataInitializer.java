package com.smartambulance.demo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.smartambulance.demo.entity.User;
import com.smartambulance.demo.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Value("${admin.default.email:admin@smartambulance.com}")
    private String defaultAdminEmail;

    @Value("${admin.default.password:Admin@123}")
    private String defaultAdminPassword;

    @Value("${admin.default.name:System Administrator}")
    private String defaultAdminName;

    public DataInitializer(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail(defaultAdminEmail)) {
            User admin = new User();
            admin.setName(defaultAdminName);
            admin.setEmail(defaultAdminEmail);
            admin.setPassword(passwordEncoder.encode(defaultAdminPassword));
            admin.setRole("ADMIN");

            userRepository.save(admin);
            System.out.println(">>> [DataInitializer] Initialized default admin account: " + defaultAdminEmail);
        }
    }
}
