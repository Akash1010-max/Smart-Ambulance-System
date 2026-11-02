import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import ToastProvider from "./components/Toast";

// Pages
import Login            from "./pages/Login";
import Register         from "./pages/Register";
import Dashboard        from "./pages/Dashboard";
import EmergencyRequest from "./pages/EmergencyRequest";
import DriverLogin      from "./pages/DriverLogin";
import DriverDashboard  from "./pages/DriverDashboard";
import HospitalLogin    from "./pages/HospitalLogin";
import HospitalDashboard from "./pages/HospitalDashboard";
import AmbulanceRegister from "./pages/AmbulanceRegister";
import AdminLogin       from "./pages/AdminLogin";
import AdminDashboard   from "./pages/AdminDashboard";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastProvider />
        <Routes>
          {/* Public / Unauthenticated-only routes */}
          <Route
            path="/"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <Register />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/driver-login"
            element={
              <PublicOnlyRoute>
                <DriverLogin />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/driver-register"
            element={<AmbulanceRegister />}
          />
          <Route
            path="/hospital-login"
            element={
              <PublicOnlyRoute>
                <HospitalLogin />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/admin-login"
            element={
              <PublicOnlyRoute>
                <AdminLogin />
              </PublicOnlyRoute>
            }
          />

          {/* Protected — Patient / Regular User */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["USER"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/emergency"
            element={
              <ProtectedRoute allowedRoles={["USER"]}>
                <EmergencyRequest />
              </ProtectedRoute>
            }
          />

          {/* Protected — Ambulance Driver */}
          <Route
            path="/driver"
            element={
              <ProtectedRoute allowedRoles={["AMBULANCE"]}>
                <DriverDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected — Hospital */}
          <Route
            path="/hospital"
            element={
              <ProtectedRoute allowedRoles={["HOSPITAL"]}>
                <HospitalDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected — System Administrator */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
