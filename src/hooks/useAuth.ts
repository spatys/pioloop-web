'use client';

import { useState, useEffect, useCallback } from 'react';
import useSWR from 'swr';
import { container } from '@/core/di/container';
import { TYPES } from '@/core/di/types';
import { IAuthService } from '@/core/services/interfaces/IAuthService';
import { ApiResponse } from '@/core/types';
import { LoginForm, RegisterForm, CompleteRegistration } from '@/core/types/Forms';
import { User } from '@/core/types/User';
import { LoginNormalizedResponse } from '@/core/types/Auth';

interface UseAuthReturn {
  // States
  user: User | null;
  isLoading: boolean;
  error: string | null;
  fieldErrors: Record<string, string> | null;
  success: string | null;

  // Methods
  login: (credentials: LoginForm) => Promise<LoginNormalizedResponse>;
  register: (userData: RegisterForm) => Promise<ApiResponse<any>>;
  registrationEmail: (email: string) => Promise<ApiResponse<{ message: string; email: string; expirationMinutes: number }>>;
  registrationVerifyEmailCode: (email: string, code: string) => Promise<ApiResponse<boolean>>;
  registrationComplete: (data: CompleteRegistration) => Promise<ApiResponse<any>>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<ApiResponse<any>>;

  // Utilities
  clearError: () => void;
  clearSuccess: () => void;
  clearFieldErrors: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string> | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const authService = container.get<IAuthService>(TYPES.IAuthService);

  // Utiliser SWR pour gérer l'état de l'utilisateur
  const { data: userData, mutate: mutateUser } = useSWR(
    '/api/auth/me',
    async (url) => {
      const response = await fetch(url, { credentials: 'include' });
      if (!response.ok) {
        // Ne pas lancer d'erreur, juste retourner null
        return null;
      }
      return response.json();
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      dedupingInterval: 60000,
      errorRetryCount: 0, // Ne pas réessayer en cas d'erreur
      shouldRetryOnError: false, // Ne pas réessayer automatiquement
      revalidateOnMount: true, // Faire une requête automatique au montage
    }
  );

  const user = userData?.user || null;

  // Revalider les données utilisateur quand nécessaire
  const refreshUser = useCallback(async () => {
    await mutateUser();
  }, [mutateUser]);

  const executeWithLoading = async <T>(
    operation: () => Promise<ApiResponse<T>>
  ): Promise<ApiResponse<T>> => {
    setIsLoading(true);
    setError(null);
    setFieldErrors(null);
    setSuccess(null);

    try {
      const result = await operation();
      
      if (result.success) {
        setSuccess(result.message || 'Opération réussie');
      } else {
        // Ne pas définir d'erreur générale, seulement les erreurs par champ
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
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
    if (result.success) {
      // Forcer la revalidation immédiatement après la connexion
      await mutateUser(undefined, { revalidate: true });
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
    if (result.success) {
      // Forcer la revalidation immédiatement après l'inscription
      await mutateUser(undefined, { revalidate: true });
    }
    return result;
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.logout();
      await mutateUser(null, false);
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
      await mutateUser();
    }
    return result;
  };

  const clearError = () => setError(null);
  const clearSuccess = () => setSuccess(null);
  const clearFieldErrors = () => setFieldErrors(null);

  return {
    user,
    isLoading,
    error,
    fieldErrors,
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
    clearFieldErrors,
  };
}; 