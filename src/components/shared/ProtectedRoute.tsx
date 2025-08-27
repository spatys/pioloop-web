"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { PageLoader } from "@/components/ui/PageLoader";

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

  // Afficher le PageLoader pendant la vérification de l'authentification
  if (isLoading && showLoading) {
    return (
      <PageLoader />
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
