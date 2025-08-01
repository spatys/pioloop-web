'use client';

import { useState, useEffect, useCallback } from 'react';
import { container } from '@/core/di/container';
import { TYPES } from '@/core/di/types';
import { IAuthService } from '@/core/services/interfaces/IAuthService';
import { ApiResponse } from '@/core/types';
import { LoginForm, RegisterForm, CompleteRegistration } from '@/core/types/Forms';

interface UseAuthReturn {
  // States
  user: any | null;
  isLoading: boolean;
  error: string | null;
  success: string | null;

  // Methods
  login: (credentials: LoginForm) => Promise<ApiResponse<{ email: string; user: any }>>;
  register: (userData: RegisterForm) => Promise<ApiResponse<any>>;
  registrationEmail: (email: string) => Promise<ApiResponse<{ message: string; email: string; expirationMinutes: number }>>;
  registrationVerifyEmailCode: (email: string, code: string) => Promise<ApiResponse<boolean>>;
  registrationComplete: (data: CompleteRegistration) => Promise<ApiResponse<any>>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<ApiResponse<any>>;

  // Utilities
  clearError: () => void;
  clearSuccess: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const authService = container.get<IAuthService>(TYPES.IAuthService);

  // Auto-fetch user data when cookies change
  const fetchUserData = useCallback(async () => {
    try {
      const result = await authService.getCurrentUser();
      if (result.success && result.data) {
        setUser(result.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    }
  }, [authService]);

  // Listen for storage events (when cookies change in other tabs)
  useEffect(() => {
    const handleStorageChange = () => {
      fetchUserData();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [fetchUserData]);

  const executeWithLoading = async <T>(
    operation: () => Promise<ApiResponse<T>>
  ): Promise<ApiResponse<T>> => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await operation();
      
      if (result.success) {
        setSuccess(result.message || 'Opération réussie');
      } else {
        setError(result.message || 'Une erreur est survenue');
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur inattendue est survenue';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginForm) => {
    const result = await executeWithLoading(
      () => authService.login(credentials)
    );
    if (result.success && result.data?.user) {
      setUser(result.data.user);
    }
    return result;
  };

  const register = async (userData: RegisterForm) => {
    return await executeWithLoading(
      () => authService.register(userData)
    );
  };

  const registrationEmail = async (email: string) => {
    return await executeWithLoading(
      () => authService.registrationEmail(email)
    );
  };

  const registrationVerifyEmailCode = async (email: string, code: string) => {
    return await executeWithLoading(
      () => authService.registrationVerifyEmailCode(email, code)
    );
  };

  const registrationComplete = async (data: CompleteRegistration) => {
    const result = await executeWithLoading(
      () => authService.registrationComplete(data)
    );
    if (result.success && result.data?.user) {
      setUser(result.data.user);
    }
    return result;
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.logout();
      setUser(null);
      setSuccess('Déconnexion réussie');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la déconnexion';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentUser = async () => {
    const result = await executeWithLoading(
      () => authService.getCurrentUser()
    );
    if (result.success && result.data) {
      setUser(result.data);
    }
    return result;
  };

  const clearError = () => setError(null);
  const clearSuccess = () => setSuccess(null);

  return {
    user,
    isLoading,
    error,
    success,
    login,
    register,
    registrationEmail,
    registrationVerifyEmailCode,
    registrationComplete,
    logout,
    getCurrentUser,
    clearError,
    clearSuccess,
  };
}; 