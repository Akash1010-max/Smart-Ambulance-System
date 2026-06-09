import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../components/shared.css";
import "./auth.css";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) { setError("Please fill in all fields."); return; }
    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    setError("");
    try {
      await API.post("/api/users/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: "USER",
      });
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
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
          <h1>Emergency help,<br />when you need<br /><span>it most.</span></h1>
          <p className="auth-left-desc">
            Join Smart Ambulance System and get access to real-time ambulance dispatch, live GPS tracking, and instant emergency response — all from your phone.
          </p>
          <div className="auth-stat-row">
            <div className="auth-stat">
              <span className="auth-stat-num">Free</span>
              <span className="auth-stat-label">To register</span>
            </div>
            <div className="auth-stat">
              <span className="auth-stat-num">&lt;1min</span>
              <span className="auth-stat-label">Setup time</span>
            </div>
          </div>
        </div>
        <div className="auth-left-footer">
          <p className="auth-footer-text">© 2025 Smart Ambulance System · Built for emergencies</p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-wrap page-enter">
          <div className="auth-form-title">Create account</div>
          <p className="auth-form-sub">Register to access emergency ambulance services</p>

          {error && (
            <div className="alert alert-error">
              <span>⚠</span> {error}
            </div>
          )}

          <div className="stagger">
            <div className="field">
              <label>Full name</label>
              <div className="field-input-wrap">
                <span className="f-icon">👤</span>
                <input placeholder="John Doe" value={form.name} onChange={set("name")} autoComplete="name" />
              </div>
            </div>

            <div className="field">
              <label>Email address</label>
              <div className="field-input-wrap">
                <span className="f-icon">✉</span>
                <input type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} autoComplete="email" />
              </div>
            </div>

            <div className="field">
              <label>Password</label>
              <div className="field-input-wrap">
                <span className="f-icon">🔒</span>
                <input type="password" placeholder="Min. 6 characters" value={form.password} onChange={set("password")} autoComplete="new-password" />
              </div>
            </div>

            <div className="field">
              <label>Confirm password</label>
              <div className="field-input-wrap">
                <span className="f-icon">🔒</span>
                <input type="password" placeholder="Repeat your password" value={form.confirmPassword} onChange={set("confirmPassword")} autoComplete="new-password" />
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={handleRegister}
              disabled={loading}
              style={{ marginTop: 8 }}
            >
              {loading ? <span className="spinner" /> : null}
              {loading ? "Creating account…" : "Create account"}
            </button>
          </div>

          <div className="auth-link-row">
            Already have an account? &nbsp;
            <a onClick={() => navigate("/")}>Sign in</a>
          </div>
        </div>
      </div>
    </div>
  );
}
