# Instalation

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

# Repartition des tâches

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
