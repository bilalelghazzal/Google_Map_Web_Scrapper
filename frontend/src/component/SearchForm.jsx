export default function SearchForm({
  searchQuery,
  setSearchQuery,
  location,
  setLocation,
  onScrape,
  loading,
}) {
  // Permet de lancer le scraping avec la touche Entrée (soumission du formulaire)
  const handleSubmit = (event) => {
    event.preventDefault();
    if (loading) return;
    onScrape();
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="search-form__field">
        <label htmlFor="search-query">Sujet de recherche</label>
        <input
          id="search-query"
          type="text"
          placeholder="(ex: Ecole privée ,Ain Chock)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="search-form__field">
        <label htmlFor="location">Localisation</label>
        <input
          id="location"
          type="text"
          placeholder="Localisation (ex: Casablanca, Morocco)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Scraping en cours..." : "Scraper"}
      </button>
    </form>
  );
}
