# Application réservation restaurant 
# Installation

Lancez Docker

## Avec Make

Si vous avez Make, dans le terminal entrez seulement ces commandes :

```
make build
make start
```

## Sans Make

Si vous n'avez pas Make, alors lancez ces commandes :

```
docker-compose build
docker-compose up -d
```

L'API devrait se lancer [Ici](http://localhost:3000)

# Connexion :

## Admin :

- admin@example.com
- Password123!

## User :

- user@example.com
- Password123!

# Repartition des tâches - Backend

- Auth / JWT : Cedric - Tom
- Reservations : Nicolas - Tom
- Tables : Jose
- Menus : Tom
- Docker : Nicolas

# API Documentation

Dans le rendu du devoir il y a l'export POSTMAN de la collection avec toute les routes de l'API
pour certaines routes, il faut etre authentifié,
l'enpoint login permet de se connecter, il renvera un token.
Ce token sera a entré dans Auth de la requête (Bearer Token)

# Repartition des tâches - Frontend

|                                                                                 | Cédric | Tom | Nicolas |
| ------------------------------------------------------------------------------- | ------ | --- | ------- |
| Affichage des réservations                                                      |        |     | x       |
| Annulation / confiramtions réservation coté admin                               |        |     | x       |
| Pagination dans les réservations                                                |        |     | x       |
| Récupérations des opening slots available                                       | x      |     |         |
| Création des reservations en fonction des openings slots et nombre de personnes | x      |     |         |
| Filtre des reservations coté admin                                              | x      |     |         |
| Récupérations / création des menus                                              |        | x   |         |
| Setup Router, Toasts                                                            |        | x   |         |
| Setup de l'authentification                                                     |        | x   |         |
| Page profile / chane password / update profile                                  |        | x   |         |

# Routes Frontend

Voici la liste des routes principales de l'application React et leur description :

| Route               | Description                                              |
| ------------------- | -------------------------------------------------------- |
| `/`                 | Accueil de l'application                                 |
| `/login`            | Page de connexion utilisateur                            |
| `/signup`           | Page d'inscription utilisateur                           |
| `/logout`           | Déconnexion et redirection vers la page de connexion     |
| `/menu`             | Affichage de tous les menus                              |
| `/menu/create`      | Création d'un nouveau menu (réservé aux administrateurs) |
| `/menu/edit/:id`    | Édition d'un menu existant (réservé aux administrateurs) |
| `/my-reservations`  | Affichage des réservations de l'utilisateur connecté     |
| `/reservations`     | Gestion des réservations (réservé aux administrateurs)   |
| `/reservations/new` | Création d'une nouvelle réservation                      |
| `/profile`          | Affichage du profil utilisateur                          |
| `/change-password`  | Modification du mot de passe                             |
| `/update-profile`   | Modification des informations du profil                  |

- Les routes protégées nécessitent d'être connecté, certaines nécessitent également le rôle administrateur.
- Si l'accès n'est pas autorisé, l'utilisateur est redirigé vers la page de connexion ou la page d'accueil selon le cas.
