# API Properties Endpoints

Ce dossier contient tous les endpoints Next.js pour les propriétés qui correspondent aux endpoints du backend microservice.

## Endpoints disponibles

### 1. **GET** `/api/properties/search`
Recherche de propriétés avec filtres et pagination
- **Paramètres de requête :**
  - `location` (optionnel) : Localisation de recherche
  - `checkIn` (optionnel) : Date d'arrivée
  - `checkOut` (optionnel) : Date de départ
  - `guests` (optionnel) : Nombre de voyageurs
  - `page` (optionnel) : Numéro de page (défaut: 1)
  - `pageSize` (optionnel) : Taille de page (défaut: 10)

### 2. **POST** `/api/properties/create`
Création d'une nouvelle propriété
- **Corps de la requête :** `CreatePropertyRequest`
- **Authentification :** Requise (cookie `auth_token`)

### 3. **GET** `/api/properties/[id]`
Récupération d'une propriété par ID
- **Paramètres :** `id` : ID de la propriété

### 4. **GET** `/api/properties/owner/[ownerId]`
Récupération des propriétés d'un propriétaire
- **Paramètres :** `ownerId` : ID du propriétaire
- **Authentification :** Requise (cookie `auth_token`)

### 5. **GET** `/api/properties/my-properties`
Récupération des propriétés de l'utilisateur connecté
- **Authentification :** Requise (cookie `auth_token`)

### 6. **PUT** `/api/properties/update/[id]`
Mise à jour d'une propriété
- **Paramètres :** `id` : ID de la propriété
- **Corps de la requête :** `UpdatePropertyRequest`
- **Authentification :** Requise (cookie `auth_token`)

### 7. **DELETE** `/api/properties/delete/[id]`
Suppression d'une propriété
- **Paramètres :** `id` : ID de la propriété
- **Authentification :** Requise (cookie `auth_token`)

### 8. **GET** `/api/properties/latest`
Récupération des propriétés les plus récentes
- **Paramètres de requête :**
  - `limit` (optionnel) : Nombre de propriétés à récupérer (défaut: 10)

## Correspondance avec le backend

Tous ces endpoints correspondent exactement aux endpoints du microservice Property :
- `/api/property/search` → `/api/properties/search`
- `/api/property/create` → `/api/properties/create`
- `/api/property/{id}` → `/api/properties/[id]`
- `/api/property/owner/{ownerId}` → `/api/properties/owner/[ownerId]`
- `/api/property/update/{id}` → `/api/properties/update/[id]`
- `/api/property/delete/{id}` → `/api/properties/delete/[id]`

## Authentification

Les endpoints qui nécessitent une authentification vérifient la présence du cookie `auth_token` et décodent le JWT pour récupérer l'ID de l'utilisateur.

## Gestion des erreurs

Tous les endpoints gèrent les erreurs de manière cohérente :
- **401** : Non authentifié
- **404** : Ressource non trouvée
- **500** : Erreur interne du serveur
