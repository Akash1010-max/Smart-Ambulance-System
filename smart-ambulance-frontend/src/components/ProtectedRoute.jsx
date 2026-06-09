import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, redirectTo = "/" }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to={redirectTo} replace />;
  return children;
}
