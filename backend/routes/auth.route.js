const express = require("express");
const rateLimit = require("express-rate-limit");
const { register, login, logout } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

// Anti brute-force : 10 tentatives de connexion max par IP / 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Trop de tentatives de connexion, réessayez dans 15 minutes",
  },
});

router.post("/register", register);
router.post("/login", loginLimiter, login);
router.post("/logout", protect, logout);

module.exports = router;