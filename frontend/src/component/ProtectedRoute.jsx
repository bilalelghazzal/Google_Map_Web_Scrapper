import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

// Gardien de l'application connectée.
export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // replace : on remplace l'entrée dans l'historique, donc après connexion
    // le bouton "retour" ne ramène pas sur la page refusée.
    return <Navigate to="/login" replace />;
  }

  // Outlet = l'enfant déclaré dans les routes imbriquées (voir App.jsx)
  return <Outlet />;
}