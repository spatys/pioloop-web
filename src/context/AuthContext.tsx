'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { User } from '../core/types';
import { authRepository } from '../core/repositories/implementations/AuthRepository';

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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      if (token) {
        const response = await authRepository.getCurrentUser();
        if (response.success) {
          setUser(response.data);
        } else {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
          }
        }
      }
    } catch (error) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authRepository.login({ email, password });
      if (response.success && response.data.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('authToken', response.data.token);
        }
        setUser(response.data.user);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await authRepository.register(userData);
      if (response.success) {
        // Registration successful, but user needs to confirm email
        // You might want to redirect to email confirmation page
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authRepository.logout();
    } catch (error) {
      // Even if logout fails, clear local state
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
      }
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

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