import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function normalizeRole(role) {
  if (!role) return null;
  const upper = String(role).toUpperCase();
  if (upper === "DRIVER" || upper === "AMBULANCE") return "AMBULANCE";
  if (upper === "HOSPITAL") return "HOSPITAL";
  if (upper === "ADMIN") return "ADMIN";
  if (upper === "USER") return "USER";
  return upper;
}

export function getDashboardPath(role) {
  const norm = normalizeRole(role);
  switch (norm) {
    case "ADMIN":
      return "/admin";
    case "AMBULANCE":
      return "/driver";
    case "HOSPITAL":
      return "/hospital";
    case "USER":
      return "/dashboard";
    default:
      return "/";
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [role, setRole] = useState(() => {
    const stored = localStorage.getItem("role");
    if (stored) return normalizeRole(stored);
    const token = localStorage.getItem("token");
    const payload = parseJwt(token);
    return payload?.role ? normalizeRole(payload.role) : null;
  });
  const [email, setEmail] = useState(() => localStorage.getItem("email") || null);

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setRole(null);
    setEmail(null);
  };

  // Validate expiration and extract claims whenever token changes
  useEffect(() => {
    if (token) {
      const payload = parseJwt(token);
      if (payload) {
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          logout();
          return;
        }
        if (payload.role) {
          const norm = normalizeRole(payload.role);
          setRole(norm);
          localStorage.setItem("role", norm);
        }
        if (payload.sub && !email) {
          setEmail(payload.sub);
          localStorage.setItem("email", payload.sub);
        }
      }
    }
  }, [token]);

  const login = (newToken, explicitRole = null, userEmail = "", extraData = {}) => {
    let finalRole = explicitRole;
    const payload = parseJwt(newToken);
    if (payload?.role) {
      finalRole = payload.role;
    }
    const normalized = normalizeRole(finalRole);
    const finalEmail = userEmail || payload?.sub || "";

    localStorage.setItem("token", newToken);
    if (normalized) localStorage.setItem("role", normalized);
    if (finalEmail) localStorage.setItem("email", finalEmail);

    if (extraData.ambulanceId) localStorage.setItem("ambulanceId", extraData.ambulanceId);
    if (extraData.hospitalId) localStorage.setItem("hospitalId", extraData.hospitalId);
    if (extraData.userId) localStorage.setItem("userId", extraData.userId);

    setToken(newToken);
    setRole(normalized);
    setEmail(finalEmail);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        email,
        isAuthenticated,
        login,
        logout,
        getDashboardPath,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
