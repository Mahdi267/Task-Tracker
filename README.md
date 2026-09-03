# Task Tracker Collaboratif

Une API REST complète pour la gestion collaborative de projets et de tâches, construite avec une stack technique représentative d'une application backend d'entreprise moderne.

## 🛠️ Stack technique

- **Langage** : TypeScript
- **Runtime** : Node.js
- **Framework web** : Express
- **Base de données** : PostgreSQL
- **ORM** : Prisma 7 (avec driver adapter `@prisma/adapter-pg`)
- **Authentification** : JWT (JSON Web Tokens)
- **Hachage des mots de passe** : bcrypt
- **Outils de développement** : ts-node-dev, Git

## 📐 Architecture des données

L'application repose sur trois modèles relationnels :

- **User** — un utilisateur, propriétaire de projets et assigné à des tâches
- **Project** — un projet, appartenant à un utilisateur (`owner`)
- **Task** — une tâche, appartenant à un projet, optionnellement assignée à un utilisateur

```
User (1) ──< (N) Project
User (1) ──< (N) Task (assignee)
Project (1) ──< (N) Task
```

## 🚀 Installation

### Prérequis

- Node.js
- PostgreSQL (une base de données vide, ex. `task_tracker`)

### Étapes

1. Cloner le dépôt et installer les dépendances :
   ```bash
   cd backend
   npm install
   ```

2. Créer un fichier `.env` à la racine de `backend/` avec les variables suivantes :
   ```
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:PORT/task_tracker"
   JWT_SECRET="une-chaine-longue-et-aleatoire"
   ```
   > Note : si votre mot de passe PostgreSQL contient des caractères spéciaux, ils doivent être encodés en pourcentage (ex. `/` devient `%2F`).

3. Appliquer les migrations Prisma pour créer les tables :
   ```bash
   npx prisma migrate dev
   ```

4. Lancer le serveur en mode développement :
   ```bash
   npm run dev
   ```

Le serveur démarre par défaut sur `http://localhost:3000`.

### Scripts disponibles

| Script | Description |
|---|---|
| `npm run dev` | Lance le serveur en mode développement (rechargement automatique) |
| `npm run build` | Compile le TypeScript en JavaScript (`dist/`) |
| `npm start` | Lance la version compilée (production) |

## 🔐 Authentification

L'API utilise des jetons JWT. Après connexion, le jeton doit être inclus dans le header `Authorization` de chaque requête vers une route protégée :

```
Authorization: Bearer <votre_jeton>
```

Les jetons expirent après 24h.

## 📋 Documentation de l'API

### Utilisateurs

| Méthode | Route | Protégée | Description |
|---|---|---|---|
| `POST` | `/users` | Non | Créer un compte |
| `GET` | `/users` | Non | Lister tous les utilisateurs |
| `GET` | `/users/:id` | Non | Récupérer un utilisateur |
| `PUT` | `/users/:id` | Oui (propriétaire uniquement) | Modifier son propre compte |
| `DELETE` | `/users/:id` | Oui (propriétaire uniquement) | Supprimer son propre compte |
| `POST` | `/login` | Non | Se connecter, retourne un jeton JWT |

**Exemple — créer un compte :**
```json
POST /users
{
  "email": "alice@example.com",
  "password": "motDePasse123",
  "name": "Alice"
}
```

**Exemple — se connecter :**
```json
POST /login
{
  "email": "alice@example.com",
  "password": "motDePasse123"
}
```
Réponse :
```json
{ "token": "eyJhbGciOiJIUzI1NiIs..." }
```

### Projets

| Méthode | Route | Protégée | Description |
|---|---|---|---|
| `POST` | `/projects` | Oui | Créer un projet (le propriétaire est déduit du jeton) |
| `GET` | `/projects` | Non | Lister tous les projets (avec le owner inclus) |
| `GET` | `/projects/:id` | Non | Récupérer un projet |
| `PUT` | `/projects/:id` | Oui | Modifier un projet |
| `DELETE` | `/projects/:id` | Oui | Supprimer un projet |

**Exemple — créer un projet :**
```json
POST /projects
Authorization: Bearer <jeton>
{
  "name": "Refonte du site web",
  "description": "Projet de refonte complète"
}
```

### Tâches

| Méthode | Route | Protégée | Description |
|---|---|---|---|
| `POST` | `/tasks` | Oui | Créer une tâche |
| `GET` | `/tasks` | Non | Lister toutes les tâches (avec project et assignee inclus) |
| `GET` | `/tasks/:id` | Non | Récupérer une tâche |
| `PUT` | `/tasks/:id` | Oui | Modifier une tâche |
| `DELETE` | `/tasks/:id` | Oui | Supprimer une tâche |

**Exemple — créer une tâche :**
```json
POST /tasks
Authorization: Bearer <jeton>
{
  "title": "Concevoir la maquette",
  "description": "Maquette de la page d'accueil",
  "status": "todo",
  "projectId": 1,
  "assigneeId": 2
}
```

### Codes de statut HTTP utilisés

| Code | Signification |
|---|---|
| `200` | Succès (lecture/modification) |
| `201` | Ressource créée avec succès |
| `204` | Succès, sans contenu à retourner (suppression) |
| `400` | Requête invalide (ex. référence à une ressource inexistante) |
| `401` | Non authentifié (jeton manquant, invalide ou expiré) |
| `403` | Authentifié, mais action non autorisée sur cette ressource |
| `404` | Ressource introuvable |
| `409` | Conflit (ex. email déjà utilisé) |
| `500` | Erreur interne du serveur |

## 🔒 Sécurité

- Les mots de passe sont hachés avec bcrypt (jamais stockés en clair)
- Les mots de passe ne sont jamais renvoyés dans les réponses de l'API
- Les routes de modification/création exigent un jeton JWT valide
- Un utilisateur ne peut modifier ou supprimer que son propre compte
- Les identifiants sensibles (base de données, clé JWT) sont stockés dans `.env`, exclu du versionnement

## 📁 Structure du projet

```
backend/
├── src/
│   ├── generated/prisma/   # Client Prisma généré (non versionné)
│   ├── prisma.ts           # Instance du client Prisma
│   └── index.ts            # Point d'entrée, routes de l'API
├── prisma/
│   ├── schema.prisma        # Modèles de données
│   └── migrations/          # Historique des migrations
├── .env                      # Variables d'environnement (non versionné)
├── package.json
└── tsconfig.json
```

## 🗺️ Roadmap

- [x] API REST complète (User, Project, Task)
- [x] Authentification JWT
- [ ] Frontend React
- [ ] Tests automatisés
- [ ] Conteneurisation (Docker)
- [ ] CI/CD (GitHub Actions)
- [ ] Déploiement