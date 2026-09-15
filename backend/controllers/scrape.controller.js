const axios = require("axios");
const { N8N_WEBHOOK_URL } = require("../config/env");

exports.scrapeData = async (req, res) => {
  const { searchQuery, location } = req.body;

  if (!searchQuery || !location) {
    return res
      .status(400)
      .json({ error: "searchQuery et location sont requis" });
  }

  if (!N8N_WEBHOOK_URL) {
    console.error("N8N_WEBHOOK_URL est manquant dans le fichier .env");
    return res
      .status(500)
      .json({ error: "Configuration du webhook n8n manquante" });
  }

  try {
    const response = await axios.post(
      N8N_WEBHOOK_URL,
      { searchQuery, location },
      {
        timeout: 120000, // 2 min, le scraping peut prendre du temps
      },
    );

    if (!response.data || response.data.length === 0) {
      return res
        .status(200)
        .json({ error: "Aucune donnée reçue du webhook n8n" });
    }

    return res.status(200).json({ data: response.data });
  } catch (error) {
    console.error("Erreur lors de l'appel au webhook n8n :", error.message);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

/*This controller sends the search request to the n8n webhook,
 waits for the scraped data, and returns it to the client.*/
