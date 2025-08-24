import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface UseProtectedActionOptions {
  fallbackPath?: string;
  onUnauthorized?: () => void;
  onAuthorized?: () => void;
}

export const useProtectedAction = (options: UseProtectedActionOptions = {}) => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { fallbackPath = "/login", onUnauthorized, onAuthorized } = options;

  const executeProtectedAction = (action: () => void) => {
    if (loading) {
      // Attendre que l'authentification soit vérifiée
      return;
    }

    if (user) {
      // Utilisateur connecté, exécuter l'action
      onAuthorized?.();
      action();
    } else {
      // Utilisateur non connecté, rediriger vers la connexion
      onUnauthorized?.();
      router.push(fallbackPath);
    }
  };

  const navigateToProtectedRoute = (route: string) => {
    executeProtectedAction(() => router.push(route));
  };

  return {
    executeProtectedAction,
    navigateToProtectedRoute,
    isAuthenticated: !!user,
    isLoading: loading,
    user,
  };
};
