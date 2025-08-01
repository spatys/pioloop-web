'use client';

import React, { createContext, useContext } from 'react';
import { User } from '../core/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Pour l'instant, on utilise un contexte simple
  // Le vrai AuthProvider sera implémenté avec le hook useAuth
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(false);

  const login = async (email: string, password: string) => {
    // TODO: Implémenter avec useAuth
    console.log('Login:', email, password);
  };

  const register = async (userData: any) => {
    // TODO: Implémenter avec useAuth
    console.log('Register:', userData);
  };

  const logout = async () => {
    // TODO: Implémenter avec useAuth
    setUser(null);
  };

  const checkAuth = async () => {
    // TODO: Implémenter avec useAuth
    console.log('Check auth');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    checkAuth,
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