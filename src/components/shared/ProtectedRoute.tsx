"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";


interface ProtectedRouteProps {
  children: React.ReactNode;
  fallbackPath?: string;
  showLoading?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallbackPath = "/login",
  showLoading = true,
}) => {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Attendre un peu plus longtemps pour permettre à SWR de faire sa requête
    const timer = setTimeout(() => {
      if (!isLoading && !user) {
        // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
        router.push(fallbackPath);
      }
    }, 1000); // Attendre 1 seconde

    return () => clearTimeout(timer);
  }, [user, isLoading, router, fallbackPath]);

  // Afficher un loader simple pendant la vérification de l'authentification
  if (isLoading && showLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté et que le chargement est terminé, ne rien afficher
  // (la redirection aura lieu dans le useEffect)
  if (!isLoading && !user) {
    return null;
  }

  // Si l'utilisateur est connecté, afficher le contenu protégé
  return <>{children}</>;
};
