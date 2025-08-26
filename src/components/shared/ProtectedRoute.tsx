"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/modules/shared/components/LoadingSpinner";

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
  const { user, loading } = useAuth();

  useEffect(() => {
    // Attendre un peu plus longtemps pour permettre à SWR de faire sa requête
    const timer = setTimeout(() => {
      if (!loading && !user) {
        // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
        router.push(fallbackPath);
      }
    }, 1000); // Attendre 1 seconde

    return () => clearTimeout(timer);
  }, [user, loading, router, fallbackPath]);

  // Afficher un loader pendant la vérification de l'authentification
  if (loading && showLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">
            Vérification de l'authentification...
          </p>
        </div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté et que le chargement est terminé, ne rien afficher
  // (la redirection aura lieu dans le useEffect)
  if (!loading && !user) {
    return null;
  }

  // Si l'utilisateur est connecté, afficher le contenu protégé
  return <>{children}</>;
};
