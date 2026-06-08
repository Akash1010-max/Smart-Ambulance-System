import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../components/shared.css";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const name = localStorage.getItem("userName") || "User";

  return (
    <div className="dash-page">
      <Navbar role="user" />
      <div className="dash-content page-enter">

        {/* Hero section */}
        <div className="dash-hero">
          <div className="dash-hero-inner">
            <div className="dash-hero-label">
              <span className="pulse-dot green" />
              System Online
            </div>
            <h1 className="dash-hero-title">
              How can we help<br />you today?
            </h1>
            <p className="dash-hero-sub">
              Smart Ambulance System connects you to the nearest available ambulance in seconds.
              Click below to request emergency assistance.
            </p>
            <button
              className="btn btn-primary dash-hero-btn"
              onClick={() => navigate("/emergency")}
            >
              🚨 &nbsp;Request Emergency Ambulance
            </button>
          </div>
          <div className="dash-hero-visual">
            <div className="dash-radar">
              <div className="radar-ring r1" />
              <div className="radar-ring r2" />
              <div className="radar-ring r3" />
              <div className="radar-center">🚑</div>
              <div className="radar-dot d1" />
              <div className="radar-dot d2" />
              <div className="radar-dot d3" />
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="dash-stats stagger">
          <div className="dash-stat-card">
            <div className="dash-stat-icon" style={{ background: "rgba(230,57,70,0.1)", color: "var(--red)" }}>🚑</div>
            <div>
              <div className="dash-stat-value">~4 min</div>
              <div className="dash-stat-label">Avg. response time</div>
            </div>
          </div>
          <div className="dash-stat-card">
            <div className="dash-stat-icon" style={{ background: "rgba(46,204,113,0.1)", color: "var(--green)" }}>📍</div>
            <div>
              <div className="dash-stat-value">Live GPS</div>
              <div className="dash-stat-label">Real-time tracking</div>
            </div>
          </div>
          <div className="dash-stat-card">
            <div className="dash-stat-icon" style={{ background: "rgba(72,202,228,0.1)", color: "var(--cyan)" }}>🏥</div>
            <div>
              <div className="dash-stat-value">24/7</div>
              <div className="dash-stat-label">Always available</div>
            </div>
          </div>
          <div className="dash-stat-card">
            <div className="dash-stat-icon" style={{ background: "rgba(255,209,102,0.1)", color: "var(--yellow)" }}>⚡</div>
            <div>
              <div className="dash-stat-value">Instant</div>
              <div className="dash-stat-label">Dispatch notification</div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="dash-section">
          <div className="dash-section-title">How it works</div>
          <div className="dash-steps stagger">
            {[
              { step: "01", icon: "📍", title: "Share your location", desc: "We use your GPS to pinpoint your exact location instantly." },
              { step: "02", icon: "🚑", title: "We dispatch nearest unit", desc: "Our system finds and assigns the closest available ambulance." },
              { step: "03", icon: "🗺️", title: "Track in real time", desc: "Watch the ambulance on the map as it drives to you." },
              { step: "04", icon: "🏥", title: "Arrive at hospital", desc: "Your case is handed off smoothly to the receiving hospital." },
            ].map(s => (
              <div key={s.step} className="dash-step-card">
                <div className="dash-step-num">{s.step}</div>
                <div className="dash-step-icon">{s.icon}</div>
                <div className="dash-step-title">{s.title}</div>
                <div className="dash-step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
