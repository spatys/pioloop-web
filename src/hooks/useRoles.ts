import { useAuth } from "./useAuth";
import useSWR from "swr";
import { translateRole, translateRoles } from "@/core/constants/roleTranslations";

// Types pour les rôles (dynamiques depuis l'API)
export type UserRole = string;

// Interface pour les rôles depuis l'API
interface Role {
  id: string;
  name: string;
  normalizedName: string;
}

interface RolesResponse {
  roles: Role[];
  count: number;
}

// Fonction fetcher pour SWR
const fetcher = async (url: string) => {
  const response = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data;
};

export const useRoles = () => {
  const { user } = useAuth();

  // Récupérer tous les rôles disponibles
  const { data: allRolesData, error: allRolesError } = useSWR<RolesResponse>(
    "/api/roles",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      dedupingInterval: 300000, // 5 minutes
      errorRetryCount: 0,
      shouldRetryOnError: false,
    },
  );

  // Rôles de l'utilisateur (depuis l'objet user)
  const userRoles = user?.data?.roles || [];

  // Vérifier si l'utilisateur a un rôle spécifique
  const hasRole = (role: UserRole): boolean => {
    return userRoles.includes(role);
  };

  // Vérifier si l'utilisateur a au moins un des rôles spécifiés
  const hasAnyRole = (roles: UserRole[]): boolean => {
    return roles.some((role) => userRoles.includes(role));
  };

  // Vérifier si l'utilisateur a tous les rôles spécifiés
  const hasAllRoles = (roles: UserRole[]): boolean => {
    return roles.every((role) => userRoles.includes(role));
  };

  // Rôles courants pour les vérifications (basés sur les noms de rôles standards)
  const isTenant = hasRole("Tenant");
  const isOwner = hasRole("Owner");
  const isManager = hasRole("Manager");
  const isAdmin = hasRole("Admin");

  // Vérifications spécifiques pour les fonctionnalités
  const canManageProperties = hasAnyRole(["Owner", "Manager", "Admin"]);
  const canViewAnalytics = hasAnyRole(["Owner", "Manager", "Admin"]);
  const canManageUsers = hasAnyRole(["Admin"]);

  return {
    // Données des rôles
    allRoles: allRolesData?.roles || [],
    userRoles,

    // États de chargement
    isLoadingAllRoles: !allRolesData && !allRolesError,

    // Erreurs
    allRolesError,

    // Fonctions de base
    hasRole,
    hasAnyRole,
    hasAllRoles,

    // Rôles individuels
    isTenant,
    isOwner,
    isManager,
    isAdmin,

    // Permissions spécifiques
    canManageProperties,
    canViewAnalytics,
    canManageUsers,

    // Traductions
    translateRole,
    translateRoles,
  };
};
