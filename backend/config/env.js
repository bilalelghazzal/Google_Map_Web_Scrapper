require("dotenv").config();
module.exports = {
  PORT: process.env.PORT || 3000,
  N8N_WEBHOOK_URL: process.env.N8N_WEBHOOK_URL,
};
// configure the project //
