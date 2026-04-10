import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import EmergencyRequest from "./pages/EmergencyRequest";
import DriverDashboard from "./pages/DriverDashboard";
import DriverLogin from "./pages/DriverLogin";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/emergency" element={<EmergencyRequest />} />

        <Route path="/driver" element={<DriverDashboard />} />

        <Route path="/driver-login" element={<DriverLogin />} />
        
      </Routes>

    </BrowserRouter>

  );

}

export default App;