import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function DriverLogin() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
  try {
    const res = await fetch("http://localhost:8080/api/ambulance/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    if (!res.ok) {
      throw new Error("Login failed");
    }

    const data = await res.json();

    // save token
    localStorage.setItem("token", data.token);
    localStorage.setItem("ambulanceId", data.id);
    alert("Login Success ✅");

    window.location.href = "/driver";

  } catch (err) {
    console.error(err);
    alert("Login Failed");
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