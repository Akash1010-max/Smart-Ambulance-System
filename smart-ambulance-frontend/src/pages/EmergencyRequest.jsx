import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { useToast } from "../components/Toast";
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

const hospitalIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/4320/4320371.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
});

const STATUS_STEPS = [
  { key: "PENDING",   label: "Request sent",       icon: "📡" },
  { key: "ACCEPTED",  label: "Ambulance en route", icon: "🚑" },
  { key: "PICKED_UP", label: "Patient picked up",   icon: "👤" },
  { key: "DROPPED",   label: "At hospital",         icon: "🏥" },
  { key: "COMPLETED", label: "Case completed",      icon: "✅" },
];

// Helper component to smoothly center/pan Leaflet map on coordinates
function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 14, { animate: true });
    }
  }, [center, map]);
  return null;
}

export default function EmergencyRequest() {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState(null);
  const [ambulanceLocation, setAmbulanceLocation] = useState(null);
  const [emergencyStatus, setEmergencyStatus] = useState(null);
  const [emergencyId, setEmergencyId] = useState(null);
  const [activeDetails, setActiveDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [requested, setRequested] = useState(false);
  const [error, setError] = useState("");

  const { toast } = useToast();

  // API Key & Tile Layer Configuration
  const envCartoKey = import.meta.env.VITE_CARTO_API_KEY || "";
  const [cartoApiKey, setCartoApiKey] = useState(
    () => localStorage.getItem("carto_api_key") || envCartoKey
  );

  const [tileProvider, setTileProvider] = useState(() => {
    const saved = localStorage.getItem("map_tile_provider");
    if (saved) return saved;
    return (localStorage.getItem("carto_api_key") || envCartoKey) ? "carto_dark" : "osm_dark";
  });

  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(cartoApiKey);

  // Restore ongoing emergency on page load / refresh
  useEffect(() => {
    const checkActive = async () => {
      try {
        const res = await API.get("/api/emergency/my-active");
        if (res.data && res.data.id) {
          setEmergencyId(res.data.id);
          setEmergencyStatus(res.data.status);
          setActiveDetails(res.data);
          setUserLocation([res.data.latitude, res.data.longitude]);
          setRequested(true);

          if (res.data.ambulanceId) {
            try {
              const ambRes = await API.get(`/api/ambulance/id/${res.data.ambulanceId}`);
              if (ambRes.data.latitude && ambRes.data.longitude) {
                setAmbulanceLocation([ambRes.data.latitude, ambRes.data.longitude]);
              }
            } catch {
              /* ambulance location lookup silent */
            }
          }
        }
      } catch {
        /* No active emergency or error */
      }
    };
    checkActive();
  }, []);

  const handleSaveApiKey = (e) => {
    e.preventDefault();
    const trimmed = apiKeyInput.trim();
    setCartoApiKey(trimmed);
    localStorage.setItem("carto_api_key", trimmed);

    if (trimmed) {
      setTileProvider("carto_dark");
      localStorage.setItem("map_tile_provider", "carto_dark");
      toast("CARTO API key applied! Dark Matter tiles active.", "success");
    } else {
      setTileProvider("osm_dark");
      localStorage.setItem("map_tile_provider", "osm_dark");
      toast("API key cleared. Switched to Free Dark Map.", "info");
    }
    setShowKeyModal(false);
  };

  const handleProviderChange = (providerId) => {
    setTileProvider(providerId);
    localStorage.setItem("map_tile_provider", providerId);
    if (providerId === "carto_dark" && !cartoApiKey) {
      setShowKeyModal(true);
    } else {
      toast(`Map style switched to: ${providerId === "osm_dark" ? "Dark Mode" : providerId === "carto_dark" ? "CARTO Dark" : "Standard"}`, "info");
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
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
    if (!userLocation) {
      setError("Please get your GPS location first.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await API.post(
        `/api/emergency/create?lat=${userLocation[0]}&lon=${userLocation[1]}`
      );
      setEmergencyId(res.data.id);
      setEmergencyStatus("PENDING");
      setActiveDetails(res.data);
      setRequested(true);
      toast("Emergency request broadcasted! Finding nearest ambulance…", "success");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send emergency request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch ambulance location + emergency status from dedicated patient endpoint
  const fetchAmbulanceData = async () => {
    try {
      const res = await API.get("/api/emergency/my-active");
      if (res.data && res.data.id) {
        setEmergencyStatus(res.data.status);
        setActiveDetails(res.data);
        if (res.data.ambulanceId) {
          const ambRes = await API.get(`/api/ambulance/id/${res.data.ambulanceId}`);
          if (ambRes.data.latitude && ambRes.data.longitude) {
            setAmbulanceLocation([ambRes.data.latitude, ambRes.data.longitude]);
          }
        }
      } else {
        // If my-active returned 204 or empty, emergency might have completed
        if (emergencyStatus && emergencyStatus !== "COMPLETED" && emergencyStatus !== "CANCELLED") {
          setEmergencyStatus("COMPLETED");
        }
      }
    } catch {
      /* silent */
    }
  };

  useEffect(() => {
    if (!requested || emergencyStatus === "COMPLETED" || emergencyStatus === "CANCELLED") return;
    const interval = setInterval(fetchAmbulanceData, 4000);
    return () => clearInterval(interval);
  }, [requested, emergencyId, emergencyStatus]);

  const handleCancel = async () => {
    if (!emergencyId) return;
    if (!window.confirm("Are you sure you want to cancel this emergency request?")) return;
    setCancelling(true);
    try {
      await API.put(`/api/emergency/${emergencyId}/cancel`);
      toast("Emergency request has been cancelled.", "info");
      handleReset();
    } catch (err) {
      toast(err.response?.data?.message || "Failed to cancel emergency.", "error");
    } finally {
      setCancelling(false);
    }
  };

  const handleReset = () => {
    setRequested(false);
    setEmergencyId(null);
    setEmergencyStatus(null);
    setActiveDetails(null);
    setAmbulanceLocation(null);
    setError("");
  };

  const currentStep = STATUS_STEPS.findIndex((s) => s.key === emergencyStatus);

  // Compute tile URL & attribution based on current selection and API key
  let tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  let attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  let isDarkFilter = tileProvider === "osm_dark";

  if (tileProvider === "carto_dark") {
    if (cartoApiKey) {
      tileUrl = `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?api_key=${cartoApiKey}`;
    } else {
      tileUrl = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
    }
    attribution = '&copy; <a href="https://carto.com/">CARTO</a>';
    isDarkFilter = false;
  }

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
                      <div className="emer-step-desc">
                        We need your GPS coordinates to find the nearest ambulance
                      </div>
                    </div>
                  </div>
                  <button
                    className={`btn ${userLocation ? "btn-ghost" : "btn-primary"}`}
                    style={{ width: "100%", marginTop: 12 }}
                    onClick={getLocation}
                    disabled={locLoading}
                  >
                    {locLoading ? <span className="spinner" /> : null}
                    {locLoading
                      ? "Getting location…"
                      : userLocation
                      ? "✓  Location captured"
                      : "📍  Get My Location"}
                  </button>
                  {userLocation && (
                    <div className="emer-coords">
                      <span>Lat: {userLocation[0].toFixed(5)}</span>
                      <span>Lon: {userLocation[1].toFixed(5)}</span>
                    </div>
                  )}
                </div>

                {/* Step 2 */}
                <div
                  className={`emer-step-card ${!userLocation ? "emer-step-disabled" : ""}`}
                >
                  <div className="emer-step-header">
                    <div className="emer-step-num">02</div>
                    <div>
                      <div className="emer-step-label">Request ambulance</div>
                      <div className="emer-step-desc">
                        Dispatch the nearest available unit to your location
                      </div>
                    </div>
                  </div>
                  <button
                    className="btn btn-primary"
                    style={{
                      width: "100%",
                      marginTop: 12,
                      background: "#e63946",
                      boxShadow: "0 4px 24px rgba(230,57,70,0.4)",
                    }}
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
                    <span className={`pulse-dot ${emergencyStatus === "COMPLETED" ? "green" : "red"}`} />
                    <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-1)" }}>
                      {emergencyStatus === "COMPLETED" ? "Case Completed" : "Emergency Active"}
                    </span>
                    <span style={{ fontSize: 12, color: "var(--text-3)", marginLeft: "auto" }}>
                      ID #{emergencyId}
                    </span>
                  </div>

                  <div className="emer-timeline">
                    {STATUS_STEPS.map((s, i) => (
                      <div
                        key={s.key}
                        className={`emer-timeline-item ${
                          i < currentStep ? "done" : i === currentStep ? "active" : "pending"
                        }`}
                      >
                        <div className="emer-tl-icon">{i < currentStep ? "✓" : s.icon}</div>
                        <div className="emer-tl-label">{s.label}</div>
                        {i < STATUS_STEPS.length - 1 && <div className="emer-tl-line" />}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assigned Ambulance Card */}
                {activeDetails?.ambulanceId ? (
                  <div className="card" style={{ padding: "16px", background: "rgba(72,202,228,0.06)", border: "1px solid rgba(72,202,228,0.2)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--cyan)" }}>
                        🚑 Assigned Ambulance
                      </span>
                      <span className="badge badge-accepted">En Route</span>
                    </div>
                    <div style={{ marginTop: 8, fontSize: 13, color: "var(--text-1)" }}>
                      <strong>Driver:</strong> {activeDetails.ambulanceDriverName || `Unit #${activeDetails.ambulanceId}`}
                    </div>
                    {ambulanceLocation && (
                      <div style={{ marginTop: 4, fontSize: 12, color: "var(--text-2)" }}>
                        GPS: {ambulanceLocation[0].toFixed(4)}, {ambulanceLocation[1].toFixed(4)}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="card" style={{ padding: "14px", fontSize: 13, color: "var(--text-3)", textAlign: "center" }}>
                    📡 Broadcasted to nearby ambulances. Awaiting driver acceptance…
                  </div>
                )}

                {/* Assigned Hospital Card */}
                {activeDetails?.hospitalName && (
                  <div className="card" style={{ padding: "16px", background: "rgba(46,204,113,0.06)", border: "1px solid rgba(46,204,113,0.2)" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--green)", marginBottom: 4 }}>
                      🏥 Receiving Hospital
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-1)" }}>
                      {activeDetails.hospitalName}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-2)", marginTop: 4 }}>
                      📍 {activeDetails.hospitalAddress || "Address on record"}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
                  {emergencyStatus === "PENDING" && (
                    <button
                      className="btn btn-ghost-red btn-sm"
                      style={{ width: "100%" }}
                      onClick={handleCancel}
                      disabled={cancelling}
                    >
                      {cancelling ? "Cancelling…" : "✕ Cancel Emergency Request"}
                    </button>
                  )}

                  {emergencyStatus === "COMPLETED" && (
                    <div style={{ display: "flex", gap: 10 }}>
                      <button
                        className="btn btn-primary btn-sm"
                        style={{ flex: 1 }}
                        onClick={handleReset}
                      >
                        🚨 New Request
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ flex: 1 }}
                        onClick={() => navigate("/dashboard")}
                      >
                        Home Dashboard
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Map Section */}
          <div className="emer-map-wrap">
            <div className="map-control-overlay">
              <button
                className="map-control-btn"
                onClick={() =>
                  handleProviderChange(
                    tileProvider === "osm_dark"
                      ? "osm_standard"
                      : tileProvider === "osm_standard"
                      ? "carto_dark"
                      : "osm_dark"
                  )
                }
                title="Cycle map themes"
              >
                <span>
                  {tileProvider === "osm_dark"
                    ? "🌙 Dark Map (Free)"
                    : tileProvider === "carto_dark"
                    ? "🛰️ CARTO"
                    : "🗺️ Streets"}
                </span>
              </button>

              <button
                className="map-control-btn"
                style={{
                  borderColor: cartoApiKey ? "var(--green)" : "rgba(255,209,102,0.4)",
                  color: cartoApiKey ? "var(--green)" : "var(--yellow)",
                }}
                onClick={() => {
                  setApiKeyInput(cartoApiKey);
                  setShowKeyModal(true);
                }}
                title="Configure CARTO API Key"
              >
                <span>🔑 {cartoApiKey ? "API Key Active" : "Set API Key"}</span>
              </button>
            </div>

            {userLocation ? (
              <MapContainer
                center={userLocation}
                zoom={14}
                style={{ height: "100%", width: "100%", borderRadius: "16px" }}
              >
                <MapRecenter center={userLocation} />
                <TileLayer
                  key={`${tileProvider}-${cartoApiKey}`}
                  url={tileUrl}
                  attribution={attribution}
                  className={isDarkFilter ? "dark-tiles" : ""}
                />
                <Marker position={userLocation} icon={userIcon}>
                  <Popup>📍 Your Location</Popup>
                </Marker>

                {ambulanceLocation && (
                  <Marker position={ambulanceLocation} icon={ambulanceIcon}>
                    <Popup>
                      🚑 {activeDetails?.ambulanceDriverName ? `Ambulance (${activeDetails.ambulanceDriverName})` : "Ambulance en route"}
                    </Popup>
                  </Marker>
                )}

                {activeDetails?.hospitalLatitude && activeDetails?.hospitalLongitude && (
                  <Marker
                    position={[activeDetails.hospitalLatitude, activeDetails.hospitalLongitude]}
                    icon={hospitalIcon}
                  >
                    <Popup>
                      🏥 {activeDetails.hospitalName || "Hospital"}
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
            ) : (
              <div className="emer-map-placeholder">
                <div className="emer-map-ph-icon">🗺️</div>
                <div className="emer-map-ph-text">Map will appear after location is shared</div>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ marginTop: 8 }}
                  onClick={getLocation}
                >
                  📍 Share GPS Location
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MODAL: MAP API KEY SETTINGS ── */}
      {showKeyModal && (
        <div className="modal-overlay" onClick={() => setShowKeyModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🗺️ Map Basemap & API Key Settings</h3>
              <button className="modal-close-btn" onClick={() => setShowKeyModal(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveApiKey}>
              <div className="modal-body">
                <p style={{ color: "var(--text-2)", fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>
                  CARTO basemaps require an authorized API key. You can paste your key below, or use the watermark-free Dark Mode tile provider.
                </p>

                <div className="field">
                  <label>CARTO Basemaps API Key</label>
                  <input
                    type="text"
                    placeholder="e.g. default_public or your-carto-key"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                  />
                  <span style={{ fontSize: 11, color: "var(--text-3)", marginTop: 4 }}>
                    Get your key at{" "}
                    <a
                      href="https://carto.com/basemaps/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--cyan)", textDecoration: "underline" }}
                    >
                      carto.com/basemaps/apikey
                    </a>
                  </span>
                </div>

                <div
                  style={{
                    padding: "12px 16px",
                    background: "rgba(72, 202, 228, 0.08)",
                    border: "1px solid rgba(72, 202, 228, 0.2)",
                    borderRadius: "var(--radius-sm)",
                    marginTop: 12,
                    fontSize: 12,
                    color: "var(--cyan)",
                    lineHeight: 1.5,
                  }}
                >
                  💡 <strong>No API key?</strong> Simply leave it blank and choose <strong>"Dark Mode (Free)"</strong> to enjoy high-tech dark maps without any watermarks or limitations.
                </div>
              </div>

              <div className="modal-footer">
                {cartoApiKey && (
                  <button
                    type="button"
                    className="btn btn-ghost-red btn-sm"
                    onClick={() => {
                      setApiKeyInput("");
                      setCartoApiKey("");
                      localStorage.removeItem("carto_api_key");
                      setTileProvider("osm_dark");
                      localStorage.setItem("map_tile_provider", "osm_dark");
                      setShowKeyModal(false);
                      toast("API key removed. Free Dark Map enabled.", "info");
                    }}
                  >
                    Clear Key
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowKeyModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save & Apply Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
