const mongoose = require("mongoose");
const { MONGO_URI } = require("./env");

// Connexion à MongoDB, appelée depuis server.js AVANT app.listen()
async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`MongoDB connecté : ${MONGO_URI}`);
  } catch (error) {
    console.error("Erreur de connexion MongoDB :", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;