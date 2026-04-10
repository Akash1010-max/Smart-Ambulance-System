package com.smartambulance.demo.dto;

public class AmbulanceResponseDTO {

    private Long id;
    private String driverName;
    private String email;
    private Double latitude;
    private Double longitude;
    private String status;

    public AmbulanceResponseDTO(Long id,
                                String driverName,
                                String email,
                                Double latitude,
                                Double longitude,
                                String status) {
        this.id = id;
        this.driverName = driverName;
        this.email = email;
        this.latitude = latitude;
        this.longitude = longitude;
        this.status = status;
    }

    public Long getId() { return id; }
    public String getDriverName() { return driverName; }
    public String getEmail() { return email; }
    public Double getLatitude() { return latitude; }
    public Double getLongitude() { return longitude; }
    public String getStatus() { return status; }
}