package com.smartambulance.demo.dto;

public class HospitalResponseDTO {

    private Long id;
    private String name;
    private String email;
    private String address;

    public HospitalResponseDTO(Long id,
                               String name,
                               String email,
                               String address) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.address = address;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getAddress() { return address; }
}