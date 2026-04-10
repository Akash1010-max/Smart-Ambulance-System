package com.smartambulance.demo.dto;

import java.time.LocalDateTime;

public class EmergencyResponseDTO {

    private Long id;
    private double latitude;
    private double longitude;
    private String status;
    private LocalDateTime createdAt;
    private Long userId;
    private Long ambulanceId;
    private Long hospitalId;

    public EmergencyResponseDTO(Long id, double latitude, double longitude,
                            String status, LocalDateTime createdAt,
                            Long userId, Long ambulanceId, Long hospitalId){
        this.id = id;
        this.latitude = latitude;
        this.longitude = longitude;
        this.status = status;
        this.createdAt = createdAt;
        this.userId = userId;
        this.ambulanceId = ambulanceId;
        this.hospitalId = hospitalId;
    }

    public Long getId() { return id; }
    public double getLatitude() { return latitude; }
    public double getLongitude() { return longitude; }
    public String getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public Long getUserId() { return userId; }
    public Long getAmbulanceId() { return ambulanceId; }
    public Long getHospitalId() { return hospitalId; }
    
}