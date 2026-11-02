package com.smartambulance.demo.dto;

import java.time.LocalDateTime;

import com.smartambulance.demo.entity.EmergencyRequest;

public class EmergencyResponseDTO {

    private Long id;
    private double latitude;
    private double longitude;
    private String status;
    private LocalDateTime createdAt;

    // Patient info
    private Long userId;
    private String userName;
    private String userEmail;

    // Ambulance info
    private Long ambulanceId;
    private String ambulanceDriverName;

    // Hospital info
    private Long hospitalId;
    private String hospitalName;
    private String hospitalAddress;
    private Double hospitalLatitude;
    private Double hospitalLongitude;

    public EmergencyResponseDTO() {}

    // Legacy constructor for backwards compatibility
    public EmergencyResponseDTO(Long id, double latitude, double longitude,
                                String status, LocalDateTime createdAt,
                                Long userId, Long ambulanceId, Long hospitalId) {
        this.id = id;
        this.latitude = latitude;
        this.longitude = longitude;
        this.status = status;
        this.createdAt = createdAt;
        this.userId = userId;
        this.ambulanceId = ambulanceId;
        this.hospitalId = hospitalId;
    }

    // Full constructor
    public EmergencyResponseDTO(Long id, double latitude, double longitude,
                                String status, LocalDateTime createdAt,
                                Long userId, String userName, String userEmail,
                                Long ambulanceId, String ambulanceDriverName,
                                Long hospitalId, String hospitalName, String hospitalAddress,
                                Double hospitalLatitude, Double hospitalLongitude) {
        this.id = id;
        this.latitude = latitude;
        this.longitude = longitude;
        this.status = status;
        this.createdAt = createdAt;
        this.userId = userId;
        this.userName = userName;
        this.userEmail = userEmail;
        this.ambulanceId = ambulanceId;
        this.ambulanceDriverName = ambulanceDriverName;
        this.hospitalId = hospitalId;
        this.hospitalName = hospitalName;
        this.hospitalAddress = hospitalAddress;
        this.hospitalLatitude = hospitalLatitude;
        this.hospitalLongitude = hospitalLongitude;
    }

    // Static mapper helper
    public static EmergencyResponseDTO from(EmergencyRequest req) {
        if (req == null) return null;
        return new EmergencyResponseDTO(
                req.getId(),
                req.getLatitude(),
                req.getLongitude(),
                req.getStatus(),
                req.getCreatedAt(),
                req.getUser() != null ? req.getUser().getId() : null,
                req.getUser() != null ? req.getUser().getName() : null,
                req.getUser() != null ? req.getUser().getEmail() : null,
                req.getAmbulance() != null ? req.getAmbulance().getId() : null,
                req.getAmbulance() != null ? req.getAmbulance().getDriverName() : null,
                req.getHospital() != null ? req.getHospital().getId() : null,
                req.getHospital() != null ? req.getHospital().getName() : null,
                req.getHospital() != null ? req.getHospital().getAddress() : null,
                req.getHospital() != null ? req.getHospital().getLatitude() : null,
                req.getHospital() != null ? req.getHospital().getLongitude() : null
        );
    }

    public Long getId() { return id; }
    public double getLatitude() { return latitude; }
    public double getLongitude() { return longitude; }
    public String getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public Long getUserId() { return userId; }
    public String getUserName() { return userName; }
    public String getUserEmail() { return userEmail; }

    public Long getAmbulanceId() { return ambulanceId; }
    public String getAmbulanceDriverName() { return ambulanceDriverName; }

    public Long getHospitalId() { return hospitalId; }
    public String getHospitalName() { return hospitalName; }
    public String getHospitalAddress() { return hospitalAddress; }
    public Double getHospitalLatitude() { return hospitalLatitude; }
    public Double getHospitalLongitude() { return hospitalLongitude; }
}
