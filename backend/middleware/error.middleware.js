// Route inconnue -> 404 en JSON
function notFound(req, res) {
  res.status(404).json({ error: `Route introuvable : ${req.originalUrl}` });
}

// Gestion centralisée des erreurs.
// Express 5 envoie ici automatiquement les rejets des middlewares async.
function errorHandler(err, req, res, next) {
  console.error("Erreur serveur :", err.message);

  // Erreur de validation Mongoose (champ requis, minlength, ...)
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: messages.join(", ") });
  }

  // Doublon sur un champ unique (ex : username déjà pris)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "champ";
    return res
      .status(409)
      .json({ error: `Cette valeur est déjà utilisée : ${field}` });
  }

  const status = err.statusCode || 500;
  // On ne renvoie jamais le message interne d'une erreur 500 au client
  const message =
    status === 500 ? "Erreur interne du serveur" : err.message;

  res.status(status).json({ error: message });
}

module.exports = { notFound, errorHandler };