import React from "react";
import { useRoles, UserRole } from "@/hooks/useRoles";

interface RoleGuardProps {
  children: React.ReactNode;
  roles: UserRole[];
  fallback?: React.ReactNode;
  requireAll?: boolean; // true = tous les rôles, false = au moins un rôle
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  roles,
  fallback = null,
  requireAll = false,
}) => {
  const { hasAnyRole, hasAllRoles } = useRoles();

  const hasPermission = requireAll ? hasAllRoles(roles) : hasAnyRole(roles);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// Composants spécialisés pour des cas d'usage courants
export const OwnerOnly: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => (
  <RoleGuard roles={["Owner"]} fallback={fallback}>
    {children}
  </RoleGuard>
);

export const AdminOnly: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => (
  <RoleGuard roles={["Admin"]} fallback={fallback}>
    {children}
  </RoleGuard>
);

export const PropertyManager: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => (
  <RoleGuard roles={["Owner", "Manager", "Admin"]} fallback={fallback}>
    {children}
  </RoleGuard>
);

export const TenantOnly: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => (
  <RoleGuard roles={["Tenant"]} fallback={fallback}>
    {children}
  </RoleGuard>
);
