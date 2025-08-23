# Implémentation SWR pour l'authentification

## Vue d'ensemble

Cette implémentation utilise SWR (Stale-While-Revalidate) pour gérer l'état d'authentification de manière efficace et performante.

## Architecture

### 1. **Hook useUser avec SWR**

```typescript
// src/hooks/useUser.ts
export const useUser = () => {
  const { data, error, mutate, isLoading } = useSWR<{ user: User }>(
    "/api/auth/me",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000,
    },
  );

  return {
    user: data?.user || null,
    isLoading,
    isError: error,
    isAuthenticated: !!data?.user,
    mutate,
  };
};
```

### 2. **Endpoint API Next.js**

```typescript
// src/app/api/auth/me/route.ts
export async function GET(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Token manquant" }, { status: 401 });
  }

  // Appel vers votre API C#
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!response.ok) {
    // Supprimer le cookie si invalide
    const errorResponse = NextResponse.json(
      { error: "Token invalide" },
      { status: 401 },
    );
    errorResponse.cookies.delete("auth_token");
    return errorResponse;
  }

  const userData = await response.json();
  return NextResponse.json({ user: userData, isAuthenticated: true });
}
```

### 3. **Provider SWR global**

```typescript
// src/providers/SWRProvider.tsx
export const SWRProvider = ({ children }) => {
  return (
    <SWRConfig
      value={{
        fetcher: async (url) => {
          const response = await fetch(url, { credentials: 'include' });
          if (!response.ok) throw new Error('Erreur de requête');
          return response.json();
        },
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        dedupingInterval: 60000,
      }}
    >
      {children}
    </SWRConfig>
  );
};
```

## Utilisation

### Dans un composant

```typescript
import { useUser } from '@/hooks/useUser';

const MyComponent = () => {
  const { user, isLoading, isAuthenticated } = useUser();

  if (isLoading) return <div>Chargement...</div>;

  if (!isAuthenticated) return <div>Non connecté</div>;

  return <div>Bonjour {user.profile.firstName} !</div>;
};
```

### Dans le Header

```typescript
const Header = () => {
  const { user, isLoading, isAuthenticated } = useUser();
  const { logout } = useAuth();

  return (
    <header>
      {isAuthenticated ? (
        <UserMenu user={user} onLogout={logout} />
      ) : (
        <AuthButtons />
      )}
    </header>
  );
};
```

## Avantages

✅ **Performance** : Cache intelligent avec SWR
✅ **Sécurité** : Cookies HttpOnly gérés côté serveur
✅ **UX** : État de chargement et gestion d'erreurs
✅ **Réactivité** : Revalidation automatique
✅ **Déduplication** : Évite les requêtes multiples

## Configuration

### Variables d'environnement

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Backend C# requis

Votre API C# doit avoir un endpoint `/api/auth/me` qui :

- Accepte un token JWT dans le header Authorization
- Retourne les informations utilisateur
- Gère les tokens expirés/invalides

## Gestion des erreurs

- **401** : Token manquant ou invalide → Redirection login
- **500** : Erreur serveur → Retry automatique avec SWR
- **Network** : Revalidation à la reconnexion

## Revalidation manuelle

```typescript
const { mutate } = useUser();

// Après login/logout
await mutate();

// Ou avec de nouvelles données
await mutate({ user: newUserData });
```

Cette implémentation offre une expérience utilisateur fluide tout en maintenant un niveau de sécurité élevé ! 🚀
