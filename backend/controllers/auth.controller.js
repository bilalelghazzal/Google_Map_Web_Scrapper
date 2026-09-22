const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../config/env");

// Génère un token signé contenant l'id et le username
function generateToken(user) {
  return jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}


// POST /api/auth/register
exports.register = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "username et password sont requis" });
  }
  if (username.trim().length < 3) {
    return res.status(400).json({error: "Le nom d'utilisateur doit contenir au moins 3 caractères", });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Le mot de passe doit contenir au moins 6 caractères" });
  }

// check if user exist 
  const existing = await User.findOne({
    username: username.trim().toLowerCase(),
  });
  if (existing) {
    return res.status(409).json({ error: "Ce nom d'utilisateur est déjà utilisé" });
  }

  const user = await User.create({ username: username.trim(), password });

  // toJSON() du modèle retire le hash du mot de passe
  res.status(201).json({ token: generateToken(user), user });
};

// POST /api/auth/login
exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "username et password sont requis" });
  }

  // il faut demander le pswd explicitmeent 
  const user = await User.findOne({
    username: username.trim().toLowerCase(),
  }).select("+password");

  // Message générique 
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: "Identifiants invalides" });
  }

  res.status(200).json({ token: generateToken(user), user });
};

// POST /api/auth/logout
exports.logout = (req, res) => {
  res.status(200).json({ message: "Déconnexion réussie" });
};
