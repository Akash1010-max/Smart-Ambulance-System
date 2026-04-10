import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import API from "../services/api";

export default function EmergencyRequest() {

  const [userLocation, setUserLocation] = useState(null);
  const [ambulanceLocation, setAmbulanceLocation] = useState(null);

  const ambulanceId = 1; // change if needed

  // ============================
  // Get User GPS
  // ============================
  const getLocation = () => {

    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition((pos) => {

      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      setUserLocation([lat, lon]);

    });

  };

  // ============================
  // Request Ambulance
  // ============================
  const requestAmbulance = async () => {

    if (!userLocation) {
      alert("Get GPS location first");
      return;
    }

    try {

      const lat = userLocation[0];
      const lon = userLocation[1];

      await API.post(`/api/emergency/create?lat=${lat}&lon=${lon}`);

      alert("Ambulance requested 🚑");

    } catch (err) {

      console.error(err);
      alert("Request failed");

    }

  };

  // ============================
  // Fetch Ambulance Location
  // ============================
  const fetchAmbulanceLocation = async () => {

    try {

      const res = await API.get(`/api/ambulance/${ambulanceId}`);

      const lat = res.data.latitude;
      const lon = res.data.longitude;

      if (lat && lon) {
        setAmbulanceLocation([lat, lon]);
      }

    } catch (err) {

      console.log("Ambulance location fetch failed");

    }

  };

  // ============================
  // Live Tracking (3 sec)
  // ============================
  useEffect(() => {

    const interval = setInterval(() => {

      fetchAmbulanceLocation();

    }, 3000);

    return () => clearInterval(interval);

  }, []);

  return (

    <div style={{ padding: "20px" }}>

      <h1>Emergency Ambulance Request</h1>

      <button
        onClick={getLocation}
        style={{
          padding: "10px",
          marginBottom: "10px"
        }}
      >
        Get My GPS Location
      </button>

      {userLocation && (

        <MapContainer
          center={userLocation}
          zoom={13}
          style={{ height: "400px", width: "100%" }}
        >

          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* User Marker */}
          <Marker position={userLocation}>
            <Popup>You are here</Popup>
          </Marker>

          {/* Ambulance Marker */}
          {ambulanceLocation && (

            <Marker
              position={ambulanceLocation}
              icon={
                new L.Icon({
                  iconUrl:
                    "https://cdn-icons-png.flaticon.com/512/2967/2967350.png",
                  iconSize: [40, 40]
                })
              }
            >
              <Popup>🚑 Ambulance</Popup>
            </Marker>

          )}

        </MapContainer>

      )}

      <br />

      <button
        onClick={requestAmbulance}
        style={{
          padding: "10px",
          marginTop: "10px"
        }}
      >
        Request Ambulance
      </button>

    </div>

  );

}