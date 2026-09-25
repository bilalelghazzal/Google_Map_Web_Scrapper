import { Navigate, Route, Routes } from "react-router";
import AppLayout from "./component/AppLayout";
import ProtectedRoute from "./component/ProtectedRoute";
import SearchPage from "./pages/SearchPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/loginpage";
import "./App.css";

/*
  Deux espaces TOTALEMENT séparés :

  1. PUBLIC : /login — page seule. AppLayout (donc le menu) n'est jamais monté.
  2. PRIVE  : ProtectedRoute (garde) -> AppLayout (menu) -> pages

  Le menu n'existe que dans la branche privée : il est structurellement
  impossible de l'afficher sans session.
*/
function App() {
  return (
    <div className="App">
      <Routes>
        {/* ---------- ESPACE PUBLIC ---------- */}
        <Route path="/login" element={<LoginPage />} />

        {/* ---------- ESPACE PRIVE ---------- */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/scrape" element={<SearchPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* "/" -> /scrape : c'est ProtectedRoute qui décide ensuite.
            Connecté     => on entre dans l'application
            Non connecté => redirection automatique vers /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;