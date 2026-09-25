import { Outlet } from "react-router";
import NavBar from "./NavBar";

// Coquille de l'application CONNECTEE : le menu + la zone de contenu.
// Ce composant n'est monté que dans la branche privée des routes (voir App.jsx),
// donc le menu est structurellement impossible à afficher sans session.
export default function AppLayout() {
  return (
    <>
      <NavBar />
      <main className="main-content">
        <Outlet />
      </main>
    </>
  );
}