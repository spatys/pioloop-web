'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth as useAuthHook } from '../hooks/useAuth';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  registerEmail: string | null;
  setRegisterEmail: (email: string | null) => void;
  login: (credentials: any) => Promise<any>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<any>;
  clearError: () => void;
  clearSuccess: () => void;
  error: string | null;
  success: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [registerEmail, setRegisterEmail] = useState<string | null>(null);
  
  // Utiliser le hook useAuth pour la logique d'authentification
  const authHook = useAuthHook();

  // Vérifier l'authentification au chargement de la page
  useEffect(() => {
    const checkAuthOnLoad = async () => {
      try {
        // Vérifier si on a un cookie JWT avant de faire l'appel API
        const hasJwtCookie = document.cookie.includes('auth_token=');
        
        if (hasJwtCookie && !authHook.user) {
          // Seulement faire l'appel si on a un cookie JWT et pas d'utilisateur
          await authHook.getCurrentUser();
        }
      } catch (error) {
        // User is not authenticated, that's fine
        console.log('No authenticated user found on page load');
      }
    };

    checkAuthOnLoad();
  }, []); // Exécuter seulement au montage

  const value = {
    user: authHook.user,
    loading: authHook.isLoading,
    registerEmail,
    setRegisterEmail,
    login: authHook.login,
    logout: authHook.logout,
    getCurrentUser: authHook.getCurrentUser,
    clearError: authHook.clearError,
    clearSuccess: authHook.clearSuccess,
    error: authHook.error,
    success: authHook.success,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 