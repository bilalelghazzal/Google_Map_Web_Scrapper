export default function SearchForm(
  searchQuery,
  setSearchQuery,
  location,
  setLocation,
  onScrape,
  loading,
) {
  <div className="search-form">
    <input
      type="text"
      placeholder="Search Query (ex: Ecole privée ,Ain Chock)"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
    <input
      type="text"
      placeholder="Localisation (ex: Casablanca, Morocco)"
      value={location}
      onChange={(e) => setLocation(e.target.value)}
    />
    <button onClick={onScrape} disabled={loading}>
      {loading ? "Scraping en cours..." : "Scraper"}
    </button>
  </div>;
}
