import useSWR from "swr";
import { User } from "@/core/types/User";

// Fonction fetcher pour SWR
const fetcher = async (url: string) => {
  const response = await fetch(url, {
    credentials: "include", // Important pour envoyer les cookies
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    // Si la réponse n'est pas ok, on retourne null au lieu de lancer une erreur
    return null;
  }

  const data = await response.json();
  return data;
};

export const useUser = () => {
  const { data, error, mutate, isLoading } = useSWR<{ user: User }>(
    "/api/auth/me", // Endpoint pour récupérer les infos utilisateur
    fetcher,
    {
      revalidateOnFocus: false, // Ne pas revalider quand la fenêtre reprend le focus
      revalidateOnReconnect: false, // Ne pas revalider automatiquement
      revalidateIfStale: false, // Ne pas revalider si les données sont "stale"
      dedupingInterval: 60000, // Dédoublonner les requêtes pendant 1 minute
      errorRetryCount: 0, // Ne pas réessayer en cas d'erreur
      shouldRetryOnError: false, // Ne pas réessayer automatiquement
      revalidateOnMount: true, // Faire une requête automatique au montage
    },
  );

  return {
    user: data?.user || null,
    isLoading,
    isError: error,
    error,
    mutate, // Fonction pour forcer la revalidation
    isAuthenticated: !!data?.user,
  };
};
