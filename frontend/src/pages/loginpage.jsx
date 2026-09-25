import { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import * as FaIcons from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  // prvent the defaults
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    //check the user infos :
    if (!username.trim() || !password) {
      setError("Le nom d'utilisateur et le mot de passe sont requis");
      return;
    }

    setLoading(true);
    

    try {
      // login() stocke le token + l'utilisateur ET met à jour le contexte.
      // Sans ça, ProtectedRoute ne verrait pas la connexion et nous
      // renverrait immédiatement sur /login.
      await login(username.trim(), password);

      // Redirection vers la page de scraping
      navigate("/scrape");
    } catch (err) {
      const serverMessage = err.response?.data?.error;
      setError(serverMessage || "Identifiants invalides ou erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  // Déjà connecté : inutile de remontrer le formulaire de connexion
  if (isAuthenticated) {
    return <Navigate to="/scrape" replace />;
  }

  return (
    <div className="page login-page">
      <h1>Connexion</h1>

      <div className="login-card">
        <FaIcons.FaUserCircle className="profile-avatar-lg" />

        <form onSubmit={handleSubmit} className="login-form">
          {error && <p className="error">{error}</p>}

          <div className="form-group">
            <label htmlFor="username">Nom d'utilisateur</label>
            <div className="input-icon-wrapper">
              <FaIcons.FaUser className="input-icon" />
              <input
                id="username"
                type="text"
                placeholder="Entrez votre nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <div className="input-icon-wrapper">
              <FaIcons.FaLock className="input-icon" />
              <input
                id="password"
                type="password"
                placeholder="Entrez votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={loading}
                required
              />
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            <FaIcons.FaSignInAlt />
            <span>{loading ? "Connexion en cours..." : "Se connecter"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;


