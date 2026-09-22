const express = require("express");
const cors = require("cors");
const scrapeRoute = require("./routes/scrape.route");
const authRoute = require("./routes/auth.route");
const { notFound, errorHandler } = require("./middleware/error.middleware");
const { FRONTEND_URL } = require("./config/env");

const app = express();

// CORS restreint à l'origine du frontend React
app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

app.use("/api/auth", authRoute); // routes publiques : register, login
app.use("/api", scrapeRoute); // /api/scrape, protégée par le middleware protect

app.get("/", (req, res) => res.send("API Scraper en ligne"));

// 404 JSON + gestion centralisée des erreurs (toujours en dernier)
app.use(notFound);
app.use(errorHandler);

module.exports = app;
