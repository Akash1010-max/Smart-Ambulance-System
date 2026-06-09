import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
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

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastProvider />
        <Routes>
          {/* Public routes */}
          <Route path="/"                   element={<Login />} />
          <Route path="/register"           element={<Register />} />
          <Route path="/driver-login"       element={<DriverLogin />} />
          <Route path="/driver-register"    element={<AmbulanceRegister />} />
          <Route path="/hospital-login"     element={<HospitalLogin />} />

          {/* Protected — User */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/emergency" element={
            <ProtectedRoute><EmergencyRequest /></ProtectedRoute>
          } />

          {/* Protected — Driver */}
          <Route path="/driver" element={
            <ProtectedRoute redirectTo="/driver-login"><DriverDashboard /></ProtectedRoute>
          } />

          {/* Protected — Hospital */}
          <Route path="/hospital" element={
            <ProtectedRoute redirectTo="/hospital-login"><HospitalDashboard /></ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
