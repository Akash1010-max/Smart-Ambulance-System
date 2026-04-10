import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function DriverLogin() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {

    try {

      const res = await API.post("/api/ambulance/login", {
        email,
        password
      });

      localStorage.setItem("token", res.data.token);

      alert("Driver Login Successful 🚑");

      navigate("/driver");

    } catch (err) {

      console.error(err);
      alert("Driver Login Failed");

    }

  };

  return (
    <div>

      <h2>Driver Login</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleLogin}>
        Login as Driver
      </button>

    </div>
  );
}