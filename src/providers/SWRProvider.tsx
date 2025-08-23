"use client";

import { SWRConfig } from "swr";
import { ReactNode } from "react";

interface SWRProviderProps {
  children: ReactNode;
}

export const SWRProvider = ({ children }: SWRProviderProps) => {
  return (
    <SWRConfig
      value={{
        // Configuration globale de SWR
        fetcher: async (url: string) => {
          const response = await fetch(url, {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            const error = new Error("Erreur de requête");
            error.message = response.statusText;
            throw error;
          }

          return response.json();
        },
        // Configuration par défaut
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        revalidateIfStale: false,
        dedupingInterval: 60000,
        errorRetryCount: 0,
        shouldRetryOnError: false,
        // Gestion des erreurs globales (plus silencieuse)
        onError: (error) => {
          // Ne pas logger les erreurs d'authentification
          if (
            !error.message?.includes("Non authentifié") &&
            !error.message?.includes("Erreur d'authentification")
          ) {
            console.error("Erreur SWR:", error);
          }
        },
      }}
    >
      {children}
    </SWRConfig>
  );
};
