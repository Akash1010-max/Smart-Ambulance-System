import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ role = "user" }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("ambulanceId");
    localStorage.removeItem("hospitalId");
    localStorage.removeItem("role");
    navigate("/");
  };

  const userLinks = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Request Ambulance", path: "/emergency" },
  ];

  const driverLinks = [
    { label: "Active Emergencies", path: "/driver" },
  ];

  const hospitalLinks = [
    { label: "Hospital Dashboard", path: "/hospital" },
  ];

  const links = role === "driver" ? driverLinks : role === "hospital" ? hospitalLinks : userLinks;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand" onClick={() => navigate(role === "driver" ? "/driver" : role === "hospital" ? "/hospital" : "/dashboard")}>
          <div className="navbar-logo-icon">🚑</div>
          <span className="navbar-logo-text">SwiftAid</span>
        </div>

        <div className="navbar-links">
          {links.map(l => (
            <button
              key={l.path}
              className={`navbar-link ${location.pathname === l.path ? "active" : ""}`}
              onClick={() => navigate(l.path)}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="navbar-right">
          <div className="navbar-role-badge">
            {role === "driver" ? "🚑 Driver" : role === "hospital" ? "🏥 Hospital" : "👤 User"}
          </div>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
