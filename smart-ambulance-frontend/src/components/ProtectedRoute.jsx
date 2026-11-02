import { Navigate } from "react-router-dom";
import { useAuth, normalizeRole, getDashboardPath } from "../auth/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { token, role, isAuthenticated } = useAuth();

  if (!isAuthenticated || !token) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const currentRole = normalizeRole(role);
    const isAllowed = allowedRoles.map(normalizeRole).includes(currentRole);

    if (!isAllowed) {
      // User is logged in, but their role is not authorized for this specific portal.
      // Redirect to their own dashboard.
      return <Navigate to={getDashboardPath(currentRole)} replace />;
    }
  }

  return children;
}
