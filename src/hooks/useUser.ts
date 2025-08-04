import useSWR from 'swr';
import { User } from '@/core/types/User';

// Fonction fetcher pour SWR
const fetcher = async (url: string) => {
  console.log('🔍 useUser fetcher appelé pour:', url);
  
  const response = await fetch(url, {
    credentials: 'include', // Important pour envoyer les cookies
    headers: {
      'Content-Type': 'application/json',
    },
  });

  console.log('📡 Response status:', response.status);
  console.log('📡 Response ok:', response.ok);

  if (!response.ok) {
    console.log('❌ Response not ok, returning null');
    // Si la réponse n'est pas ok, on retourne null au lieu de lancer une erreur
    return null;
  }

  const data = await response.json();
  console.log('✅ Data reçue:', data);
  return data;
};

export const useUser = () => {
  const { data, error, mutate, isLoading } = useSWR<{ user: User }>(
    '/api/auth/me', // Endpoint pour récupérer les infos utilisateur
    fetcher,
    {
      revalidateOnFocus: false, // Ne pas revalider quand la fenêtre reprend le focus
      revalidateOnReconnect: false, // Ne pas revalider automatiquement
      revalidateIfStale: false, // Ne pas revalider si les données sont "stale"
      dedupingInterval: 60000, // Dédoublonner les requêtes pendant 1 minute
      errorRetryCount: 0, // Ne pas réessayer en cas d'erreur
      shouldRetryOnError: false, // Ne pas réessayer automatiquement
      // Ne pas faire de requête automatique au montage
      revalidateOnMount: false,
    }
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