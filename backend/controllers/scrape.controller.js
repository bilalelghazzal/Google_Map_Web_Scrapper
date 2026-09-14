const axios = require("axios");
const N8N_WEBHOOK_URL = require("../config/env");

exports.scrapeData = async (req, res) => {
  const { searchQuery, location } = req.body;

  if (!searchQuery || !location) {
    return res
      .status(400)
      .json({ error: "searchQuery et location sont requis" });
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
        .json({ error: "Aucune donné recus du weebhook n8n" });
    }
    res.status(200).json({ data: response.data });
  } catch (error) {
    console.error("Error lor de lappel au webhook n8n", error.message);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

/*This controller sends the search request to the n8n webhook,
 waits for the scraped data, and returns it to the client.*/
