const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");
const User = require("../models/user.model");

// Vérifie le token Bearer et attache l'utilisateur à req.user
async function protect(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Accès refusé : token manquant" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res
        .status(401)
        .json({ error: "Accès refusé : utilisateur introuvable" });
    }

    req.user = user;
    next();
  } catch (error) {
    // token falsifié, expiré ou malformé
    return res
      .status(401)
      .json({ error: "Accès refusé : token invalide ou expiré" });
  }
}

module.exports = { protect };