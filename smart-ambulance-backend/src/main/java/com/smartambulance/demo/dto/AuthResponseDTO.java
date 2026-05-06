package com.smartambulance.demo.dto;

public class AuthResponseDTO {

    private String token;
    private Long id; // ✅ ADD THIS

    public AuthResponseDTO(String token, Long id) {
        this.token = token;
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public Long getId() {
        return id;
    }
}