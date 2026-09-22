const app = require("./app");
const connectDB = require("./config/db");
const { PORT } = require("./config/env");

// On se connecte à MongoDB AVANT d'accepter des requêtes
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Serveur backend démarré sur le port ${PORT}`);
    console.log(`http://localhost:${PORT}/api/`);
  });
});
