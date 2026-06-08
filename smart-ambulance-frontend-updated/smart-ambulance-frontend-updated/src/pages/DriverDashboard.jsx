import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import "../components/shared.css";
import "./DriverDashboard.css";

const statusConfig = {
  PENDING:   { label: "Pending",    badge: "badge-pending",  nextAction: "Accept",    nextLabel: "Accept Emergency", btnStyle: "btn-accept" },
  ACCEPTED:  { label: "Accepted",   badge: "badge-accepted", nextAction: "pickup",    nextLabel: "Mark Picked Up",   btnStyle: "btn-pickup" },
  PICKED_UP: { label: "Picked Up",  badge: "badge-picked",   nextAction: "drop",      nextLabel: "Drop at Hospital", btnStyle: "btn-drop" },
  DROPPED:   { label: "Dropped",    badge: "badge-dropped",  nextAction: "complete",  nextLabel: "Complete Case",    btnStyle: "btn-complete" },
  COMPLETED: { label: "Completed",  badge: "badge-completed",nextAction: null,        nextLabel: null,               btnStyle: "" },
};

export default function DriverDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [gpsStatus, setGpsStatus] = useState("idle");
  const ambulanceId = localStorage.getItem("ambulanceId");

  const fetchEmergencies = async () => {
    try {
      const res = await API.get("/api/emergency/active");
      setRequests(res.data);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchEmergencies(); }, []);
  useEffect(() => {
    const interval = setInterval(fetchEmergencies, 5000);
    return () => clearInterval(interval);
  }, []);

  // GPS heartbeat
  useEffect(() => {
    if (!navigator.geolocation || !ambulanceId) return;
    const sendGPS = () => {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          await API.put(`/api/ambulance/location/${ambulanceId}?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
          setGpsStatus("active");
        } catch { setGpsStatus("error"); }
      }, () => setGpsStatus("error"));
    };
    sendGPS();
    const interval = setInterval(sendGPS, 3000);
    return () => clearInterval(interval);
  }, [ambulanceId]);

  const handleAction = async (action, reqId) => {
    setActionLoading(reqId);
    try {
      if (action === "Accept") {
        await API.put(`/api/emergency/assign/${reqId}/${ambulanceId}`);
      } else if (action === "pickup") {
        await API.put(`/api/emergency/${reqId}/pickup`);
      } else if (action === "drop") {
        await API.put(`/api/emergency/${reqId}/drop`);
      } else if (action === "complete") {
        await API.put(`/api/emergency/${reqId}/complete`);
      }
      await fetchEmergencies();
    } catch { /* silent */ }
    finally { setActionLoading(null); }
  };

  const pending   = requests.filter(r => r.status === "PENDING");
  const active    = requests.filter(r => ["ACCEPTED","PICKED_UP","DROPPED"].includes(r.status));

  return (
    <div className="drv-page">
      <Navbar role="driver" />
      <div className="drv-content page-enter">

        {/* Header row */}
        <div className="drv-header">
          <div>
            <h1 className="drv-title">Driver Dashboard</h1>
            <p className="drv-sub">Manage active emergency requests in real time</p>
          </div>
          <div className="drv-status-bar">
            <div className={`drv-gps-pill ${gpsStatus}`}>
              <span className={`pulse-dot ${gpsStatus === "active" ? "green" : "red"}`} />
              {gpsStatus === "active" ? "GPS Live" : gpsStatus === "error" ? "GPS Error" : "GPS Starting…"}
            </div>
            <div className="drv-count-pill">
              {pending.length} pending
            </div>
            <div className="drv-count-pill" style={{ borderColor: "rgba(72,202,228,0.25)", color: "var(--cyan)" }}>
              {active.length} active
            </div>
          </div>
        </div>

        {loading ? (
          <div className="drv-loader">
            <div className="spinner" style={{ width: 32, height: 32 }} />
            <span>Loading emergencies…</span>
          </div>
        ) : requests.length === 0 ? (
          <div className="drv-empty">
            <div className="drv-empty-icon">🚑</div>
            <div className="drv-empty-title">No active emergencies</div>
            <div className="drv-empty-sub">You're all caught up. New requests will appear here automatically.</div>
          </div>
        ) : (
          <>
            {pending.length > 0 && (
              <div className="drv-section">
                <div className="drv-section-title">
                  <span className="pulse-dot red" />
                  Pending Requests
                </div>
                <div className="drv-cards stagger">
                  {pending.map(req => (
                    <EmergencyCard
                      key={req.id}
                      req={req}
                      onAction={handleAction}
                      loading={actionLoading === req.id}
                    />
                  ))}
                </div>
              </div>
            )}

            {active.length > 0 && (
              <div className="drv-section">
                <div className="drv-section-title">
                  <span className="pulse-dot green" />
                  Active Cases
                </div>
                <div className="drv-cards stagger">
                  {active.map(req => (
                    <EmergencyCard
                      key={req.id}
                      req={req}
                      onAction={handleAction}
                      loading={actionLoading === req.id}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function EmergencyCard({ req, onAction, loading }) {
  const cfg = statusConfig[req.status] || statusConfig["PENDING"];
  const timeAgo = req.createdAt
    ? Math.round((Date.now() - new Date(req.createdAt).getTime()) / 60000) + " min ago"
    : "Just now";

  return (
    <div className={`drv-card ${req.status.toLowerCase()}`}>
      <div className="drv-card-top">
        <div className="drv-card-id">
          <span>Emergency</span>
          <span className="drv-id-num">#{req.id}</span>
        </div>
        <span className={`badge ${cfg.badge}`}>{cfg.label}</span>
      </div>

      <div className="drv-card-body">
        <div className="drv-coord-row">
          <div className="drv-coord">
            <span className="drv-coord-label">Latitude</span>
            <span className="drv-coord-val">{Number(req.latitude).toFixed(6)}</span>
          </div>
          <div className="drv-coord">
            <span className="drv-coord-label">Longitude</span>
            <span className="drv-coord-val">{Number(req.longitude).toFixed(6)}</span>
          </div>
          <div className="drv-coord">
            <span className="drv-coord-label">Reported</span>
            <span className="drv-coord-val">{timeAgo}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="drv-progress">
          {["PENDING","ACCEPTED","PICKED_UP","DROPPED","COMPLETED"].map((s, i, arr) => {
            const cur = arr.indexOf(req.status);
            return (
              <div key={s} className={`drv-prog-dot ${i <= cur ? "done" : ""} ${i === cur ? "active" : ""}`} />
            );
          })}
          <div className="drv-prog-line" />
        </div>
      </div>

      {cfg.nextAction && (
        <div className="drv-card-footer">
          <a
            href={`https://maps.google.com/?q=${req.latitude},${req.longitude}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost btn-sm"
          >
            🗺 Navigate
          </a>
          <button
            className={`btn btn-sm drv-action-btn ${cfg.btnStyle}`}
            onClick={() => onAction(cfg.nextAction, req.id)}
            disabled={loading}
          >
            {loading ? <span className="spinner" style={{ width: 14, height: 14 }} /> : null}
            {loading ? "Updating…" : cfg.nextLabel}
          </button>
        </div>
      )}
    </div>
  );
}
