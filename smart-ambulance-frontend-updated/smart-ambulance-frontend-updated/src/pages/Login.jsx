import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../components/shared.css";
import "./auth.css";

export default function Login() {
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
      const res = await API.post("/api/users/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "user");
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleLogin(); };

  return (
    <div className="auth-page">
      {/* Left panel */}
      <div className="auth-left">
        <div className="auth-left-bg" />
        <div className="auth-left-content">
          <div className="auth-logo">
            <div className="auth-logo-icon">🚑</div>
            <span className="auth-logo-text">Smart Ambulance System</span>
          </div>
          <h1>Saving lives<br />with <span>smart</span><br />dispatch.</h1>
          <p className="auth-left-desc">
            Real-time ambulance coordination built for speed. GPS tracking, instant dispatch, and live emergency status — all in one platform.
          </p>
          <div className="auth-stat-row">
            <div className="auth-stat">
              <span className="auth-stat-num">3x</span>
              <span className="auth-stat-label">Faster response</span>
            </div>
            <div className="auth-stat">
              <span className="auth-stat-num">24/7</span>
              <span className="auth-stat-label">Live tracking</span>
            </div>
            <div className="auth-stat">
              <span className="auth-stat-num">99%</span>
              <span className="auth-stat-label">Uptime</span>
            </div>
          </div>
        </div>
        <div className="auth-left-footer">
          <p className="auth-footer-text">© 2025 Smart Ambulance System · Built for emergencies</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-right">
        <div className="auth-form-wrap page-enter">
          <div className="auth-form-title">Welcome back</div>
          <p className="auth-form-sub">Sign in to your account to continue</p>

          {error && (
            <div className="alert alert-error">
              <span>⚠</span> {error}
            </div>
          )}

          <div className="stagger">
            <div className="field">
              <label>Email address</label>
              <div className="field-input-wrap">
                <span className="f-icon">✉</span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="field">
              <label>Password</label>
              <div className="field-input-wrap">
                <span className="f-icon">🔒</span>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={handleLogin}
              disabled={loading}
              style={{ marginTop: 8 }}
            >
              {loading ? <span className="spinner" /> : null}
              {loading ? "Signing in…" : "Sign in"}
            </button>

            <div className="divider">or</div>

            <button
              className="btn btn-ghost"
              style={{ width: "100%" }}
              onClick={() => navigate("/driver-login")}
            >
              🚑 &nbsp;Sign in as Ambulance Driver
            </button>

            <button
              className="btn btn-ghost"
              style={{ width: "100%", marginTop: 10 }}
              onClick={() => navigate("/hospital-login")}
            >
              🏥 &nbsp;Sign in as Hospital
            </button>
          </div>

          <div className="auth-link-row">
            Don't have an account? &nbsp;
            <a onClick={() => navigate("/register")}>Create one</a>
          </div>
        </div>
      </div>
    </div>
  );
}
