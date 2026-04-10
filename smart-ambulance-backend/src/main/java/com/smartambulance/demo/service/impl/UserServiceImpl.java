package com.smartambulance.demo.service.impl;

import com.smartambulance.demo.dto.AuthResponseDTO;
import com.smartambulance.demo.dto.UserRequestDTO;
import com.smartambulance.demo.dto.UserResponseDTO;
import com.smartambulance.demo.entity.User;
import com.smartambulance.demo.exception.InvalidCredentialsException;
import com.smartambulance.demo.exception.UserNotFoundException;
import com.smartambulance.demo.repository.UserRepository;
import com.smartambulance.demo.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.smartambulance.demo.config.jwt.JwtUtil;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserServiceImpl(UserRepository userRepository,
                        BCryptPasswordEncoder passwordEncoder,
                        JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }


    @Override
    public UserResponseDTO register(UserRequestDTO dto) {

        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());

        // ✅ Encrypt password
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole("USER");

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalStateException("Email already registered");
        }
        
        User saved = userRepository.save(user);

        return new UserResponseDTO(
                saved.getId(),
                saved.getName(),
                saved.getEmail()
        );
    }

    @Override
    public AuthResponseDTO login(String email, String password) {

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new InvalidCredentialsException("Wrong password");
        }

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole()
        );


        return new AuthResponseDTO(token);
    }


}

