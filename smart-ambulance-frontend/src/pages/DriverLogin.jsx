import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/shared.css";
import "./auth.css";

export default function DriverLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8080/api/ambulance/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("ambulanceId", data.id);
      localStorage.setItem("role", "driver");
      navigate("/driver");
    } catch {
      setError("Invalid driver credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-bg" />
        <div className="auth-left-content">
          <div className="auth-logo">
            <div className="auth-logo-icon">🚑</div>
            <span className="auth-logo-text">Smart Ambulance System</span>
          </div>
          <h1>Driver<br /><span>Command</span><br />Center.</h1>
          <p className="auth-left-desc">
            Accept emergencies, track your route, and update patient status in real time. Built for ambulance crews who can't afford delays.
          </p>
          <div className="auth-stat-row">
            <div className="auth-stat">
              <span className="auth-stat-num">Live</span>
              <span className="auth-stat-label">GPS updates</span>
            </div>
            <div className="auth-stat">
              <span className="auth-stat-num">5s</span>
              <span className="auth-stat-label">Refresh rate</span>
            </div>
          </div>
        </div>
        <div className="auth-left-footer">
          <p className="auth-footer-text">© 2025 Smart Ambulance System · Driver Portal</p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-wrap page-enter">
          <div className="auth-form-title">Driver sign in</div>
          <p className="auth-form-sub">Access your ambulance dispatch portal</p>

          {error && (
            <div className="alert alert-error">
              <span>⚠</span> {error}
            </div>
          )}

          <div className="stagger">
            <div className="field">
              <label>Driver email</label>
              <div className="field-input-wrap">
                <span className="f-icon">✉</span>
                <input type="email" placeholder="driver@smartambulancesystem.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>

            <div className="field">
              <label>Password</label>
              <div className="field-input-wrap">
                <span className="f-icon">🔒</span>
                <input type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} />
              </div>
            </div>

            <button className="btn btn-primary" onClick={handleLogin} disabled={loading} style={{ marginTop: 8 }}>
              {loading ? <span className="spinner" /> : null}
              {loading ? "Signing in…" : "🚑  Sign in as Driver"}
            </button>

            <div className="divider">not a driver?</div>

            <button className="btn btn-ghost" style={{ width: "100%" }} onClick={() => navigate("/")}>
              ← Back to user login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
