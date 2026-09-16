import { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import SearchForm from "./component/SearchForm";
import ResultsTable from "./component/ResultsTable";
import "./App.css";

function App() {
  const [searchQuery, setSearchQuery] = useState(""); // searc form
  const [location, setLocation] = useState(""); // search form
  const [results, setResults] = useState([]); // results table
  const [loading, setLoading] = useState(false); //search form
  const [error, setError] = useState("");

  // BackEnd URL :
  const BACKEND_URL = "http://localhost:3000/api/scrape";
  // BackEnd URL :

  const handleScrape = async () => {
    setError("");
    if (!location.trim() || !searchQuery.trim()) {
      setError("les deux champs sont obligatoires");
      return;
    }
    setLoading(true);
    setResults([]);

    try {
      const response = await axios.post(BACKEND_URL, { searchQuery, location });
      // Le backend renvoie { data: [...] } (results est gardé pour compatibilité)
      const payload = response.data?.results ?? response.data?.data ?? [];
      const data = Array.isArray(payload) ? payload : [];

      if (data.length === 0) {
        setError("aucun resultat trouvé");
      } else {
        setResults(data);
      }
    } catch (error) {
      setError("erreur lors du scraping");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle The download XLSx;

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(results);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Résultats");

    const date = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `resultats_scraping_${date}.xlsx`);
  };
  // returned values :
  return (
    <div className="App">
      <h1>Google Maps Scraper</h1>

      <SearchForm
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        location={location}
        setLocation={setLocation}
        onScrape={handleScrape}
        loading={loading}
      />

      {error && <p className="error">{error}</p>}

      <ResultsTable results={results} />

      {results.length > 0 && (
        <button className="download-btn" onClick={handleDownload}>
          Télécharger en Excel
        </button>
      )}
    </div>
  );
}

export default App;
