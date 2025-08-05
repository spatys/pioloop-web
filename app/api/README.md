# 🔐 Architecture d'Authentification - API Routes

## Vue d'ensemble

Ce dossier contient les API routes Next.js qui servent de **proxy** entre le frontend React et le backend C# pour l'authentification. Cette architecture permet de gérer les cookies HttpOnly de manière sécurisée tout en maintenant une séparation claire des responsabilités.

## 📋 Structure des fichiers

```
src/app/api/
├── README.md                    # Ce fichier
├── auth/
│   ├── login/
│   │   └── route.ts            # POST /api/auth/login
│   ├── logout/
│   │   └── route.ts            # POST /api/auth/logout
│   └── me/
│       └── route.ts            # GET /api/auth/me
```

## 🏗️ Architecture Globale

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Next.js API    │    │   Backend C#    │
│   (React)       │    │   Routes         │    │   (ASP.NET)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │ 1. Login Form         │                       │
         │ ──────────────────────►│                       │
         │                       │ 2. POST /api/auth/login│
         │                       │ ──────────────────────►│
         │                       │                       │ 3. Validate credentials
         │                       │                       │ ──► Database
         │                       │                       │
         │                       │ 4. Return JWT token   │
         │                       │ ◄──────────────────────│
         │                       │                       │
         │ 5. Set HttpOnly cookie│                       │
         │ ◄─────────────────────│                       │
         │                       │                       │
         │ 6. SWR revalidation  │                       │
         │ ──────────────────────►│                       │
         │                       │ 7. GET /api/auth/me   │
         │                       │ ──────────────────────►│
         │                       │                       │ 8. Validate JWT
         │                       │                       │ ──► Database
         │                       │                       │
         │                       │ 9. Return user data   │
         │                       │ ◄──────────────────────│
         │                       │                       │
         │ 10. Update UI state   │                       │
         │ ◄─────────────────────│                       │
```

## 🔄 Flux Détaillés

### 1. Connexion (Login)

#### Étape 1: Soumission du formulaire
```typescript
// Login.tsx
const onSubmit = async (data: LoginFormData) => {
  await login(data); // AuthService → AuthRepository → Next.js API
};
```

#### Étape 2: Chaîne d'appels
```typescript
// AuthService → AuthRepository → HttpClient
login(credentials) 
  → AuthRepository.login() 
  → HttpClient.post('/api/auth/login') 
  → Next.js API Route
```

#### Étape 3: Next.js API Route (`/api/auth/login`)
```typescript
// Pioloop-web/src/app/api/auth/login/route.ts
export async function POST(request: NextRequest) {
  // 1. Récupérer les credentials du body
  const body = await request.json();
  
  // 2. Appeler l'API C# backend
  const response = await fetch(`http://localhost:64604/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  
  // 3. Extraire le token de la réponse
  const data = await response.json();
  const token = data.token;
  
  // 4. Créer la réponse Next.js avec cookie HttpOnly
  const nextResponse = NextResponse.json({ success: true, data });
  nextResponse.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 jours
    path: '/',
  });
  
  return nextResponse;
}
```

#### Étape 4: Backend C# (`/api/auth/login`)
```csharp
// Pioloop-api/Pioloop.WebApi/Controllers/AuthController.cs
[HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginRequest request)
{
    // 1. Valider les credentials
    var user = await _authService.ValidateCredentials(request.Email, request.Password);
    
    // 2. Générer le JWT token
    var token = _jwtService.GenerateToken(user);
    
    // 3. Retourner le token dans le body (pour Next.js)
    return Ok(new { 
        token = token,
        user = userDto 
    });
}
```

### 2. Gestion de Session avec SWR

#### Hook useUser
```typescript
// Pioloop-web/src/hooks/useUser.ts
export const useUser = () => {
  const { data, error, mutate, isLoading } = useSWR<{ user: User }>(
    '/api/auth/me', // Endpoint pour récupérer les infos utilisateur
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      dedupingInterval: 60000,
      errorRetryCount: 0,
      shouldRetryOnError: false,
      revalidateOnMount: false,
    }
  );

  return {
    user: data?.user || null,
    isLoading,
    isAuthenticated: !!data?.user,
    mutate, // Fonction pour forcer la revalidation
  };
};
```

#### Fonction Fetcher
```typescript
const fetcher = async (url: string) => {
  const response = await fetch(url, {
    credentials: 'include', // Important pour envoyer les cookies
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (!response.ok) {
    return null; // Retourne null au lieu de lancer une erreur
  }

  const data = await response.json();
  return data;
};
```

#### Next.js API Route (`/api/auth/me`)
```typescript
// Pioloop-web/src/app/api/auth/me/route.ts
export async function GET(request: NextRequest) {
  // 1. Récupérer le token depuis les cookies
  const token = request.cookies.get('auth_token')?.value;
  
  if (!token) {
    return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
  }

  // 2. Appeler l'API C# avec le token
  const response = await fetch(`http://localhost:64604/api/auth/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    // Supprimer le cookie si le token est invalide
    const errorResponse = NextResponse.json({ error: 'Token invalide' }, { status: 401 });
    errorResponse.cookies.delete('auth_token');
    return errorResponse;
  }

  // 3. Retourner les données utilisateur
  const userData = await response.json();
  return NextResponse.json({
    user: { profile: userData }, // Wrapper pour correspondre au type User
    isAuthenticated: true,
  });
}
```

#### Backend C# (`/api/auth/me`)
```csharp
// Pioloop-api/Pioloop.WebApi/Controllers/AuthController.cs
[HttpGet("me")]
public async Task<IActionResult> GetCurrentUser()
{
    // 1. Extraire le token du header Authorization
    var authHeader = Request.Headers["Authorization"].FirstOrDefault();
    string? token = null;
    
    if (authHeader != null && authHeader.StartsWith("Bearer "))
    {
        token = authHeader.Substring("Bearer ".Length).Trim();
    }
    
    // 2. Fallback vers les cookies si pas de header
    if (string.IsNullOrEmpty(token))
    {
        token = Request.Cookies["auth_token"];
    }
    
    // 3. Valider le token et récupérer l'utilisateur
    var user = await GetUserFromToken(token);
    
    // 4. Retourner les données utilisateur
    return Ok(userProfile);
}
```

### 3. Déconnexion

#### Flux de déconnexion
```typescript
// Header.tsx
const handleLogout = async () => {
  try {
    await logout(); // Appelle AuthService → AuthRepository → Next.js API
    await mutate(); // Revalide les données utilisateur
    setIsUserMenuOpen(false);
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
  }
};
```

#### Next.js API Route (`/api/auth/logout`)
```typescript
// Pioloop-web/src/app/api/auth/logout/route.ts
export async function POST(request: NextRequest) {
  try {
    // 1. Appeler l'API C# pour la déconnexion (optionnel)
    try {
      await fetch(`http://localhost:64604/api/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      // On continue même si l'API C# échoue
    }
    
    // 2. Créer la réponse Next.js
    const nextResponse = NextResponse.json({
      success: true,
      message: 'Déconnexion réussie'
    });

    // 3. Supprimer le cookie d'authentification
    nextResponse.cookies.delete('auth_token');

    return nextResponse;
  } catch (error) {
    console.error('❌ Erreur lors de la déconnexion:', error);
    return NextResponse.json(
      { error: `Erreur interne du serveur` },
      { status: 500 }
    );
  }
}
```

## 🔒 Points Clés de Sécurité

### 1. Cookies HttpOnly
- ✅ **Non accessible via JavaScript** : Protection contre les attaques XSS
- ✅ **Secure en production** : Transmission uniquement via HTTPS
- ✅ **SameSite: 'lax'** : Protection contre les attaques CSRF

### 2. Validation côté serveur
- ✅ **Chaque requête validée** : Le backend C# valide le JWT
- ✅ **Gestion d'erreur** : Suppression automatique du cookie si invalide
- ✅ **Fallback sécurisé** : Vérification des cookies si header manquant

### 3. Gestion des erreurs
- ✅ **Logs d'erreur** : Traçabilité des problèmes
- ✅ **Réponses cohérentes** : Format d'erreur standardisé
- ✅ **Nettoyage automatique** : Suppression des cookies invalides

## ⚡ Points Clés de Performance

### 1. SWR (Stale-While-Revalidate)
- ✅ **Cache intelligent** : Évite les requêtes inutiles
- ✅ **Dédoublonnage** : Une seule requête simultanée par endpoint
- ✅ **Revalidation contrôlée** : Pas de revalidation automatique inutile

### 2. Configuration optimisée
```typescript
{
  revalidateOnFocus: false,      // Pas de revalidation au focus
  revalidateOnReconnect: false,  // Pas de revalidation à la reconnexion
  revalidateIfStale: false,      // Pas de revalidation si stale
  dedupingInterval: 60000,       // Dédoublonnage 1 minute
  errorRetryCount: 0,            // Pas de retry automatique
  shouldRetryOnError: false,     // Pas de retry sur erreur
  revalidateOnMount: false,      // Pas de requête automatique au montage
}
```

## 🎯 Avantages de cette Architecture

### 1. Sécurité
- **Cookies HttpOnly** : Protection contre XSS
- **Validation serveur** : Chaque requête validée
- **Gestion d'erreur** : Nettoyage automatique

### 2. Performance
- **SWR** : Cache intelligent et revalidation optimisée
- **Proxy Next.js** : Réduction de la latence
- **Dédoublonnage** : Évite les requêtes multiples

### 3. UX
- **État de chargement** : Feedback visuel
- **Persistance** : Session maintenue après rechargement
- **Déconnexion propre** : Nettoyage complet

### 4. Maintenabilité
- **Séparation des responsabilités** : Frontend, Next.js API, Backend C#
- **Type Safety** : TypeScript pour la sécurité des types
- **Documentation** : Code auto-documenté

## 🚀 Utilisation

### Frontend (React)
```typescript
import { useUser } from '@/hooks/useUser';
import { useAuth } from '@/hooks/useAuth';

const MyComponent = () => {
  const { user, isLoading, isAuthenticated } = useUser();
  const { login, logout } = useAuth();
  
  // Utilisation automatique des API routes
};
```

### Backend (C#)
```csharp
// Les endpoints C# restent inchangés
[HttpPost("login")]
[HttpGet("me")]
[HttpPost("logout")]
```

Cette architecture combine le meilleur des deux mondes : la simplicité de SWR pour la gestion d'état côté client et la robustesse d'un backend C# pour l'authentification ! 🎉 