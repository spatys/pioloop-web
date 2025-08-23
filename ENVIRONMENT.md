# Configuration de l'environnement

## Variables d'environnement

### NEXT_PUBLIC_API_URL

URL de l'API backend C#.

**Valeurs par défaut :**

- Développement : `http://localhost:64604`
- Production : À configurer selon votre déploiement

**Exemple :**

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:64604
```

## Configuration

### 1. Copier le fichier d'exemple

```bash
cp env.local.example .env.local
```

### 2. Modifier les valeurs selon votre environnement

```bash
# Développement local
NEXT_PUBLIC_API_URL=http://localhost:64604

# Production
NEXT_PUBLIC_API_URL=https://api.votre-domaine.com
```

### 3. Redémarrer le serveur de développement

```bash
npm run dev
# ou
yarn dev
```

## Fichiers concernés

Les fichiers qui utilisent cette configuration :

- `src/core/repositories/implementations/HttpClient.ts`
- `src/app/api/roles/route.ts`
- `src/app/api/auth/me/route.ts`
- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/logout/route.ts`

## Notes importantes

- Le fichier `.env.local` est ignoré par Git pour la sécurité
- Les variables commençant par `NEXT_PUBLIC_` sont accessibles côté client
- Redémarrez toujours le serveur après modification des variables d'environnement
