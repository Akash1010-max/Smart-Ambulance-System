import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import API from "../services/api";
import Navbar from "../components/Navbar";
import "../components/shared.css";
import "./EmergencyRequest.css";

const ambulanceIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2967/2967350.png",
  iconSize: [42, 42],
  iconAnchor: [21, 21],
});

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3177/3177361.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
});

const STATUS_STEPS = [
  { key: "PENDING",   label: "Request sent",     icon: "📡" },
  { key: "ACCEPTED",  label: "Ambulance en route", icon: "🚑" },
  { key: "PICKED_UP", label: "Patient picked up", icon: "👤" },
  { key: "DROPPED",   label: "At hospital",       icon: "🏥" },
  { key: "COMPLETED", label: "Case completed",    icon: "✅" },
];

export default function EmergencyRequest() {
  const [userLocation, setUserLocation] = useState(null);
  const [ambulanceLocation, setAmbulanceLocation] = useState(null);
  const [emergencyStatus, setEmergencyStatus] = useState(null);
  const [emergencyId, setEmergencyId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [requested, setRequested] = useState(false);
  const [error, setError] = useState("");

  const getLocation = () => {
    if (!navigator.geolocation) { setError("Geolocation is not supported by your browser."); return; }
    setLocLoading(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        setLocLoading(false);
      },
      () => {
        setError("Could not get your location. Please allow location access.");
        setLocLoading(false);
      }
    );
  };

  const requestAmbulance = async () => {
    if (!userLocation) { setError("Please get your GPS location first."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await API.post(`/api/emergency/create?lat=${userLocation[0]}&lon=${userLocation[1]}`);
      setEmergencyId(res.data.id);
      setEmergencyStatus("PENDING");
      setRequested(true);
    } catch {
      setError("Failed to send emergency request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch ambulance location + emergency status
  const fetchAmbulanceData = async () => {
    try {
      const active = await API.get("/api/emergency/active");
      const myEmergency = emergencyId
        ? active.data.find(e => e.id === emergencyId)
        : active.data[0];
      if (myEmergency) {
        setEmergencyStatus(myEmergency.status);
        if (myEmergency.ambulanceId) {
          const ambRes = await API.get(`/api/ambulance/id/${myEmergency.ambulanceId}`);
          if (ambRes.data.latitude && ambRes.data.longitude) {
            setAmbulanceLocation([ambRes.data.latitude, ambRes.data.longitude]);
          }
        }
      }
    } catch { /* silent */ }
  };

  useEffect(() => {
    if (!requested) return;
    const interval = setInterval(fetchAmbulanceData, 4000);
    return () => clearInterval(interval);
  }, [requested, emergencyId]);

  const currentStep = STATUS_STEPS.findIndex(s => s.key === emergencyStatus);

  return (
    <div className="emer-page">
      <Navbar role="user" />
      <div className="emer-content page-enter">

        <div className="emer-grid">
          {/* Left panel */}
          <div className="emer-left">
            <div className="emer-panel-title">
              <span>🚨</span> Emergency Request
            </div>

            {error && (
              <div className="alert alert-error" style={{ marginBottom: 20 }}>
                <span>⚠</span> {error}
              </div>
            )}

            {!requested ? (
              <>
                {/* Step 1 */}
                <div className="emer-step-card">
                  <div className="emer-step-header">
                    <div className="emer-step-num">01</div>
                    <div>
                      <div className="emer-step-label">Get your location</div>
                      <div className="emer-step-desc">We need your GPS coordinates to find the nearest ambulance</div>
                    </div>
                  </div>
                  <button
                    className={`btn ${userLocation ? "btn-ghost" : "btn-primary"}`}
                    style={{ width: "100%", marginTop: 12 }}
                    onClick={getLocation}
                    disabled={locLoading}
                  >
                    {locLoading ? <span className="spinner" /> : null}
                    {locLoading ? "Getting location…" : userLocation ? "✓  Location captured" : "📍  Get My Location"}
                  </button>
                  {userLocation && (
                    <div className="emer-coords">
                      <span>Lat: {userLocation[0].toFixed(5)}</span>
                      <span>Lon: {userLocation[1].toFixed(5)}</span>
                    </div>
                  )}
                </div>

                {/* Step 2 */}
                <div className={`emer-step-card ${!userLocation ? "emer-step-disabled" : ""}`}>
                  <div className="emer-step-header">
                    <div className="emer-step-num">02</div>
                    <div>
                      <div className="emer-step-label">Request ambulance</div>
                      <div className="emer-step-desc">Dispatch the nearest available unit to your location</div>
                    </div>
                  </div>
                  <button
                    className="btn btn-primary"
                    style={{ width: "100%", marginTop: 12, background: "#e63946", boxShadow: "0 4px 24px rgba(230,57,70,0.4)" }}
                    onClick={requestAmbulance}
                    disabled={!userLocation || loading}
                  >
                    {loading ? <span className="spinner" /> : null}
                    {loading ? "Dispatching…" : "🚨  Request Emergency Ambulance"}
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Status tracker */}
                <div className="emer-status-card">
                  <div className="emer-status-header">
                    <span className="pulse-dot red" />
                    <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-1)" }}>Emergency Active</span>
                    <span style={{ fontSize: 12, color: "var(--text-3)", marginLeft: "auto" }}>Live updates</span>
                  </div>

                  <div className="emer-timeline">
                    {STATUS_STEPS.map((s, i) => (
                      <div key={s.key} className={`emer-timeline-item ${i < currentStep ? "done" : i === currentStep ? "active" : "pending"}`}>
                        <div className="emer-tl-icon">{i < currentStep ? "✓" : s.icon}</div>
                        <div className="emer-tl-label">{s.label}</div>
                        {i < STATUS_STEPS.length - 1 && <div className="emer-tl-line" />}
                      </div>
                    ))}
                  </div>
                </div>

                {ambulanceLocation && (
                  <div className="emer-info-row">
                    <div className="emer-info-item">
                      <span className="emer-info-label">Ambulance</span>
                      <span className="emer-info-value">{ambulanceLocation[0].toFixed(4)}, {ambulanceLocation[1].toFixed(4)}</span>
                    </div>
                    <div className="emer-info-item">
                      <span className="emer-info-label">Status</span>
                      <span className={`badge badge-${(emergencyStatus || "pending").toLowerCase().replace("_", "-")}`}>
                        {emergencyStatus?.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Map */}
          <div className="emer-map-wrap">
            {userLocation ? (
              <MapContainer center={userLocation} zoom={14} style={{ height: "100%", width: "100%", borderRadius: "16px" }}>
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                />
                <Marker position={userLocation} icon={userIcon}>
                  <Popup>📍 Your location</Popup>
                </Marker>
                {ambulanceLocation && (
                  <Marker position={ambulanceLocation} icon={ambulanceIcon}>
                    <Popup>🚑 Ambulance en route</Popup>
                  </Marker>
                )}
              </MapContainer>
            ) : (
              <div className="emer-map-placeholder">
                <div className="emer-map-ph-icon">🗺️</div>
                <div className="emer-map-ph-text">Map will appear after location is shared</div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
