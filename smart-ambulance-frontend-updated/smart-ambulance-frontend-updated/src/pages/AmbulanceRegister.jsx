import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/shared.css";
import "./auth.css";

export default function AmbulanceRegister() {
  const [form, setForm] = useState({ driverName: "", email: "", password: "", vehicleNumber: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleRegister = async () => {
    if (!form.driverName || !form.email || !form.password || !form.vehicleNumber) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8080/api/ambulance/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSuccess(true);
      setTimeout(() => navigate("/driver-login"), 2000);
    } catch {
      setError("Registration failed. Please try again.");
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
          <h1>Register your<br /><span>ambulance</span><br />unit.</h1>
          <p className="auth-left-desc">
            Join the Smart Ambulance System driver network. Once registered, you'll receive emergency dispatch requests directly to your dashboard.
          </p>
          <div className="auth-stat-row">
            <div className="auth-stat">
              <span className="auth-stat-num">Free</span>
              <span className="auth-stat-label">To register</span>
            </div>
            <div className="auth-stat">
              <span className="auth-stat-num">Live</span>
              <span className="auth-stat-label">Dispatch alerts</span>
            </div>
          </div>
        </div>
        <div className="auth-left-footer">
          <p className="auth-footer-text">© 2025 Smart Ambulance System · Driver Portal</p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-wrap page-enter">
          <div className="auth-form-title">Register ambulance</div>
          <p className="auth-form-sub">Create a driver account to start receiving emergencies</p>

          {error && <div className="alert alert-error"><span>⚠</span> {error}</div>}
          {success && <div className="alert alert-success"><span>✓</span> Registered successfully! Redirecting to login…</div>}

          <div className="stagger">
            <div className="field">
              <label>Driver name *</label>
              <div className="field-input-wrap">
                <span className="f-icon">👤</span>
                <input placeholder="Full name" value={form.driverName} onChange={set("driverName")} />
              </div>
            </div>

            <div className="field">
              <label>Email address *</label>
              <div className="field-input-wrap">
                <span className="f-icon">✉</span>
                <input type="email" placeholder="driver@example.com" value={form.email} onChange={set("email")} />
              </div>
            </div>

            <div className="field">
              <label>Password *</label>
              <div className="field-input-wrap">
                <span className="f-icon">🔒</span>
                <input type="password" placeholder="Min. 6 characters" value={form.password} onChange={set("password")} />
              </div>
            </div>

            <div className="field">
              <label>Vehicle number *</label>
              <div className="field-input-wrap">
                <span className="f-icon">🚑</span>
                <input placeholder="TN 01 AB 1234" value={form.vehicleNumber} onChange={set("vehicleNumber")} />
              </div>
            </div>

            <div className="field">
              <label>Phone number</label>
              <div className="field-input-wrap">
                <span className="f-icon">📞</span>
                <input type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={set("phone")} />
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={handleRegister}
              disabled={loading || success}
              style={{ marginTop: 8 }}
            >
              {loading ? <span className="spinner" /> : null}
              {loading ? "Registering…" : "🚑  Register Ambulance"}
            </button>
          </div>

          <div className="auth-link-row">
            Already registered? &nbsp;
            <a onClick={() => navigate("/driver-login")}>Driver sign in</a>
          </div>
        </div>
      </div>
    </div>
  );
}
