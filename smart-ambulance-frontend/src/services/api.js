import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const API = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 (expired/invalid token) → redirect to login only on protected requests, NOT login/register attempts
API.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err.config?.url || "";
    const isAuthEndpoint = url.includes("/login") || url.includes("/register");

    if (err.response?.status === 401 && !isAuthEndpoint) {
      localStorage.clear();
      if (window.location.pathname !== "/" && !window.location.pathname.includes("login")) {
        window.location.href = "/";
      }
    }
    return Promise.reject(err);
  }
);

export default API;
