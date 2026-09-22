import { useNavigate } from "react-router";
import * as FaIcons from "react-icons/fa";

// Lecture sécurisée de l'utilisateur stocké (le login n'existe pas encore)
function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

function ProfilePage() {
  const navigate = useNavigate();
  const user = getStoredUser();

  // Pas encore de vraie authentification : on nettoie la session locale
  // (à remplacer par l'appel au backend quand le login sera prêt)
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="page">
      <h1>Profil</h1>

      <div className="profile-card">
        <FaIcons.FaUserCircle className="profile-avatar-lg" />
        <p className="profile-name">{user?.name ?? user?.email ?? "Utilisateur"}</p>
        <p className="profile-role">
          {user ? "Session active" : "Aucune session active"}
        </p>

        <button type="button" className="logout-btn" onClick={handleLogout}>
          <FaIcons.FaSignOutAlt />
          <span>Se déconnecter</span>
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;