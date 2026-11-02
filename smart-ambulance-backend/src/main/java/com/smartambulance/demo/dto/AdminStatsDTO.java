package com.smartambulance.demo.dto;

public class AdminStatsDTO {

    private long totalHospitals;
    private long totalAmbulances;
    private long availableAmbulances;
    private long busyAmbulances;
    private long totalEmergencies;
    private long pendingEmergencies;
    private long activeEmergencies;
    private long completedEmergencies;

    public AdminStatsDTO() {}

    public AdminStatsDTO(long totalHospitals, long totalAmbulances, long availableAmbulances,
                         long busyAmbulances, long totalEmergencies, long pendingEmergencies,
                         long activeEmergencies, long completedEmergencies) {
        this.totalHospitals = totalHospitals;
        this.totalAmbulances = totalAmbulances;
        this.availableAmbulances = availableAmbulances;
        this.busyAmbulances = busyAmbulances;
        this.totalEmergencies = totalEmergencies;
        this.pendingEmergencies = pendingEmergencies;
        this.activeEmergencies = activeEmergencies;
        this.completedEmergencies = completedEmergencies;
    }

    public long getTotalHospitals() {
        return totalHospitals;
    }

    public void setTotalHospitals(long totalHospitals) {
        this.totalHospitals = totalHospitals;
    }

    public long getTotalAmbulances() {
        return totalAmbulances;
    }

    public void setTotalAmbulances(long totalAmbulances) {
        this.totalAmbulances = totalAmbulances;
    }

    public long getAvailableAmbulances() {
        return availableAmbulances;
    }

    public void setAvailableAmbulances(long availableAmbulances) {
        this.availableAmbulances = availableAmbulances;
    }

    public long getBusyAmbulances() {
        return busyAmbulances;
    }

    public void setBusyAmbulances(long busyAmbulances) {
        this.busyAmbulances = busyAmbulances;
    }

    public long getTotalEmergencies() {
        return totalEmergencies;
    }

    public void setTotalEmergencies(long totalEmergencies) {
        this.totalEmergencies = totalEmergencies;
    }

    public long getPendingEmergencies() {
        return pendingEmergencies;
    }

    public void setPendingEmergencies(long pendingEmergencies) {
        this.pendingEmergencies = pendingEmergencies;
    }

    public long getActiveEmergencies() {
        return activeEmergencies;
    }

    public void setActiveEmergencies(long activeEmergencies) {
        this.activeEmergencies = activeEmergencies;
    }

    public long getCompletedEmergencies() {
        return completedEmergencies;
    }

    public void setCompletedEmergencies(long completedEmergencies) {
        this.completedEmergencies = completedEmergencies;
    }
}
