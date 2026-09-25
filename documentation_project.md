# Documentation du projet Google Map Scraper

## 1. Présentation

Google Map Scraper est une application web composée de deux parties :

- un **frontend React/Vite** qui permet à un utilisateur connecté de saisir une recherche et une localisation ;
- un **backend Node.js/Express** qui authentifie les utilisateurs, protège l’API et transmet les demandes de scraping à un webhook n8n.

Le backend ne réalise pas directement le scraping dans le navigateur. Il délègue cette opération au workflow n8n configuré par `N8N_WEBHOOK_URL`, attend la réponse, puis renvoie les résultats au frontend. Les résultats peuvent ensuite être affichés dans un tableau et téléchargés au format Excel.

## 2. Architecture générale

```text
Navigateur
   |
   | React + Vite
   | - /login
   | - /scrape
   | - /profile
   |
   | HTTP/JSON + JWT Bearer
   v
API Express : http://localhost:3000
   |
   | MongoDB
   | - utilisateurs
   |
   | Webhook HTTP
   v
n8n
   |
   v
Résultats de scraping
```

### Technologies utilisées

#### Frontend

- React 19
- Vite
- React Router
- Axios
- React Icons
- SheetJS/XLSX pour la génération des fichiers Excel
- ESLint

#### Backend

- Node.js
- Express 5
- Axios pour l’appel au webhook n8n
- MongoDB avec Mongoose
- JSON Web Token (`jsonwebtoken`)
- `bcryptjs` pour le hash des mots de passe
- `cors`
- `express-rate-limit`
- `dotenv`
- Nodemon en développement

## 3. Structure du dépôt

```text
Google_map_scraper/
├── backend/
│   ├── config/
│   │   ├── db.js                  # Connexion à MongoDB
│   │   └── env.js                 # Lecture et centralisation des variables
│   ├── controllers/
│   │   ├── auth.controller.js     # Inscription, connexion, déconnexion
│   │   └── scrape.controller.js   # Validation et appel du webhook n8n
│   ├── middleware/
│   │   ├── auth.middleware.js     # Vérification du JWT
│   │   └── error.middleware.js    # 404 et gestion d'erreurs
│   ├── models/
│   │   └── user.model.js          # Schéma MongoDB des utilisateurs
│   ├── routes/
│   │   ├── auth.route.js          # Routes /api/auth/*
│   │   └── scrape.route.js        # Route /api/scrape
│   ├── .env                       # Configuration locale, non versionnée
│   ├── app.js                     # Configuration Express
│   ├── package.json
│   └── server.js                  # Point d'entrée du serveur
├── frontend/
│   ├── public/                    # Fichiers statiques
│   ├── src/
│   │   ├── api/axios.js           # Instance Axios et intercepteurs JWT
│   │   ├── component/             # Composants réutilisables
│   │   ├── context/               # Contexte d'authentification
│   │   ├── pages/                 # Pages Login, Profil et Scraping
│   │   ├── App.jsx                # Définition des routes
│   │   └── main.jsx               # Montage React
│   ├── .env                       # URL de l'API frontend
│   ├── package.json
│   └── vite.config.js
└── documentation_project.md
```

Les dossiers `node_modules` et les fichiers `.env` sont ignorés par Git. Les dépendances doivent donc être réinstallées après un clonage.

## 4. Prérequis

Installer au préalable :

1. Node.js et npm ;
2. MongoDB local ou une instance MongoDB accessible ;
3. un workflow n8n exposant un webhook qui accepte les paramètres de recherche ;
4. un navigateur moderne.

Vérifier les installations :

```bash
node --version
npm --version
```

## 5. Installation

Depuis la racine du projet :

```bash
cd backend
npm install

cd ../frontend
npm install
```

Sur Windows PowerShell, les mêmes commandes peuvent être exécutées dans deux terminaux séparés afin de lancer le backend et le frontend simultanément.

## 6. Configuration

### 6.1 Variables du backend

Créer `backend/.env` à partir de cet exemple. Ne pas utiliser cet exemple comme emplacement pour une vraie clé secrète dans un dépôt public.

```env
PORT=3000
N8N_WEBHOOK_URL=https://exemple-n8n/webhook/scrape
MONGO_URI=mongodb://127.0.0.1:27017/google_map_scraper
JWT_SECRET=remplacer-par-une-cle-longue-et-aleatoire
JWT_EXPIRES_IN=1d
FRONTEND_URL=http://localhost:5173
```

Description :

| Variable | Obligatoire | Valeur par défaut | Rôle |
|---|---:|---|---|
| `PORT` | Non | `3000` | Port HTTP du backend |
| `N8N_WEBHOOK_URL` | Oui pour scraper | Aucune | URL du webhook n8n |
| `MONGO_URI` | Non | `mongodb://127.0.0.1:27017/google_map_scraper` | URI de connexion MongoDB |
| `JWT_SECRET` | Oui pour l’authentification | Aucune | Clé de signature des JWT |
| `JWT_EXPIRES_IN` | Non | `1d` | Durée de validité du JWT |
| `FRONTEND_URL` | Non | `http://localhost:5173` | Origine autorisée par CORS |

`JWT_SECRET` et l’URL réelle n8n ne doivent jamais être commités. En production, utiliser des variables secrètes du système d’hébergement.

### 6.2 Variables du frontend

Créer `frontend/.env` :

```env
VITE_API_URL=http://localhost:3000/api
```

`VITE_API_URL` est utilisée comme base URL par l’instance Axios du frontend.

## 7. Lancement en développement

### Backend

```bash
cd backend
npm run dev
```

Le serveur attend d’abord la connexion à MongoDB, puis écoute sur le port configuré. Avec la configuration par défaut :

```text
http://localhost:3000
```

Le test de disponibilité :

```text
GET http://localhost:3000/
```

Réponse attendue :

```text
API Scraper en ligne
```

### Frontend

Dans un autre terminal :

```bash
cd frontend
npm run dev
```

Vite affiche normalement l’URL :

```text
http://localhost:5173
```

### Lancement sans Nodemon

```bash
cd backend
npm start
```

## 8. Fonctionnement de l’authentification

### Inscription

L’API accepte un nom d’utilisateur d’au moins 3 caractères et un mot de passe d’au moins 6 caractères. Le nom est nettoyé et stocké en minuscules. Le mot de passe est hashé avec `bcryptjs` avant d’être enregistré.

Le modèle utilisateur ne renvoie jamais le hash du mot de passe dans les réponses JSON.

### Connexion

Après validation des identifiants, le backend génère un JWT contenant l’identifiant et le nom de l’utilisateur. Le frontend stocke le token et les informations utilisateur dans `localStorage`.

Au démarrage, `AuthProvider` :

1. lit le token et l’utilisateur dans `localStorage` ;
2. vérifie la structure JWT et la date d’expiration localement ;
3. supprime les données locales si le token est malformé ou expiré ;
4. expose `user`, `token`, `isAuthenticated`, `login` et `logout` via `AuthContext`.

Cette vérification locale ne vérifie pas la signature du token. La validation de sécurité réelle est réalisée par le middleware backend `protect` avec `JWT_SECRET`.

### Protection des routes frontend

`ProtectedRoute` redirige vers `/login` si aucune session locale valide n’existe. Les pages `/scrape` et `/profile` sont placées dans cette branche privée.

### Déconnexion

La déconnexion serveur répond avec succès, mais le JWT est stateless. Le frontend supprime donc principalement le token et l’utilisateur stockés localement. La page Profil possède également un bouton de déconnexion qui nettoie la session locale.

## 9. Référence de l’API

Toutes les routes API sont préfixées par `/api`.

### `GET /`

Route de contrôle du serveur.

Réponse :

```text
API Scraper en ligne
```

### `POST /api/auth/register`

Crée un utilisateur et renvoie immédiatement un JWT.

Requête :

```json
{
  "username": "demo",
  "password": "motdepasse"
}
```

Réponse `201` :

```json
{
  "token": "jwt...",
  "user": {
    "_id": "identifiant-mongodb",
    "username": "demo",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

Erreurs principales :

- `400` si un champ manque ou ne respecte pas la longueur minimale ;
- `409` si le nom d’utilisateur existe déjà.

### `POST /api/auth/login`

Authentifie un utilisateur. Cette route est limitée à 10 tentatives par adresse IP sur une période de 15 minutes.

Requête :

```json
{
  "username": "demo",
  "password": "motdepasse"
}
```

Réponse `200` :

```json
{
  "token": "jwt...",
  "user": {
    "_id": "identifiant-mongodb",
    "username": "demo"
  }
}
```

Réponses possibles :

- `400` si `username` ou `password` manque ;
- `401` si les identifiants sont invalides ;
- `429` si la limite anti-brute-force est dépassée.

### `POST /api/auth/logout`

Route protégée. Elle exige :

```http
Authorization: Bearer <jwt>
```

Réponse `200` :

```json
{
  "message": "Déconnexion réussie"
}
```

Comme les JWT sont stateless, le client doit également supprimer son token.

### `POST /api/scrape`

Route protégée par JWT. Elle transmet la demande au webhook n8n.

En-tête obligatoire :

```http
Authorization: Bearer <jwt>
Content-Type: application/json
```

Requête :

```json
{
  "searchQuery": "Ecole privée",
  "location": "Casablanca, Morocco"
}
```

Le backend appelle n8n avec le même objet JSON. Le timeout de l’appel n8n est de 120 secondes.

Réponse `200` :

```json
{
  "data": [
    {
      "title": "Nom de l'établissement",
      "phone": "+212..."
    }
  ]
}
```

Réponses possibles :

- `400` si `searchQuery` ou `location` manque ;
- `401` si le token manque, est invalide, est expiré ou correspond à un utilisateur supprimé ;
- `204` si le webhook ne renvoie aucun résultat ;
- `500` si l’appel n8n échoue ou si une erreur interne survient.

## 10. Parcours utilisateur frontend

### Page de connexion

URL : `/login`

L’utilisateur saisit son nom et son mot de passe. Après une connexion réussie, il est redirigé vers `/scrape`. Une session déjà active redirige automatiquement vers cette même page.

### Page de scraping

URL : `/scrape`

La page contient :

- un champ `searchQuery` pour le sujet de recherche ;
- un champ `location` pour la localisation ;
- un bouton de lancement ;
- un état de chargement ;
- un tableau des résultats ;
- un bouton de téléchargement Excel lorsque des résultats sont disponibles.

Le fichier produit est nommé selon le format :

```text
resultats_scraping_YYYY-MM-DD.xlsx
```

Les colonnes actuellement affichées dans le tableau sont `Title` et `Phone`, à partir des propriétés `title` et `phone` renvoyées par le workflow n8n.

### Page de profil

URL : `/profile`

La page affiche les informations utilisateur présentes dans `localStorage` et permet de fermer la session locale.

## 11. Gestion des erreurs

Le backend possède deux middlewares finaux :

- `notFound` renvoie un JSON `404` pour une route inconnue ;
- `errorHandler` centralise les erreurs, notamment les erreurs de validation Mongoose et les doublons sur le champ unique `username`.

Les erreurs internes HTTP 500 ne renvoient pas le message technique au client. Le détail est journalisé côté serveur.

## 12. Sécurité

Mesures actuellement présentes :

- hash des mots de passe avec bcrypt ;
- exclusion du hash du mot de passe des réponses JSON ;
- validation de la signature et de l’expiration des JWT côté serveur ;
- middleware d’autorisation pour les routes privées ;
- limitation des tentatives de connexion ;
- CORS limité à `FRONTEND_URL` ;
- variables sensibles externalisées dans `.env` ;
- suppression locale d’une session lorsque le token est expiré ou qu’une réponse API renvoie `401`.

Recommandations pour la production :

1. générer une nouvelle valeur aléatoire pour `JWT_SECRET` ;
2. utiliser HTTPS ;
3. limiter ou sécuriser l’accès au webhook n8n ;
4. utiliser une base MongoDB protégée par authentification et réseau privé ;
5. ne jamais exposer les fichiers `.env` ;
6. ajouter une validation stricte de la forme des résultats n8n ;
7. envisager des cookies `HttpOnly` et `Secure` si la stratégie de session doit être renforcée ;
8. configurer une politique de logs et de rotation des secrets.

## 13. Scripts disponibles

### Backend

| Commande | Description |
|---|---|
| `npm install` | Installe les dépendances |
| `npm run dev` | Démarre le backend avec Nodemon |
| `npm start` | Démarre le backend avec Node |
| `npm test` | Placeholder actuel : aucun test n’est configuré |

### Frontend

| Commande | Description |
|---|---|
| `npm install` | Installe les dépendances |
| `npm run dev` | Démarre Vite en développement |
| `npm run build` | Génère le build de production dans `dist/` |
| `npm run preview` | Sert localement le build généré |
| `npm run lint` | Lance ESLint |

## 14. Dépannage

### Le backend s’arrête au démarrage

Vérifier :

- que MongoDB est démarré ;
- que `MONGO_URI` est correcte ;
- que `JWT_SECRET` est défini ;
- que le port `3000` n’est pas déjà utilisé.

### Le frontend ne peut pas appeler l’API

Vérifier :

- que le backend est lancé ;
- que `VITE_API_URL` pointe vers la bonne URL ;
- que `FRONTEND_URL` correspond exactement à l’origine affichée par Vite ;
- les erreurs CORS dans la console du navigateur.

### Le scraping ne renvoie rien

Vérifier :

- la valeur de `N8N_WEBHOOK_URL` ;
- que le workflow n8n est actif et accessible ;
- que le webhook accepte `searchQuery` et `location` ;
- les logs du backend et l’exécution du workflow n8n ;
- que le webhook renvoie un tableau non vide.

### Réponse `401`

Le token peut être absent, expiré, malformé, falsifié ou associé à un utilisateur supprimé. Se reconnecter et vérifier l’en-tête :

```http
Authorization: Bearer <jwt>
```

## 15. Points d’attention techniques

- La route `/api/scrape` est protégée côté backend : toute intégration frontend ou client HTTP doit transmettre le JWT.
- L’instance Axios de `frontend/src/api/axios.js` ajoute automatiquement le token et traite les réponses `401`. Les appels directs avec une autre instance Axios doivent reproduire ce comportement ou utiliser l’instance partagée.
- Le contrat de résultat attendu par l’interface est actuellement un tableau d’objets contenant au minimum `title` et `phone`.
- Le workflow n8n constitue une dépendance externe : sa disponibilité, son format de réponse et son temps d’exécution influencent directement le résultat de l’application.
- Aucun jeu de tests backend automatisés n’est actuellement défini dans `package.json`.

## 16. Déploiement indicatif

Pour un déploiement :

1. construire le frontend avec `npm run build` dans `frontend/` ;
2. publier le contenu de `frontend/dist/` sur un hébergeur statique ;
3. déployer le backend Node.js ;
4. fournir les variables d’environnement du backend sur la plateforme ;
5. configurer MongoDB et n8n ;
6. remplacer `FRONTEND_URL` par l’URL HTTPS réelle du frontend ;
7. remplacer `VITE_API_URL` par l’URL publique de l’API avant le build frontend ;
8. vérifier les routes d’authentification et de scraping avec un compte de test.

La configuration de production exacte dépend de l’hébergeur choisi et n’est pas incluse dans le dépôt actuel.

