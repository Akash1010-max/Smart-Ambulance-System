import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { useToast } from "../components/Toast";
import "../components/shared.css";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("stats");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [ambulances, setAmbulances] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [search, setSearch] = useState("");

  // Modals state
  const [hospitalModalOpen, setHospitalModalOpen] = useState(false);
  const [editingHospital, setEditingHospital] = useState(null);
  const [hospitalForm, setHospitalForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    latitude: 12.9716,
    longitude: 77.5946,
  });

  const [ambulanceModalOpen, setAmbulanceModalOpen] = useState(false);
  const [editingAmbulance, setEditingAmbulance] = useState(null);
  const [ambulanceForm, setAmbulanceForm] = useState({
    driverName: "",
    email: "",
    password: "",
    latitude: 12.9716,
    longitude: 77.5946,
  });

  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchStats = useCallback(async () => {
    try {
      const res = await API.get("/api/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load stats", err);
    }
  }, []);

  const fetchHospitals = useCallback(async () => {
    try {
      const res = await API.get("/api/admin/hospitals");
      setHospitals(res.data);
    } catch (err) {
      console.error("Failed to load hospitals", err);
    }
  }, []);

  const fetchAmbulances = useCallback(async () => {
    try {
      const res = await API.get("/api/admin/ambulances");
      setAmbulances(res.data);
    } catch (err) {
      console.error("Failed to load ambulances", err);
    }
  }, []);

  const fetchEmergencies = useCallback(async () => {
    try {
      const res = await API.get("/api/admin/emergencies");
      setEmergencies(res.data);
    } catch (err) {
      console.error("Failed to load emergencies", err);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    await Promise.allSettled([
      fetchStats(),
      fetchHospitals(),
      fetchAmbulances(),
      fetchEmergencies(),
    ]);
    setLoading(false);
  }, [fetchStats, fetchHospitals, fetchAmbulances, fetchEmergencies]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // ==========================================
  // Hospital Handlers
  // ==========================================
  const openCreateHospital = () => {
    setEditingHospital(null);
    setHospitalForm({
      name: "",
      email: "",
      password: "",
      address: "",
      latitude: 12.9716,
      longitude: 77.5946,
    });
    setHospitalModalOpen(true);
  };

  const openEditHospital = (h) => {
    setEditingHospital(h);
    setHospitalForm({
      name: h.name,
      email: h.email,
      password: "", // Leave blank to keep existing
      address: h.address,
      latitude: h.latitude ?? 12.9716,
      longitude: h.longitude ?? 77.5946,
    });
    setHospitalModalOpen(true);
  };

  const handleSaveHospital = async (e) => {
    e.preventDefault();
    if (!hospitalForm.name || !hospitalForm.email || !hospitalForm.address) {
      toast("Please fill in all required fields", "error");
      return;
    }

    if (!editingHospital && !hospitalForm.password) {
      toast("Password is required when creating a new hospital login", "error");
      return;
    }

    setSubmitting(true);
    try {
      if (editingHospital) {
        await API.put(`/api/admin/hospitals/${editingHospital.id}`, hospitalForm);
        toast("Hospital updated successfully!", "success");
      } else {
        await API.post("/api/admin/hospitals", hospitalForm);
        toast("Hospital login created successfully!", "success");
      }
      setHospitalModalOpen(false);
      fetchHospitals();
      fetchStats();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to save hospital";
      toast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteHospital = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await API.delete(`/api/admin/hospitals/${id}`);
      toast("Hospital deleted successfully", "success");
      fetchHospitals();
      fetchStats();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete hospital";
      toast(msg, "error");
    }
  };

  // ==========================================
  // Ambulance Handlers
  // ==========================================
  const openCreateAmbulance = () => {
    setEditingAmbulance(null);
    setAmbulanceForm({
      driverName: "",
      email: "",
      password: "",
      latitude: 12.9716,
      longitude: 77.5946,
    });
    setAmbulanceModalOpen(true);
  };

  const openEditAmbulance = (amb) => {
    setEditingAmbulance(amb);
    setAmbulanceForm({
      driverName: amb.driverName,
      email: amb.email,
      password: "",
      latitude: amb.latitude || 12.9716,
      longitude: amb.longitude || 77.5946,
    });
    setAmbulanceModalOpen(true);
  };

  const handleSaveAmbulance = async (e) => {
    e.preventDefault();
    if (!ambulanceForm.driverName || !ambulanceForm.email) {
      toast("Please fill in driver name and email", "error");
      return;
    }

    if (!editingAmbulance && !ambulanceForm.password) {
      toast("Password is required when creating a new ambulance driver login", "error");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        driverName: ambulanceForm.driverName,
        email: ambulanceForm.email,
        latitude: parseFloat(ambulanceForm.latitude) || 0.0,
        longitude: parseFloat(ambulanceForm.longitude) || 0.0,
        password: ambulanceForm.password,
      };

      if (editingAmbulance) {
        await API.put(`/api/admin/ambulances/${editingAmbulance.id}`, payload);
        toast("Ambulance driver updated successfully!", "success");
      } else {
        await API.post("/api/admin/ambulances", payload);
        toast("Ambulance driver login created successfully!", "success");
      }
      setAmbulanceModalOpen(false);
      fetchAmbulances();
      fetchStats();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to save ambulance";
      toast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAmbulance = async (id, driverName) => {
    if (!window.confirm(`Are you sure you want to delete ambulance driver "${driverName}"?`)) return;
    try {
      await API.delete(`/api/admin/ambulances/${id}`);
      toast("Ambulance deleted successfully", "success");
      fetchAmbulances();
      fetchStats();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete ambulance";
      toast(msg, "error");
    }
  };

  // Filtered lists
  const filteredHospitals = hospitals.filter(
    (h) =>
      h.name?.toLowerCase().includes(search.toLowerCase()) ||
      h.email?.toLowerCase().includes(search.toLowerCase()) ||
      h.address?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredAmbulances = ambulances.filter(
    (a) =>
      a.driverName?.toLowerCase().includes(search.toLowerCase()) ||
      a.email?.toLowerCase().includes(search.toLowerCase()) ||
      a.status?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredEmergencies = emergencies.filter(
    (e) =>
      String(e.id).includes(search) ||
      e.status?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">
      <Navbar role="admin" activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="admin-content page-enter">
        {/* Top Header */}
        <div className="admin-header">
          <div>
            <h1 className="admin-header-title">
              👑 System Administration
            </h1>
            <p className="admin-header-sub">
              Manage hospital logins, ambulance driver credentials, and monitor live emergency workflows
            </p>
          </div>

          <div className="admin-header-actions">
            <button className="btn btn-ghost btn-sm" onClick={refreshAll}>
              🔄 Refresh
            </button>
            <button className="btn btn-primary btn-sm" onClick={openCreateHospital}>
              🏥 + Add Hospital
            </button>
            <button
              className="btn btn-primary btn-sm"
              style={{ background: "var(--cyan)", color: "#0c1018" }}
              onClick={openCreateAmbulance}
            >
              🚑 + Add Ambulance
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="admin-tabs">
          <button
            className={`admin-tab-btn ${activeTab === "stats" ? "active" : ""}`}
            onClick={() => setActiveTab("stats")}
          >
            📊 System Overview
          </button>
          <button
            className={`admin-tab-btn ${activeTab === "hospitals" ? "active" : ""}`}
            onClick={() => setActiveTab("hospitals")}
          >
            🏥 Hospitals <span className="admin-tab-pill">{hospitals.length}</span>
          </button>
          <button
            className={`admin-tab-btn ${activeTab === "ambulances" ? "active" : ""}`}
            onClick={() => setActiveTab("ambulances")}
          >
            🚑 Ambulances <span className="admin-tab-pill">{ambulances.length}</span>
          </button>
          <button
            className={`admin-tab-btn ${activeTab === "emergencies" ? "active" : ""}`}
            onClick={() => setActiveTab("emergencies")}
          >
            🚨 Emergency Dispatch <span className="admin-tab-pill">{emergencies.length}</span>
          </button>
        </div>

        {/* ── TAB 1: OVERVIEW & STATS ── */}
        {activeTab === "stats" && (
          <div>
            <div className="admin-kpis stagger">
              <div className="admin-kpi-card">
                <div className="admin-kpi-icon" style={{ background: "rgba(72,202,228,0.12)", color: "var(--cyan)" }}>
                  🏥
                </div>
                <div>
                  <div className="admin-kpi-num">{stats?.totalHospitals ?? hospitals.length}</div>
                  <div className="admin-kpi-label">Registered Hospitals</div>
                </div>
              </div>

              <div className="admin-kpi-card">
                <div className="admin-kpi-icon" style={{ background: "rgba(46,204,113,0.12)", color: "var(--green)" }}>
                  🚑
                </div>
                <div>
                  <div className="admin-kpi-num">{stats?.totalAmbulances ?? ambulances.length}</div>
                  <div className="admin-kpi-label">
                    Total Ambulances ({stats?.availableAmbulances ?? 0} available)
                  </div>
                </div>
              </div>

              <div className="admin-kpi-card">
                <div className="admin-kpi-icon" style={{ background: "rgba(244,162,97,0.12)", color: "var(--orange)" }}>
                  🚨
                </div>
                <div>
                  <div className="admin-kpi-num">{stats?.activeEmergencies ?? 0}</div>
                  <div className="admin-kpi-label">Active Emergencies</div>
                </div>
              </div>

              <div className="admin-kpi-card">
                <div className="admin-kpi-icon" style={{ background: "rgba(230,57,70,0.12)", color: "var(--red)" }}>
                  📋
                </div>
                <div>
                  <div className="admin-kpi-num">{stats?.totalEmergencies ?? emergencies.length}</div>
                  <div className="admin-kpi-label">Total Dispatch Requests</div>
                </div>
              </div>
            </div>

            {/* Quick Action Banner */}
            <div
              className="card"
              style={{
                padding: "28px",
                background: "linear-gradient(135deg, rgba(22, 28, 40, 0.9) 0%, rgba(12, 16, 24, 0.95) 100%)",
                border: "1px solid var(--border-mid)",
                marginBottom: 32,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
                <div>
                  <h3 style={{ fontFamily: "var(--font-head)", fontSize: 20, marginBottom: 6 }}>
                    Direct Role Management
                  </h3>
                  <p style={{ color: "var(--text-2)", fontSize: 14 }}>
                    Only Administrators can issue authorized credentials for hospitals and ambulance fleet operators.
                  </p>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <button className="btn btn-primary" onClick={openCreateHospital}>
                    Create Hospital Login
                  </button>
                  <button
                    className="btn btn-ghost"
                    style={{ borderColor: "var(--cyan)", color: "var(--cyan)" }}
                    onClick={openCreateAmbulance}
                  >
                    Create Ambulance Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: HOSPITALS MANAGEMENT ── */}
        {activeTab === "hospitals" && (
          <div>
            <div className="admin-toolbar">
              <div className="admin-search-wrap">
                <span className="s-icon">🔍</span>
                <input
                  type="text"
                  className="admin-search-input"
                  placeholder="Search hospitals by name, email, or address…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button className="btn btn-primary btn-sm" onClick={openCreateHospital}>
                🏥 + Create Hospital Login
              </button>
            </div>

            {filteredHospitals.length === 0 ? (
              <div className="card" style={{ padding: 48, textAlign: "center", color: "var(--text-3)" }}>
                {search ? "No hospitals matched your search." : "No hospitals registered yet. Click \"+ Create Hospital Login\" to add one."}
              </div>
            ) : (
              <div className="admin-grid stagger">
                {filteredHospitals.map((h) => (
                  <div key={h.id} className="admin-card">
                    <div>
                      <div className="admin-card-head">
                        <div>
                          <div className="admin-card-title">{h.name}</div>
                          <div className="admin-card-subtitle">✉ {h.email}</div>
                        </div>
                        <span className="badge badge-accepted">ID #{h.id}</span>
                      </div>
                      <div className="admin-card-body">
                        <div className="admin-card-row">
                          <span>📍</span>
                          <span>{h.address || "Address not specified"}</span>
                        </div>
                        <div className="admin-card-row">
                          <span>🌐</span>
                          <span>
                            GPS: {h.latitude != null ? Number(h.latitude).toFixed(4) : "—"},{" "}
                            {h.longitude != null ? Number(h.longitude).toFixed(4) : "—"}
                          </span>
                        </div>
                        <div className="admin-card-row" style={{ marginTop: 8, color: "var(--green)" }}>
                          <span>✔</span>
                          <span>Login Active (Role: HOSPITAL)</span>
                        </div>
                      </div>
                    </div>

                    <div className="admin-card-actions">
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ flex: 1 }}
                        onClick={() => openEditHospital(h)}
                      >
                        ✏ Edit
                      </button>
                      <button
                        className="btn btn-ghost-red btn-sm"
                        onClick={() => handleDeleteHospital(h.id, h.name)}
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: AMBULANCES MANAGEMENT ── */}
        {activeTab === "ambulances" && (
          <div>
            <div className="admin-toolbar">
              <div className="admin-search-wrap">
                <span className="s-icon">🔍</span>
                <input
                  type="text"
                  className="admin-search-input"
                  placeholder="Search ambulances by driver name, email, status…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button
                className="btn btn-primary btn-sm"
                style={{ background: "var(--cyan)", color: "#0c1018" }}
                onClick={openCreateAmbulance}
              >
                🚑 + Create Ambulance Login
              </button>
            </div>

            {filteredAmbulances.length === 0 ? (
              <div className="card" style={{ padding: 48, textAlign: "center", color: "var(--text-3)" }}>
                {search ? "No ambulances matched your search." : "No ambulances registered yet. Click \"+ Create Ambulance Login\" to onboard a driver."}
              </div>
            ) : (
              <div className="admin-grid stagger">
                {filteredAmbulances.map((amb) => (
                  <div key={amb.id} className="admin-card">
                    <div>
                      <div className="admin-card-head">
                        <div>
                          <div className="admin-card-title">🚑 {amb.driverName}</div>
                          <div className="admin-card-subtitle">✉ {amb.email}</div>
                        </div>
                        <span
                          className={`badge ${
                            amb.status === "AVAILABLE" ? "badge-available" : "badge-busy"
                          }`}
                        >
                          <span
                            className={`pulse-dot ${
                              amb.status === "AVAILABLE" ? "green" : "red"
                            }`}
                          />
                          {amb.status || "AVAILABLE"}
                        </span>
                      </div>
                      <div className="admin-card-body">
                        <div className="admin-card-row">
                          <span>🌐</span>
                          <span>
                            GPS: {amb.latitude?.toFixed(4) || "—"}, {amb.longitude?.toFixed(4) || "—"}
                          </span>
                        </div>
                        <div className="admin-card-row" style={{ marginTop: 8, color: "var(--cyan)" }}>
                          <span>✔</span>
                          <span>Login Active (Role: AMBULANCE)</span>
                        </div>
                      </div>
                    </div>

                    <div className="admin-card-actions">
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ flex: 1 }}
                        onClick={() => openEditAmbulance(amb)}
                      >
                        ✏ Edit
                      </button>
                      <button
                        className="btn btn-ghost-red btn-sm"
                        onClick={() => handleDeleteAmbulance(amb.id, amb.driverName)}
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 4: EMERGENCIES OVERSIGHT ── */}
        {activeTab === "emergencies" && (
          <div>
            <div className="admin-toolbar">
              <div className="admin-search-wrap">
                <span className="s-icon">🔍</span>
                <input
                  type="text"
                  className="admin-search-input"
                  placeholder="Filter emergencies by ID or status…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button className="btn btn-ghost btn-sm" onClick={fetchEmergencies}>
                🔄 Refresh Logs
              </button>
            </div>

            {filteredEmergencies.length === 0 ? (
              <div className="card" style={{ padding: 48, textAlign: "center", color: "var(--text-3)" }}>
                No emergency dispatch requests found.
              </div>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Dispatch ID</th>
                      <th>Patient User ID</th>
                      <th>Status</th>
                      <th>Assigned Ambulance</th>
                      <th>Assigned Hospital</th>
                      <th>Created Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmergencies.map((em) => (
                      <tr key={em.id}>
                        <td>
                          <strong>#{em.id}</strong>
                        </td>
                        <td>User #{em.userId}</td>
                        <td>
                          <span
                            className={`badge ${
                              em.status === "PENDING"
                                ? "badge-pending"
                                : em.status === "ACCEPTED"
                                ? "badge-accepted"
                                : em.status === "PICKED_UP"
                                ? "badge-picked"
                                : em.status === "DROPPED"
                                ? "badge-dropped"
                                : "badge-completed"
                            }`}
                          >
                            {em.status}
                          </span>
                        </td>
                        <td>
                          {em.ambulanceId ? (
                            <span>
                              🚑 Ambulance #{em.ambulanceId}
                              {ambulances.find((a) => a.id === em.ambulanceId)?.driverName
                                ? ` (${ambulances.find((a) => a.id === em.ambulanceId).driverName})`
                                : ""}
                            </span>
                          ) : (
                            "— None —"
                          )}
                        </td>
                        <td>
                          {em.hospitalId ? (
                            <span style={{ color: "var(--cyan)", fontWeight: 600 }}>
                              🏥 Hospital #{em.hospitalId}
                              {hospitals.find((h) => h.id === em.hospitalId)?.name
                                ? ` (${hospitals.find((h) => h.id === em.hospitalId).name})`
                                : ""}
                            </span>
                          ) : (
                            "— None —"
                          )}
                        </td>
                        <td>
                          {em.createdAt ? new Date(em.createdAt).toLocaleString() : "Just now"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── MODAL: CREATE / EDIT HOSPITAL ── */}
      {hospitalModalOpen && (
        <div className="modal-overlay" onClick={() => setHospitalModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingHospital ? "Edit Hospital Account" : "Create Hospital Login"}</h3>
              <button className="modal-close-btn" onClick={() => setHospitalModalOpen(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveHospital}>
              <div className="modal-body">
                <div className="field">
                  <label>Hospital Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. City General Hospital"
                    value={hospitalForm.name}
                    onChange={(e) => setHospitalForm({ ...hospitalForm, name: e.target.value })}
                  />
                </div>

                <div className="field">
                  <label>Official Email (Login Username) *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. admin@cityhospital.com"
                    value={hospitalForm.email}
                    onChange={(e) => setHospitalForm({ ...hospitalForm, email: e.target.value })}
                  />
                </div>

                <div className="field">
                  <label>
                    {editingHospital
                      ? "Password (leave blank to keep existing)"
                      : "Login Password *"}
                  </label>
                  <input
                    type="password"
                    required={!editingHospital}
                    placeholder="Set hospital login password"
                    value={hospitalForm.password}
                    onChange={(e) => setHospitalForm({ ...hospitalForm, password: e.target.value })}
                  />
                </div>

                <div className="field">
                  <label>Physical Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 102 Healthcare Blvd, Metro City"
                    value={hospitalForm.address}
                    onChange={(e) => setHospitalForm({ ...hospitalForm, address: e.target.value })}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div className="field">
                    <label>Hospital Latitude</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="12.9716"
                      value={hospitalForm.latitude}
                      onChange={(e) => setHospitalForm({ ...hospitalForm, latitude: e.target.value })}
                    />
                  </div>
                  <div className="field">
                    <label>Hospital Longitude</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="77.5946"
                      value={hospitalForm.longitude}
                      onChange={(e) => setHospitalForm({ ...hospitalForm, longitude: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setHospitalModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? "Saving…" : editingHospital ? "Save Changes" : "Create Hospital Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: CREATE / EDIT AMBULANCE ── */}
      {ambulanceModalOpen && (
        <div className="modal-overlay" onClick={() => setAmbulanceModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingAmbulance ? "Edit Ambulance Driver" : "Create Ambulance Driver Login"}</h3>
              <button className="modal-close-btn" onClick={() => setAmbulanceModalOpen(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveAmbulance}>
              <div className="modal-body">
                <div className="field">
                  <label>Driver Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={ambulanceForm.driverName}
                    onChange={(e) => setAmbulanceForm({ ...ambulanceForm, driverName: e.target.value })}
                  />
                </div>

                <div className="field">
                  <label>Driver Email (Login Username) *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. driver1@smartambulancesystem.com"
                    value={ambulanceForm.email}
                    onChange={(e) => setAmbulanceForm({ ...ambulanceForm, email: e.target.value })}
                  />
                </div>

                <div className="field">
                  <label>
                    {editingAmbulance
                      ? "Password (leave blank to keep existing)"
                      : "Driver Login Password *"}
                  </label>
                  <input
                    type="password"
                    required={!editingAmbulance}
                    placeholder="Set driver login password"
                    value={ambulanceForm.password}
                    onChange={(e) => setAmbulanceForm({ ...ambulanceForm, password: e.target.value })}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div className="field">
                    <label>Initial Latitude</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="12.9716"
                      value={ambulanceForm.latitude}
                      onChange={(e) => setAmbulanceForm({ ...ambulanceForm, latitude: e.target.value })}
                    />
                  </div>
                  <div className="field">
                    <label>Initial Longitude</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="77.5946"
                      value={ambulanceForm.longitude}
                      onChange={(e) => setAmbulanceForm({ ...ambulanceForm, longitude: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setAmbulanceModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ background: "var(--cyan)", color: "#0c1018" }}
                  disabled={submitting}
                >
                  {submitting ? "Saving…" : editingAmbulance ? "Save Changes" : "Create Ambulance Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
