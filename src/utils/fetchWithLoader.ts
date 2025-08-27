import React from "react";
import { useLoader } from "@/context/LoaderContext";

// Stockage global pour le loader (pour les cas où le hook n'est pas disponible)
let globalShowLoader: ((message?: string) => void) | null = null;
let globalHideLoader: (() => void) | null = null;

// Fonction pour initialiser le loader global
export const initializeGlobalLoader = (
  showLoader: (message?: string) => void,
  hideLoader: () => void
) => {
  globalShowLoader = showLoader;
  globalHideLoader = hideLoader;
};

// Hook pour utiliser le loader dans les composants
export const useFetchWithLoader = () => {
  const { showLoader, hideLoader } = useLoader();
  
  // Initialiser le loader global
  React.useEffect(() => {
    initializeGlobalLoader(showLoader, hideLoader);
  }, [showLoader, hideLoader]);

  const fetchWithLoader = async (
    url: string,
    options: RequestInit = {},
    loaderMessage?: string
  ): Promise<Response> => {
    const showLoaderFn = globalShowLoader || showLoader;
    const hideLoaderFn = globalHideLoader || hideLoader;

    try {
      showLoaderFn(loaderMessage);
      const response = await fetch(url, options);
      return response;
    } finally {
      hideLoaderFn();
    }
  };

  return { fetchWithLoader };
};

// Fonction fetch globale qui utilise le loader automatiquement
export const fetchWithLoader = async (
  url: string,
  options: RequestInit = {},
  loaderMessage?: string
): Promise<Response> => {
  if (!globalShowLoader || !globalHideLoader) {
    // Si le loader global n'est pas initialisé, utiliser fetch normal
    console.warn("Loader global non initialisé, utilisation de fetch standard");
    return fetch(url, options);
  }

  try {
    globalShowLoader(loaderMessage);
    const response = await fetch(url, options);
    return response;
  } finally {
    globalHideLoader();
  }
};

// Intercepteur pour remplacer fetch globalement
export const setupFetchInterceptor = () => {
  const originalFetch = window.fetch;
  
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    // Ignorer les requêtes SWR et certaines requêtes internes
    const url = typeof input === 'string' ? input : input.toString();
    
    // Ne pas afficher le loader pour certaines requêtes
    const skipLoaderUrls = [
      '/api/auth/me', // Requête de vérification d'authentification
      '/_next/', // Requêtes Next.js internes
      '/api/roles', // Requête qui cause l'erreur 404
    ];
    
    const shouldSkipLoader = skipLoaderUrls.some(skipUrl => url.includes(skipUrl));
    
    if (shouldSkipLoader || !globalShowLoader || !globalHideLoader) {
      return originalFetch(input, init);
    }

    try {
      globalShowLoader();
      const response = await originalFetch(input, init);
      return response;
    } finally {
      globalHideLoader();
    }
  };
};
