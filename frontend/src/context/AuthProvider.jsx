import { useState } from "react";
import api from "../api/axios";
import { AuthContext } from "./AuthContext";

// Vérifie LOCALEMENT qu'un token est exploitable : bon format JWT et non expiré.
// ATTENTION : ce n'est PAS une vérification de signature. Le seul vrai contrôle
// est côté serveur, sur chaque appel /api (401 si le token est invalide).
function isTokenUsable(token) {
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  try {
    // base64url -> base64 -> JSON
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const payload = JSON.parse(atob(padded));

    // pas de "exp" => token sans expiration, on l'accepte
    if (!payload.exp) return true;

    return payload.exp * 1000 > Date.now();
  } catch {
    // token malformé ou illisible
    return false;
  }
}

// Lecture sécurisée de l'utilisateur stocké (JSON corrompu => null)
function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

// Lit la session stockée. Si le token est inutilisable, on nettoie tout :
// c'est ce qui empêche un token expiré ou bricolé d'ouvrir l'espace privé.
function readStoredSession() {
  const token = localStorage.getItem("token");

  if (!isTokenUsable(token)) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return { token: null, user: null };
  }

  return { token, user: readStoredUser() };
}

export function AuthProvider({ children }) {
  // Session restaurée depuis localStorage au démarrage.
  // Pas d'appel réseau : la route /api/auth/me n'existe pas.
  const [session, setSession] = useState(readStoredSession);

  const isAuthenticated = Boolean(session.token);

  // POST /api/auth/login -> stocke le token + l'utilisateur
  const login = async (username, password) => {
    const response = await api.post("/auth/login", { username, password });
    const { token, user } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setSession({ token, user });

    return user;
  };

  // POST /api/auth/logout -> le JWT étant stateless, on jette surtout le token côté client
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      // Même si le serveur ne répond pas, on déconnecte localement
      console.log("Déconnexion côté serveur impossible :", error.message);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setSession({ token: null, user: null });
    }
  };

  const value = {
    user: session.user,
    token: session.token,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}