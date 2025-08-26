// Traductions des rôles utilisateur
export const ROLE_TRANSLATIONS: Record<string, string> = {
  // Rôles principaux
  "Tenant": "Locataire",
  "Owner": "Propriétaire",
  "Manager": "Gestionnaire",
  "Admin": "Administrateur",
  
  // Rôles additionnels (si nécessaire)
  "User": "Utilisateur",
  "Guest": "Invité",
  "Moderator": "Modérateur",
};

// Fonction utilitaire pour traduire un rôle
export const translateRole = (role: string): string => {
  return ROLE_TRANSLATIONS[role] || role;
};

// Fonction utilitaire pour traduire un tableau de rôles
export const translateRoles = (roles: string[]): string[] => {
  return roles.map(role => translateRole(role));
};

// Rôles par défaut
export const DEFAULT_ROLE = "Tenant";
export const DEFAULT_ROLE_FR = translateRole(DEFAULT_ROLE);
