export default function SearchForm({
  searchQuery,
  setSearchQuery,
  location,
  setLocation,
  onScrape,
  loading,
}) {
  return (
    <div className="search-form">
      <label htmlFor="search-query">Sujet de recherche</label>
      <input
        id="search-query"
        type="text"
        placeholder="Ecole privée ,Ain Chock"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <label htmlFor="location">Localisation</label>
      <input
        id="location"
        type="text"
        placeholder="Casablanca, Morocco"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <button onClick={onScrape} disabled={loading}>
        {loading ? "Scraping en cours..." : "Scraper"}
      </button>
    </div>
  );
}
