import { useEffect, useState } from "react";
import API from "../services/api";

export default function DriverDashboard() {

  const [requests, setRequests] = useState([]);

  const ambulanceId = 1;

  // =============================
  // Load Active Emergencies
  // =============================
  const fetchEmergencies = async () => {

    try {

      const res = await API.get("/api/emergency/active");

      setRequests(res.data);

    } catch (err) {

      console.error("Error loading emergencies:", err);

      alert("Failed to load emergencies");

    }

  };

  // Load when page opens
  useEffect(() => {

    fetchEmergencies();

  }, []);

  // Auto refresh every 5 sec
  useEffect(() => {

    const interval = setInterval(() => {

      fetchEmergencies();

    }, 5000);

    return () => clearInterval(interval);

  }, []);

  // =============================
  // Send Ambulance GPS
  // =============================
  const sendLocation = () => {

    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(async (pos) => {

      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      try {

        await API.put(
          `/api/ambulance/location/${ambulanceId}?lat=${lat}&lon=${lon}`
        );

      } catch (err) {

        console.log("Location update failed");

      }

    });

  };

  // Send location every 3 sec
  useEffect(() => {

    const interval = setInterval(() => {

      sendLocation();

    }, 3000);

    return () => clearInterval(interval);

  }, []);

  // =============================
  // Accept Emergency
  // =============================
  const acceptEmergency = async (id) => {

    try {

      await API.put(`/api/emergency/assign/${id}/${ambulanceId}`);

      alert("Emergency Accepted 🚑");

      fetchEmergencies();

    } catch (err) {

      console.error(err);

      alert("Accept failed");

    }

  };

  // =============================
  // Pickup Patient
  // =============================
  const pickupPatient = async (id) => {

    try {

      await API.put(`/api/emergency/${id}/pickup`);

      alert("Patient Picked Up");

      fetchEmergencies();

    } catch (err) {

      console.error(err);

      alert("Pickup failed");

    }

  };

  // =============================
  // Drop Patient
  // =============================
  const dropPatient = async (id) => {

    try {

      await API.put(`/api/emergency/${id}/drop`);

      alert("Patient dropped at hospital");

      fetchEmergencies();

    } catch (err) {

      console.error(err);

      alert("Drop failed");

    }

  };

  // =============================
  // Complete Emergency
  // =============================
  const completeEmergency = async (id) => {

    try {

      await API.put(`/api/emergency/${id}/complete`);

      alert("Emergency Completed");

      fetchEmergencies();

    } catch (err) {

      console.error(err);

      alert("Complete failed");

    }

  };

  return (

    <div style={{ padding: "30px" }}>

      <h1>🚑 Ambulance Driver Dashboard</h1>

      {requests.length === 0 && (

        <p>No active emergencies</p>

      )}

      {requests.map((req) => (

        <div
          key={req.id}
          style={{
            border: "1px solid white",
            padding: "20px",
            marginTop: "20px"
          }}
        >

          <h3>Emergency ID: {req.id}</h3>

          <p>
            Location: {req.latitude} , {req.longitude}
          </p>

          <p>Status: {req.status}</p>

          <div style={{ marginTop: "10px" }}>

            {req.status === "PENDING" && (

              <button
                onClick={() => acceptEmergency(req.id)}
                style={{
                  padding: "10px",
                  marginRight: "10px",
                  background: "green",
                  color: "white",
                  border: "none"
                }}
              >
                Accept
              </button>

            )}

            {req.status === "ACCEPTED" && (

              <button
                onClick={() => pickupPatient(req.id)}
                style={{
                  padding: "10px",
                  marginRight: "10px",
                  background: "orange",
                  color: "white",
                  border: "none"
                }}
              >
                Pickup
              </button>

            )}

            {req.status === "PICKED_UP" && (

              <button
                onClick={() => dropPatient(req.id)}
                style={{
                  padding: "10px",
                  marginRight: "10px",
                  background: "blue",
                  color: "white",
                  border: "none"
                }}
              >
                Drop
              </button>

            )}

            {req.status === "DROPPED" && (

              <button
                onClick={() => completeEmergency(req.id)}
                style={{
                  padding: "10px",
                  background: "red",
                  color: "white",
                  border: "none"
                }}
              >
                Complete
              </button>

            )}

          </div>

        </div>

      ))}

    </div>

  );

}