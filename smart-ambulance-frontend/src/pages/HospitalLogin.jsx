import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../components/shared.css";
import "./auth.css";

export default function HospitalLogin() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {

    if (!email || !password) {

      setError("Please fill in all fields.");
      return;

    }

    setLoading(true);
    setError("");

    try {

      const res = await API.post("/api/hospital/login", {
        email: email,
        password: password
      });

      const data = res.data;

      // Save auth details
      localStorage.setItem("token", data.token);
      localStorage.setItem("hospitalId", data.id);
      localStorage.setItem("role", "hospital");

      navigate("/hospital");

    } catch (err) {

      console.error(err);

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

            <span className="auth-logo-text">
              SwiftAid
            </span>

          </div>

          <h1>
            Hospital
            <br />
            <span>Operations</span>
            <br />
            Portal.
          </h1>

          <p className="auth-left-desc">
            Monitor incoming patients, track ambulance
            dispatches, and manage emergency cases
            in real time.
          </p>

        </div>

      </div>

      <div className="auth-right">

        <div className="auth-form-wrap page-enter">

          <div className="auth-form-title">
            Hospital sign in
          </div>

          <p className="auth-form-sub">
            Access your hospital dashboard
          </p>

          {error && (

            <div className="alert alert-error">
              <span>⚠</span> {error}
            </div>

          )}

          <div className="stagger">

            <div className="field">

              <label>Hospital Email</label>

              <div className="field-input-wrap">

                <span className="f-icon">✉</span>

                <input
                  type="email"
                  placeholder="hospital@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleLogin();
                    }
                  }}
                />

              </div>

            </div>

            <button
              className="btn btn-primary"
              onClick={handleLogin}
              disabled={loading}
              style={{ marginTop: 8 }}
            >

              {loading ? (
                <span className="spinner" />
              ) : null}

              {loading
                ? "Signing in..."
                : "🏥 Sign in as Hospital"}

            </button>

            <div className="divider">
              not a hospital?
            </div>

            <button
              className="btn btn-ghost"
              style={{ width: "100%" }}
              onClick={() => navigate("/")}
            >
              ← Back to user login
            </button>

          </div>

        </div>

      </div>

    </div>

  );

}