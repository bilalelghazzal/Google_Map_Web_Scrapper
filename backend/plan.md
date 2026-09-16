## `server.js`

Point d'entrée de l'application. Démarre le serveur Express et l'écoute sur le port configuré. C'est le fichier que tu lances avec `npm start` ou `npm run dev`.

## `src/app.js`

Configure l'application Express elle-même : active CORS (pour autoriser React à faire des requêtes), active le parsing JSON des requêtes entrantes, et connecte les routes (`/api/...`) au bon endroit.

Séparé de `server.js` pour pouvoir tester l'app sans forcément démarrer un serveur (utile en tests automatisés plus tard).

## `src/config/env.js`

Centralise la lecture des variables d'environnement (`.env`). Au lieu d'écrire `process.env.PORT` partout dans le code, tu importes ce fichier — plus propre et plus facile à maintenir si tu ajoutes d'autres variables plus tard (clé API, etc.).

## `.env`

Contient les valeurs sensibles ou configurables (port du serveur, URL du webhook n8n).

Jamais poussé sur GitHub (protégé par `.gitignore`) — permet de changer l'URL n8n sans toucher au code.

## `.gitignore`

Liste des fichiers/dossiers à ne jamais commiter sur Git : `node_modules` (trop lourd, régénérable) et `.env` (données sensibles).

## `src/routes/scrape.route.js`

Définit les URLs (endpoints) de ton API et les relie aux fonctions qui les traitent.

Ici : `POST /api/scrape` est relié à la fonction `scrapeData`.

Séparer les routes des controllers permet d'ajouter facilement d'autres routes plus tard (ex: `/api/history`) sans tout mélanger.

## `src/controllers/scrape.controller.js`

Contient la vraie logique métier : valider les données reçues du frontend, appeler le webhook n8n, gérer les erreurs, et renvoyer la réponse formatée au frontend React.

C'est le cœur de ton backend.
