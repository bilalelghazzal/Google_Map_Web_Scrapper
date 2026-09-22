const express = require("express");
const router = express.Router();
const { scrapeData } = require("../controllers/scrape.controller");
const { protect } = require("../middleware/auth.middleware");

// Route protégée : un token JWT valide est obligatoire
router.post("/scrape", protect, scrapeData);

module.exports = router;

// define the route .../port/api/scrape