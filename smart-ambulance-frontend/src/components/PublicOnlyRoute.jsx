import { Navigate } from "react-router-dom";
import { useAuth, getDashboardPath } from "../auth/AuthContext";

export default function PublicOnlyRoute({ children }) {
  const { isAuthenticated, role } = useAuth();

  if (isAuthenticated && role) {
    return <Navigate to={getDashboardPath(role)} replace />;
  }

  return children;
}
