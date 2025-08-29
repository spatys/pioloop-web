import React from "react";
import { useRoles, UserRole } from "@/hooks/useRoles";
import { UnauthorizedPage } from "./UnauthorizedPage";
import { PageLoader } from "../ui/PageLoader";

interface RoleGuardProps {
  children: React.ReactNode;
  roles: UserRole[];
  fallback?: React.ReactNode;
  requireAll?: boolean; // true = tous les rôles, false = au moins un rôle
  showUnauthorizedPage?: boolean; // Afficher la page d'upgrade au lieu du fallback
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  roles,
  fallback = null,
  requireAll = false,
  showUnauthorizedPage = true,
}) => {
  const { hasAnyRole, hasAllRoles, userRoles, isLoadingUserRoles } = useRoles();

  // Afficher un loader pendant le chargement des rôles utilisateur
  if (isLoadingUserRoles) {
    return (
      <PageLoader />
    )
  }

  const hasPermission = requireAll ? hasAllRoles(roles) : hasAnyRole(roles);

  if (!hasPermission) {
    if (showUnauthorizedPage) {
      // Déterminer le rôle requis principal
      const requiredRole = roles[0] || "User";
      const currentRole = userRoles.length > 0 ? userRoles[0] : "Tenant";
      
      return (
        <UnauthorizedPage
          requiredRole={requiredRole}
          currentRole={currentRole}
        />
      );
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// Composants spécialisés pour des cas d'usage courants
export const OwnerOnly: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUnauthorizedPage?: boolean;
}> = ({ children, fallback, showUnauthorizedPage = true }) => (
  <RoleGuard 
    roles={["Owner"]} 
    fallback={fallback}
    showUnauthorizedPage={showUnauthorizedPage}
  >
    {children}
  </RoleGuard>
);

export const AdminOnly: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUnauthorizedPage?: boolean;
}> = ({ children, fallback, showUnauthorizedPage = true }) => (
  <RoleGuard 
    roles={["Admin"]} 
    fallback={fallback}
    showUnauthorizedPage={showUnauthorizedPage}
  >
    {children}
  </RoleGuard>
);

export const PropertyManager: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUnauthorizedPage?: boolean;
}> = ({ children, fallback, showUnauthorizedPage = true }) => (
  <RoleGuard 
    roles={["Owner", "Manager", "Admin"]} 
    fallback={fallback}
    showUnauthorizedPage={showUnauthorizedPage}
  >
    {children}
  </RoleGuard>
);

export const TenantOnly: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUnauthorizedPage?: boolean;
}> = ({ children, fallback, showUnauthorizedPage = true }) => (
  <RoleGuard 
    roles={["Tenant"]} 
    fallback={fallback}
    showUnauthorizedPage={showUnauthorizedPage}
  >
    {children}
  </RoleGuard>
);
