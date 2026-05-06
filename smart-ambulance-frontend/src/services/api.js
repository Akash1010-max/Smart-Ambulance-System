import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080"
});

API.interceptors.request.use((req) => {

  const token = localStorage.getItem("token");

  // ❗ DON'T attach token for login/register
  if (
    token &&
    !req.url.includes("/login") &&
    !req.url.includes("/register")
  ) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;