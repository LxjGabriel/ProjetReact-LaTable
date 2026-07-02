# La Table — Application de réservation de restaurant

Application web full-stack de gestion de réservations pour un restaurant. Elle permet aux clients de consulter la carte, de réserver une table et de gérer leurs réservations, tandis que les administrateurs disposent d'outils de gestion complets.

---

## Technologies utilisées

### Frontend
| Technologie | Version | Rôle |
|---|---|---|
| React | 19 | Framework UI |
| React Router DOM | 7 | Routage côté client |
| Axios | 1.9 | Appels HTTP vers l'API |
| Vite | 6 | Bundler et serveur de développement |
| CSS custom properties | — | Design system (sans framework CSS) |

### Backend
| Technologie | Version | Rôle |
|---|---|---|
| Node.js | — | Environnement d'exécution |
| Express | 5 | Framework HTTP |
| PostgreSQL | 14 | Base de données |
| pg | 8 | Client PostgreSQL (requêtes SQL brutes, sans ORM) |
| jsonwebtoken | 9 | Authentification JWT |
| bcryptjs | 3 | Hachage des mots de passe |
| dotenv | 16 | Variables d'environnement |

---

## Architecture générale

```
Project-Node-React/
├── backend/               # API Node.js / Express
│   ├── controllers/       # Logique métier par ressource
│   ├── routes/            # Définition des routes Express
│   ├── middleware/        # Auth JWT + vérification de rôle
│   ├── db/                # Configuration de la connexion PostgreSQL
│   ├── init-db/           # Script SQL d'initialisation (init.sql)
│   └── server.js          # Point d'entrée du serveur
├── frontend/              # Application React
│   └── src/
│       ├── components/    # Composants réutilisables
│       ├── views/         # Pages (auth, menu, reservation, profile)
│       ├── services/      # Appels API et utilitaires
│       └── styles/        # Fichiers CSS spécifiques
├── docker-compose.yml     # Orchestration des services Docker
├── Makefile               # Commandes simplifiées
└── README.md
```

---

## Lancer le projet

### Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé et **démarré**

> Docker Desktop inclut Docker Compose — aucune installation supplémentaire n'est nécessaire.

---

### Étape 1 — Cloner le dépôt

```bash
git clone https://github.com/LxjGabriel/ProjetReact-LaTable.git
cd ProjetReact-LaTable
```

### Étape 2 — Lancer Docker Desktop

Ouvre **Docker Desktop** et attends que l'icône dans la barre des tâches soit stable (plus de spinner).

### Étape 3 — Construire et démarrer les services

**Avec Make :**
```bash
make build
make start
```

**Sans Make :**
```bash
docker-compose build
docker-compose up -d
```

> La première fois, `build` peut prendre quelques minutes (téléchargement des images Node.js et PostgreSQL). Les fois suivantes, `make start` ou `docker-compose up -d` suffit.

### Étape 4 — Ouvrir l'application

| Service | URL |
|---|---|
| **Application (frontend)** | http://localhost:3001 |
| API backend | http://localhost:3000 |

Ouvre **http://localhost:3001** dans ton navigateur. C'est prêt.

---

### Arrêter les services

```bash
make stop
# ou
docker-compose down
```

### Réinitialiser complètement (base de données incluse)

```bash
make clean
# ou
docker-compose down -v
```

---

## Développement local (sans Docker)

Si tu préfères lancer les services manuellement sans Docker :

**Backend**
```bash
cd backend
npm install
node server.js
# API disponible sur http://localhost:3000
```

**Frontend** — dans un second terminal
```bash
cd frontend
npm install
npx vite --port 5173
# Frontend disponible sur http://localhost:5173
```

> Le `vite.config.js` est configuré sur le port 3000, ce qui entre en conflit avec le backend. Utilise `--port 5173` pour éviter ce conflit.

---

## Dépannage

**Les conteneurs ne démarrent pas ?**
Vérifie que Docker Desktop est bien lancé avant d'exécuter les commandes.

**Le port 3000 ou 3001 est déjà utilisé ?**
Un autre service tourne sur ce port. Arrête-le, ou modifie les ports dans `docker-compose.yml`.

**Les données n'apparaissent pas ?**
La base de données est initialisée automatiquement au premier lancement via `backend/init-db/init.sql`. Si elle semble vide, fais `make clean` puis `make build && make start` pour repartir de zéro.

---

## Commandes Make disponibles

| Commande | Description |
|---|---|
| `make build` | Construit les images Docker |
| `make start` | Démarre tous les services en arrière-plan |
| `make stop` | Arrête tous les services |
| `make restart` | Redémarre tous les services |
| `make clean` | Arrête les services et supprime les volumes |

---

## Variables d'environnement

Ces variables sont configurées dans `docker-compose.yml`. Pour un déploiement manuel, créez un fichier `.env` dans `backend/` :

| Variable | Description | Valeur par défaut (Docker) |
|---|---|---|
| `DB_HOST` | Hôte de la base de données | `db` |
| `DB_USER` | Utilisateur PostgreSQL | `postgres` |
| `DB_PASSWORD` | Mot de passe PostgreSQL | `postgres` |
| `DB_NAME` | Nom de la base de données | `resa_db` |
| `DB_PORT` | Port PostgreSQL | `5432` |
| `SECRET_KEY` | Clé secrète JWT | `1234567890123432` |
| `PORT` | Port d'écoute du serveur | `3000` |

> **Important :** Changez `SECRET_KEY` et les mots de passe PostgreSQL avant tout déploiement en production.

---

## Comptes de démonstration

Créés automatiquement au premier lancement via `backend/init-db/init.sql`.

| Rôle | Email | Mot de passe |
|---|---|---|
| Administrateur | admin@example.com | Password123! |
| Utilisateur | user@example.com | Password123! |

---

## Fonctionnalités principales

### Côté utilisateur
- Consultation de la carte par catégorie (Entrées, Plats, Desserts, Boissons)
- Création d'une réservation en choisissant un créneau disponible et un nombre de personnes
- Consultation et annulation de ses propres réservations
- Gestion du profil (email, prénom, nom, téléphone)
- Changement de mot de passe

### Côté administrateur
- Gestion de la carte : ajout, modification et suppression de produits
- Consultation de toutes les réservations avec filtres (date, statut)
- Confirmation ou refus des réservations en attente
- Accès aux informations de contact des clients

### Authentification
- Inscription et connexion par email / mot de passe
- Authentification JWT (token valable 1 heure, transmis en Bearer)
- Deux rôles : `USER` (0) et `ADMIN` (1)
- Routes protégées selon le rôle

---

## Routes du frontend

| Route | Accès | Description |
|---|---|---|
| `/` | Public | Page d'accueil |
| `/login` | Public | Connexion |
| `/signup` | Public | Inscription |
| `/logout` | Public | Déconnexion |
| `/menu` | Public | Carte du restaurant |
| `/menu/create` | Admin | Ajouter un produit à la carte |
| `/menu/edit/:id` | Admin | Modifier un produit |
| `/reservations` | Admin | Gestion de toutes les réservations |
| `/reservations/new` | Utilisateur | Créer une nouvelle réservation |
| `/my-reservations` | Utilisateur | Mes réservations |
| `/profile` | Authentifié | Mon profil |
| `/update-profile` | Authentifié | Modifier le profil |
| `/change-password` | Authentifié | Changer le mot de passe |

Les routes protégées redirigent vers `/login` si l'utilisateur n'est pas connecté, et vers `/` s'il ne dispose pas du rôle requis.

---

## Documentation de l'API

**Base URL :** `http://localhost:3000`

**Authentification :** Token JWT passé dans le header :
```
Authorization: Bearer <token>
```

### Authentification

| Méthode | Route | Auth | Description |
|---|---|---|---|
| POST | `/login` | Non | Connexion — retourne un token JWT |
| POST | `/signup` | Non | Inscription |
| GET | `/me` | Oui | Profil de l'utilisateur connecté |
| PUT | `/update-profile` | Oui | Modifier le profil |
| POST | `/change-password` | Oui | Changer le mot de passe |
| GET | `/user/:id` | Admin | Obtenir un utilisateur par son ID |

### Menu

| Méthode | Route | Auth | Description |
|---|---|---|---|
| GET | `/menu` | Non | Tous les produits |
| GET | `/menu/category/:category` | Non | Produits par catégorie (0=Entrée, 1=Plat, 2=Dessert, 3=Boisson) |
| GET | `/menu/:id` | Non | Un produit par son ID |
| POST | `/menu` | Admin | Créer un produit |
| PUT | `/menu/:id` | Admin | Modifier un produit |
| DELETE | `/menu/:id` | Admin | Supprimer un produit |

### Réservations

| Méthode | Route | Auth | Description |
|---|---|---|---|
| GET | `/reservation/my` | Oui | Réservations de l'utilisateur connecté |
| POST | `/reservation` | Oui | Créer une réservation |
| DELETE | `/reservation/:id` | Oui | Annuler une réservation |
| GET | `/reservation` | Admin | Toutes les réservations |
| PUT | `/reservation/:id/confirm` | Admin | Confirmer une réservation |
| PUT | `/reservation/:id` | Admin | Modifier une réservation |

### Créneaux d'ouverture

| Méthode | Route | Auth | Description |
|---|---|---|---|
| GET | `/opening_slot/available` | Non | Créneaux disponibles à la réservation |
| GET | `/opening_slot` | Non | Tous les créneaux |
| POST | `/opening_slot` | Admin | Créer un créneau |
| PUT | `/opening_slot/:id` | Admin | Modifier un créneau |
| DELETE | `/opening_slot/:id` | Admin | Supprimer un créneau |

---

## Schéma des composants (Frontend)

```
App
├── NavBarComponent
├── ToastContainer
└── Routes
    ├── Home
    │   └── ReservationButton
    ├── Login
    ├── Signup
    ├── Logout
    ├── MenuHome
    │   ├── MenuCardComponent (×4 catégories)
    │   │   └── MenuActionsPopover (admin uniquement)
    │   └── ReservationButton
    ├── MenuAdd (admin)
    │   ├── InputComponent
    │   ├── SelectComponent
    │   └── ButtonComponent
    ├── MenuEdit (admin)
    │   ├── InputComponent
    │   ├── SelectComponent
    │   └── ButtonComponent
    ├── MyReservations
    │   ├── ReservationList
    │   │   └── ReservationCard (×n)
    │   └── ReservationButton
    ├── NewReservation
    │   ├── InputComponent
    │   └── ButtonComponent
    ├── Reservations (admin)
    │   └── Table avec filtres (date, statut)
    ├── Profile
    │   └── ButtonComponent
    ├── EditProfile
    │   ├── InputComponent
    │   └── ButtonComponent
    └── ChangePassword
        ├── InputComponent
        └── ButtonComponent
```

> `NavBarComponent` et `ToastContainer` sont présents sur toutes les pages.
> Les routes protégées utilisent le composant `ProtectedRoute`.

---

## Auteurs

- **José Gabriel Vasquez Duarte**
- **Rania**
