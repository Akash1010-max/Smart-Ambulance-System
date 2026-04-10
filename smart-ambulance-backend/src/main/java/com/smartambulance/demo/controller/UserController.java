package com.smartambulance.demo.controller;

import com.smartambulance.demo.dto.AuthResponseDTO;
import com.smartambulance.demo.dto.UserRequestDTO;
import com.smartambulance.demo.dto.UserResponseDTO;
import com.smartambulance.demo.dto.LoginRequestDTO;
import com.smartambulance.demo.service.UserService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public UserResponseDTO register(@Valid 
            @RequestBody UserRequestDTO dto) {
        return userService.register(dto);
    }

    @PostMapping("/login")
    public AuthResponseDTO login(@RequestBody LoginRequestDTO dto) {
        return userService.login(dto.getEmail(), dto.getPassword());
    }


}
