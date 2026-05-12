# Guide d'Intégration API — Plateforme de Gestion Universitaire

Ce guide est destiné à l'équipe Frontend pour l'intégration avec l'API REST backend (Play Framework). Il détaille l'URL de base, les conventions de réponse, le système d'authentification et les principaux endpoints disponibles.

## 1. Informations de base

- **Base URL locale** : `http://localhost:9000/api`
- **Format de données** : `application/json`
- **CORS** : Le preflight CORS (`OPTIONS`) est configuré sur toutes les routes.

---

## 2. Format des réponses JSON

L'API utilise un format de réponse standardisé pour faciliter le traitement côté frontend.

### Succès (Ressource unique)
```json
{
  "success": true,
  "data": { ... }
}
```

### Succès (Liste avec total)
```json
{
  "success": true,
  "total": 42,
  "data": [ { ... }, { ... } ]
}
```

### Erreur (4xx, 5xx)
```json
{
  "success": false,
  "erreur": "Message d'erreur compréhensible par l'utilisateur"
}
```

> **Astuce** : Ne vous fiez pas uniquement au code HTTP (200, 400, 404). Vérifiez toujours la valeur de `success` dans la réponse JSON.

---

## 3. Authentification & Rôles

L'API utilise le **JWT (JSON Web Token)** pour sécuriser les routes. 
Un système de Rate Limiting (limitation de débit) est actif sur la route de login pour éviter le bruteforce.

### Flux de connexion
1. **Login** : Envoyez les credentials sur `POST /api/auth/login`.
2. **Stockage** : Stockez le `token` reçu dans le `localStorage` ou dans un cookie HTTP Only.
3. **Appels API** : Pour toutes les routes protégées, ajoutez le header suivant à votre requête :
   `Authorization: Bearer <votre_token>`

### Rôles (`RoleUtilisateur`)
Les rôles disponibles sont : `ADMIN`, `ENSEIGNANT`, `ETUDIANT`. 
Certaines routes sont restreintes. Par exemple :
- La création d'un étudiant (`POST /api/etudiants`) est réservée à `ADMIN`.
- La consultation du profil étudiant (`GET /api/etudiants/:matricule`) est accessible à l'étudiant concerné et aux administrateurs.

---

## 4. Endpoints Principaux (Cheatsheet)

### 🔐 Authentification
| Méthode | Endpoint | Description | Payload requis |
|---|---|---|---|
| POST | `/api/auth/login` | Connexion | `{ "email": "...", "password": "..." }` |
| GET | `/api/auth/me` | Infos de l'utilisateur connecté | *Header Authorization* |
| POST | `/api/auth/logout` | Déconnexion logicielle | *Aucun* |

### 🎓 Étudiants
| Méthode | Endpoint | Description | Rôle |
|---|---|---|---|
| GET | `/api/etudiants` | Liste tous les étudiants | ADMIN |
| POST | `/api/etudiants` | Créer un étudiant | ADMIN |
| GET | `/api/etudiants/:matricule` | Infos d'un étudiant | ADMIN / ETUDIANT |
| PUT | `/api/etudiants/:matricule` | Mettre à jour | ADMIN |
| GET | `/api/etudiants/stats` | Statistiques globales | ADMIN |

### 👨‍🏫 Enseignants
| Méthode | Endpoint | Description | Rôle |
|---|---|---|---|
| GET | `/api/enseignants` | Liste des enseignants | ADMIN |
| POST | `/api/enseignants` | Créer un enseignant | ADMIN |
| GET | `/api/enseignants/:id/cours` | Cours de l'enseignant | ADMIN / ENSEIGNANT |

### 📚 Formations & UEs
| Méthode | Endpoint | Description | Rôle |
|---|---|---|---|
| GET | `/api/formations` | Liste des filières | Tous |
| GET | `/api/formations/:filiere/arbre` | Arbre complet de la filière | Tous |
| GET | `/api/formations/:filiere/volumes` | Volumes horaires | ADMIN |

### 📝 Notes & Absences
| Méthode | Endpoint | Description | Rôle |
|---|---|---|---|
| GET | `/api/notes/:matricule` | Relevé de notes de l'étudiant | ADMIN / ETUDIANT |
| POST | `/api/notes` | Saisir une note | ADMIN / ENSEIGNANT |
| GET | `/api/absences/:matricule` | Absences de l'étudiant | ADMIN / ETUDIANT |
| GET | `/api/absences/a-risque` | Étudiants dépassant 10h d'absence | ADMIN |

### 💰 Paiements
| Méthode | Endpoint | Description | Rôle |
|---|---|---|---|
| GET | `/api/paiements/synthese` | Chiffres globaux finances | ADMIN |
| GET | `/api/paiements/en-dette` | Étudiants avec reste à payer | ADMIN |
| GET | `/api/paiements/:matricule` | Situation financière étudiant | ADMIN / ETUDIANT |

---

## 5. Bonnes Pratiques Frontend

- **Gestion des erreurs (401/403)** : Configurez un intercepteur (ex: Axios Interceptor) pour détecter les retours `401 Unauthorized` ou si le token a expiré, et redirigez automatiquement l'utilisateur vers la page de `/login`.
- **Validation** : Reproduisez les validations de formulaires côté client avant l'envoi pour soulager l'API, notamment la vérification de format des emails et l'exhaustivité des champs obligatoires.
- **Enums et Statuts** : Utilisez les mêmes valeurs que l'API pour les statuts (`Actif`, `Suspendu`, `Diplome`). L'API est sensible à la casse sur certaines validations, privilégiez le format textuel retourné par le backend.
