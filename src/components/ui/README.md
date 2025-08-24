# Composants de Protection d'Authentification

Ce dossier contient plusieurs composants pour gérer l'authentification et la protection des routes de manière propre et professionnelle.

## Composants Disponibles

### 1. ProtectedBoutonLink
Composant de base qui redirige vers la page de connexion si l'utilisateur n'est pas connecté.

```tsx
import { ProtectedBoutonLink } from "@/components/ui/ProtectedBoutonLink";

<ProtectedBoutonLink
  href="/property/add"
  variant="default"
  size="md"
  fallbackPath="/login"
>
  Je propose mon bien
</ProtectedBoutonLink>
```

### 2. SmartProtectedButton
Composant avancé qui peut afficher une notification ou rediriger selon le contexte.

```tsx
import { SmartProtectedButton } from "@/components/ui/SmartProtectedButton";

<SmartProtectedButton
  href="/property/add"
  variant="default"
  size="md"
  showNotification={true}
  notificationMessage="Connectez-vous pour proposer votre bien"
  onUnauthorized={() => console.log("Utilisateur non connecté")}
  onAuthorized={() => console.log("Utilisateur connecté")}
>
  Je propose mon bien
</SmartProtectedButton>
```

### 3. ProtectedRoute
Composant pour protéger des pages entières nécessitant une authentification.

```tsx
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";

export default function AddPropertyPage() {
  return (
    <ProtectedRoute fallbackPath="/login">
      <AddProperty />
    </ProtectedRoute>
  );
}
```

### 4. AuthNotification
Composant de notification pour informer l'utilisateur qu'il doit se connecter.

```tsx
import { AuthNotification } from "@/components/ui/AuthNotification";

<AuthNotification
  message="Vous devez être connecté pour accéder à cette fonctionnalité"
  showLoginButton={true}
  onClose={() => setShowNotification(false)}
/>
```

## Hooks Disponibles

### useProtectedAction
Hook personnalisé pour gérer les actions protégées de manière flexible.

```tsx
import { useProtectedAction } from "@/hooks/useProtectedAction";

const { executeProtectedAction, navigateToProtectedRoute } = useProtectedAction({
  fallbackPath: "/login",
  onUnauthorized: () => console.log("Non autorisé"),
  onAuthorized: () => console.log("Autorisé")
});

// Exécuter une action protégée
executeProtectedAction(() => {
  // Action à exécuter si connecté
});

// Naviguer vers une route protégée
navigateToProtectedRoute("/property/add");
```

## Cas d'Usage Recommandés

### Boutons d'Action
- **ProtectedBoutonLink** : Pour les boutons simples qui doivent rediriger vers la connexion
- **SmartProtectedButton** : Pour les boutons qui peuvent afficher une notification contextuelle

### Pages Protégées
- **ProtectedRoute** : Pour envelopper des pages entières nécessitant une authentification

### Actions Complexes
- **useProtectedAction** : Pour des logiques d'authentification personnalisées

## Avantages de cette Approche

1. **Cohérence** : Tous les composants utilisent le même système d'authentification
2. **Flexibilité** : Différentes options selon le contexte d'utilisation
3. **UX Améliorée** : Notifications contextuelles au lieu de redirections brutales
4. **Maintenance** : Logique centralisée dans le contexte d'authentification
5. **Performance** : Pas de re-renders inutiles grâce à la gestion d'état optimisée
