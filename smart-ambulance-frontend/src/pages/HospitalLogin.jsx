import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/shared.css";
import "./auth.css";

export default function HospitalLogin() {
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
      const res = await fetch("http://localhost:8080/api/hospital/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("hospitalId", data.id);
      localStorage.setItem("role", "hospital");
      navigate("/hospital");
    } catch {
      setError("Invalid hospital credentials. Please try again.");
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
            <div className="auth-logo-icon">🏥</div>
            <span className="auth-logo-text">Smart Ambulance System</span>
          </div>
          <h1>Hospital<br /><span>Operations</span><br />Portal.</h1>
          <p className="auth-left-desc">
            Monitor incoming patients, view completed emergency cases, and coordinate with dispatch teams — all from your hospital dashboard.
          </p>
          <div className="auth-stat-row">
            <div className="auth-stat">
              <span className="auth-stat-num">Live</span>
              <span className="auth-stat-label">Patient updates</span>
            </div>
            <div className="auth-stat">
              <span className="auth-stat-num">Full</span>
              <span className="auth-stat-label">Case history</span>
            </div>
          </div>
        </div>
        <div className="auth-left-footer">
          <p className="auth-footer-text">© 2025 Smart Ambulance System · Hospital Portal</p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-wrap page-enter">
          <div className="auth-form-title">Hospital sign in</div>
          <p className="auth-form-sub">Access your hospital operations dashboard</p>

          {error && (
            <div className="alert alert-error">
              <span>⚠</span> {error}
            </div>
          )}

          <div className="stagger">
            <div className="field">
              <label>Hospital email</label>
              <div className="field-input-wrap">
                <span className="f-icon">✉</span>
                <input type="email" placeholder="admin@hospital.com" value={email} onChange={e => setEmail(e.target.value)} />
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
              {loading ? "Signing in…" : "🏥  Sign in as Hospital"}
            </button>

            <div className="divider">not a hospital?</div>

            <button className="btn btn-ghost" style={{ width: "100%" }} onClick={() => navigate("/")}>
              ← Back to user login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
