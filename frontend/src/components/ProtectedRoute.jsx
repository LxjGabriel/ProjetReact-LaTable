import { Navigate } from "react-router-dom";
import { AuthService } from "../services/AuthService";

export default function ProtectedRoute({ children, requiredRole = 0 }) {
  if (!AuthService.IsConnected()) {
    return <Navigate to="/login" replace />;
  }
  const user = AuthService.GetUser();
  if (!user || typeof user.role === "undefined" || user.role != requiredRole) {
    // Redirige vers l'accueil ou une page "forbidden"
    return <Navigate to="/" replace />;
  }
  return children;
}