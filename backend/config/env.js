require("dotenv").config();
module.exports = {
  PORT: process.env.PORT || 3000,
  N8N_WEBHOOK_URL: process.env.N8N_WEBHOOK_URL,
  MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/google_map_scraper",
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
};
// configure the project //
