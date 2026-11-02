import { useNavigate, useLocation } from "react-router-dom";
import { useAuth, normalizeRole, getDashboardPath } from "../auth/AuthContext";
import "./Navbar.css";

export default function Navbar({ role: propRole = null, activeTab = null, onTabChange = null }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { role: contextRole, logout } = useAuth();

  const currentRole = normalizeRole(propRole || contextRole || "USER");

  const handleLogout = () => {
    logout();
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

  const adminLinks = [
    { label: "Overview", tab: "stats", path: "/admin" },
    { label: "Hospitals", tab: "hospitals", path: "/admin" },
    { label: "Ambulances", tab: "ambulances", path: "/admin" },
    { label: "Emergencies", tab: "emergencies", path: "/admin" },
  ];

  let links = userLinks;
  if (currentRole === "ADMIN") links = adminLinks;
  else if (currentRole === "AMBULANCE") links = driverLinks;
  else if (currentRole === "HOSPITAL") links = hospitalLinks;

  const roleLabels = {
    ADMIN: "👑 Admin",
    AMBULANCE: "🚑 Driver",
    HOSPITAL: "🏥 Hospital",
    USER: "👤 Patient",
  };

  const handleLinkClick = (link) => {
    if (currentRole === "ADMIN" && link.tab && onTabChange) {
      onTabChange(link.tab);
    } else {
      navigate(link.path);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div
          className="navbar-brand"
          onClick={() => navigate(getDashboardPath(currentRole))}
        >
          <div className="navbar-logo-icon">🚑</div>
          <span className="navbar-logo-text">Smart Ambulance System</span>
        </div>

        <div className="navbar-links">
          {links.map((l) => {
            const isActive =
              currentRole === "ADMIN" && l.tab && activeTab
                ? activeTab === l.tab
                : location.pathname === l.path;

            return (
              <button
                key={l.label}
                className={`navbar-link ${isActive ? "active" : ""}`}
                onClick={() => handleLinkClick(l)}
              >
                {l.label}
              </button>
            );
          })}
        </div>

        <div className="navbar-right">
          <div className="navbar-role-badge">
            {roleLabels[currentRole] || "👤 User"}
          </div>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
