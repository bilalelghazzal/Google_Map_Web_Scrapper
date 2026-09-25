import { createContext, useContext } from "react";

// react-refresh/only-export-components (voir AuthProvider.jsx).
export const AuthContext = createContext(null);

// Hook maison : évite d'importer useContext + AuthContext dans chaque fichier
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un <AuthProvider>");
  }

  return context;
}