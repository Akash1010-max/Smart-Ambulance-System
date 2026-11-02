package com.smartambulance.demo.dto;

public class HospitalResponseDTO {

    private Long id;
    private String name;
    private String email;
    private String address;
    private Double latitude;
    private Double longitude;

    public HospitalResponseDTO(Long id,
                               String name,
                               String email,
                               String address) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.address = address;
    }

    public HospitalResponseDTO(Long id,
                               String name,
                               String email,
                               String address,
                               Double latitude,
                               Double longitude) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getAddress() { return address; }
    public Double getLatitude() { return latitude; }
    public Double getLongitude() { return longitude; }
}