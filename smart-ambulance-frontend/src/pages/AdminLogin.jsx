import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../auth/AuthContext";
import "../components/shared.css";
import "./auth.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (overrideEmail = null, overridePassword = null) => {
    const loginEmail = overrideEmail || email;
    const loginPassword = overridePassword || password;

    if (!loginEmail || !loginPassword) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await API.post("/api/admin/login", {
        email: loginEmail,
        password: loginPassword,
      });

      const data = res.data;
      login(data.token, "ADMIN", loginEmail, { userId: data.id });
      navigate("/admin");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Invalid administrator credentials. Please check your email and password.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleFillDefaultAdmin = () => {
    setEmail("admin@smartambulance.com");
    setPassword("Admin@123");
    setError("");
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-bg" />
        <div className="auth-left-content">
          <div className="auth-logo">
            <div className="auth-logo-icon" style={{ background: "linear-gradient(135deg, #ffd166 0%, #f4a261 100%)", color: "#111" }}>
              👑
            </div>
            <span className="auth-logo-text">Smart Ambulance System</span>
          </div>
          <h1>
            Admin<br />
            <span>Control</span><br />
            Center.
          </h1>
          <p className="auth-left-desc">
            Centralized platform management. Create and manage hospital credentials, onboard ambulance fleet drivers, and oversee system emergencies.
          </p>
          <div className="auth-stat-row">
            <div className="auth-stat">
              <span className="auth-stat-num">Full</span>
              <span className="auth-stat-label">Fleet Access</span>
            </div>
            <div className="auth-stat">
              <span className="auth-stat-num">100%</span>
              <span className="auth-stat-label">Role Control</span>
            </div>
          </div>
        </div>
        <div className="auth-left-footer">
          <p className="auth-footer-text">© 2026 Smart Ambulance System · Administrator Gateway</p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-wrap page-enter">
          <div className="auth-form-title">Administrator sign in</div>
          <p className="auth-form-sub">Sign in to manage hospitals, ambulances, and dispatch systems</p>

          {error && (
            <div className="alert alert-error">
              <span>⚠</span> {error}
            </div>
          )}

          {/* Quick Demo Credentials Pill */}
          <div
            onClick={handleFillDefaultAdmin}
            style={{
              padding: "10px 14px",
              background: "rgba(255, 209, 102, 0.08)",
              border: "1px dashed rgba(255, 209, 102, 0.35)",
              borderRadius: "var(--radius-sm)",
              marginBottom: 20,
              cursor: "pointer",
              fontSize: 13,
              color: "var(--yellow)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              transition: "all 0.2s",
            }}
          >
            <span>💡 Click to fill default Admin credentials</span>
            <span style={{ fontSize: 11, background: "rgba(255,209,102,0.2)", padding: "2px 8px", borderRadius: 4 }}>
              Auto-fill
            </span>
          </div>

          <div className="stagger">
            <div className="field">
              <label>Admin email</label>
              <div className="field-input-wrap">
                <span className="f-icon">✉</span>
                <input
                  type="email"
                  placeholder="admin@smartambulance.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>
            </div>

            <div className="field">
              <label>Password</label>
              <div className="field-input-wrap">
                <span className="f-icon">🔒</span>
                <input
                  type="password"
                  placeholder="Enter administrator password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => handleLogin()}
              disabled={loading}
              style={{
                marginTop: 8,
                background: "linear-gradient(135deg, #e63946 0%, #d62828 100%)",
              }}
            >
              {loading ? <span className="spinner" /> : null}
              {loading ? "Signing in…" : "👑  Sign in as Administrator"}
            </button>

            <div className="divider">other portals</div>

            <button
              className="btn btn-ghost"
              style={{ width: "100%" }}
              onClick={() => navigate("/")}
            >
              ← Back to user login
            </button>
            <button
              className="btn btn-ghost"
              style={{ width: "100%", marginTop: 8 }}
              onClick={() => navigate("/driver-login")}
            >
              🚑 Sign in as Driver
            </button>
            <button
              className="btn btn-ghost"
              style={{ width: "100%", marginTop: 8 }}
              onClick={() => navigate("/hospital-login")}
            >
              🏥 Sign in as Hospital
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
