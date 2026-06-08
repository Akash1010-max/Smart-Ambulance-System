import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import "../components/shared.css";
import "./HospitalDashboard.css";

export default function HospitalDashboard() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  const fetchCases = async () => {
    try {
      const res = await API.get("/api/hospital/completed");
      setCases(res.data);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCases(); }, []);
  useEffect(() => {
    const interval = setInterval(fetchCases, 10000);
    return () => clearInterval(interval);
  }, []);

  const filtered = filter === "ALL" ? cases : cases.filter(c => c.status === filter);

  const stats = {
    total:     cases.length,
    completed: cases.filter(c => c.status === "COMPLETED").length,
    today:     cases.filter(c => {
      if (!c.createdAt) return false;
      const d = new Date(c.createdAt);
      const now = new Date();
      return d.toDateString() === now.toDateString();
    }).length,
  };

  return (
    <div className="hosp-page">
      <Navbar role="hospital" />
      <div className="hosp-content page-enter">

        <div className="hosp-header">
          <div>
            <h1 className="hosp-title">Hospital Operations</h1>
            <p className="hosp-sub">Incoming patients and completed emergency cases</p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={fetchCases}>
            ↻ Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="hosp-stats stagger">
          <div className="hosp-stat">
            <div className="hosp-stat-num">{stats.total}</div>
            <div className="hosp-stat-label">Total cases</div>
          </div>
          <div className="hosp-stat">
            <div className="hosp-stat-num" style={{ color: "var(--green)" }}>{stats.completed}</div>
            <div className="hosp-stat-label">Completed</div>
          </div>
          <div className="hosp-stat">
            <div className="hosp-stat-num" style={{ color: "var(--cyan)" }}>{stats.today}</div>
            <div className="hosp-stat-label">Today</div>
          </div>
          <div className="hosp-stat">
            <div className="hosp-stat-num" style={{ color: "var(--orange)" }}>
              {cases.filter(c => c.status !== "COMPLETED").length}
            </div>
            <div className="hosp-stat-label">In progress</div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="hosp-filter-bar">
          {["ALL","COMPLETED","DROPPED","PICKED_UP"].map(f => (
            <button
              key={f}
              className={`hosp-filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "ALL" ? "All cases" : f.replace("_"," ")}
              <span className="hosp-filter-count">
                {f === "ALL" ? cases.length : cases.filter(c => c.status === f).length}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="hosp-loader">
            <div className="spinner" style={{ width: 32, height: 32 }} />
            <span>Loading cases…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="hosp-empty">
            <div className="hosp-empty-icon">🏥</div>
            <div className="hosp-empty-title">No cases found</div>
            <div className="hosp-empty-sub">Emergency cases will appear here once dispatched.</div>
          </div>
        ) : (
          <div className="hosp-table-wrap">
            <table className="hosp-table">
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="stagger">
                {filtered.map(c => (
                  <CaseRow key={c.id} c={c} />
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}

const badgeMap = {
  COMPLETED: "badge-completed",
  DROPPED:   "badge-dropped",
  PICKED_UP: "badge-picked",
  ACCEPTED:  "badge-accepted",
  PENDING:   "badge-pending",
};

function CaseRow({ c }) {
  const timeStr = c.createdAt
    ? new Date(c.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
    : "—";

  return (
    <tr className="hosp-row">
      <td>
        <span className="hosp-case-id">#{c.id}</span>
      </td>
      <td>
        <span className="hosp-coords">
          {Number(c.latitude).toFixed(5)}, {Number(c.longitude).toFixed(5)}
        </span>
      </td>
      <td>
        <span className={`badge ${badgeMap[c.status] || "badge-completed"}`}>
          {c.status?.replace("_"," ")}
        </span>
      </td>
      <td>
        <span className="hosp-time">{timeStr}</span>
      </td>
      <td>
        <a
          href={`https://maps.google.com/?q=${c.latitude},${c.longitude}`}
          target="_blank"
          rel="noreferrer"
          className="btn btn-ghost btn-sm"
        >
          🗺 View location
        </a>
      </td>
    </tr>
  );
}
