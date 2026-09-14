const express = require("express");
const cors = require("cors");
const scrapeRoute = require("./routes/scrape.route");

const app = express();

app.use(cors()); // à restreindre plus tard à l'origine de ton frontend React
app.use(express.json());

app.use("/api", scrapeRoute);

app.get("/", (req, res) => res.send("API Scraper en ligne"));

module.exports = app;
