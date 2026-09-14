const express = require("express");
const router = express.Router();
const { scrapeData } = require("../controllers/scrape.controller");

router.post("/scrape", scrapeData);

module.exports = router;

// define the route .../port/api/scrape
