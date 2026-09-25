import { useNavigate } from "react-router";
import * as FaIcons from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

// Lecture sécurisée de l'utilisateur stocké
function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

function ProfilePage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const user = getStoredUser();

  const handleLogout = async () => {
    sessionStorage.clear();
    await logout();
    navigate("/login", { replace: true });
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