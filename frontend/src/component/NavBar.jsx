import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import * as FaIcons from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

function NavBar() {
  // Etat du sidebar : fermé par défaut
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const closeSidebar = () => setIsOpen(false);

  const handleLogout = async () => {
    sessionStorage.clear();
    closeSidebar();
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <div className="navBar">
        <button
          type="button"
          className="menu-bars"
          onClick={() => setIsOpen(true)}
          aria-label="Ouvrir le menu"
          aria-expanded={isOpen}
        >
          <FaIcons.FaBars />
        </button>
        <span className="navBar-title">Menu Demarrage</span>
      </div>

      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        className={`sidebar ${isOpen ? "sidebar-open" : ""}`}
        role="navigation"
        aria-label="Menu principal"
        aria-hidden={!isOpen}
      >
        <div className="sidebar-header">
          <span className="sidebar-title">Menu</span>
          <button
            type="button"
            className="sidebar-close"
            onClick={closeSidebar}
            aria-label="Fermer le menu"
          >
            <FaIcons.FaTimes />
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/scrape" className="sidebar-link" onClick={closeSidebar}>
            <FaIcons.FaSearch />
            <span>Recherche</span>
          </NavLink>

          <NavLink
            to="/profile"
            className="sidebar-link"
            onClick={closeSidebar}
          >
            <FaIcons.FaUserCircle />
            <span>Profil</span>
          </NavLink>
        </nav>

        <div className="sidebar-profile">
          <div className="profile-info">
            <FaIcons.FaUserCircle className="profile-avatar" />
            <div>
              <p className="profile-name">Utilisateur</p>
              <p className="profile-role">Session active</p>
            </div>
          </div>

          <button type="button" className="logout-btn" onClick={handleLogout}>
            <FaIcons.FaSignOutAlt />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default NavBar;
