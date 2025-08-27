"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";


interface ProtectedRouteProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallbackPath = "/login"
}) => {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Attendre que le chargement soit terminé avant de rediriger
    if (!isLoading && !user) {
      // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
      router.push(fallbackPath);
    }
  }, [user, isLoading, router, fallbackPath]);

  // Si l'utilisateur n'est pas connecté et que le chargement est terminé, ne rien afficher
  // (la redirection aura lieu dans le useEffect)
  if (!isLoading && !user) {
    return null;
  }

  // Si l'utilisateur est connecté, afficher le contenu protégé
  return <>{children}</>;
};
