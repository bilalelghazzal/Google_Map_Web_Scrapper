import { Navigate, Route, Routes } from "react-router";
import NavBar from "./component/NavBar";
import SearchPage from "./pages/SearchPage";
import ProfilePage from "./pages/ProfilePage";
import "./App.css";

function App() {
  return (
    <div className="App">
      <NavBar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/scrape" replace />} />
          <Route path="/scrape" element={<SearchPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/scrape" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;