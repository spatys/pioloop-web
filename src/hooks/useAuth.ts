"use client";

import { useState, useEffect, useCallback } from "react";
import useSWR from "swr";
import { container } from "@/core/di/container";
import { TYPES } from "@/core/di/types";
import { IAuthService } from "@/core/services/interfaces/IAuthService";
import { ApiResponse } from "@/core/types";
import { LoginForm, RegisterForm, CompleteRegister } from "@/core/types/Forms";
import { User } from "@/core/types/User";
import { LoginSuccessResponseDto } from "@/core/types/Auth";

interface UseAuthReturn {
  // States
  user: User | null;
  isLoading: boolean;
  error: string | null;
  fieldErrors: Record<string, string> | null;
  globalErrors: string[] | null;
  success: string | null;

  // Methods
  login: (
    credentials: LoginForm,
  ) => Promise<ApiResponse<LoginSuccessResponseDto>>;
  registerEmail: (
    email: string,
  ) => Promise<ApiResponse<{ message: string; email: string }>>;
  registerVerifyEmailCode: (
    email: string,
    code: string,
  ) => Promise<ApiResponse<boolean>>;
  registerComplete: (data: CompleteRegister) => Promise<ApiResponse<any>>;
  resendRegisterEmailVerification: (
    email: string,
  ) => Promise<ApiResponse<{ message: string; email: string }>>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<ApiResponse<any>>;
  initializeUser: () => Promise<void>;

  // Utilities
  clearError: () => void;
  clearSuccess: () => void;
  clearFieldErrors: () => void;
  clearGlobalErrors: () => void;
  clearAllErrors: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string> | null>(
    null,
  );
  const [globalErrors, setGlobalErrors] = useState<string[] | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const authService = container.get<IAuthService>(TYPES.IAuthService);

  // Utiliser SWR pour gérer l'état de l'utilisateur
  const { data: userData, mutate: mutateUser, isLoading: swrIsLoading } = useSWR(
    "/api/auth/me",
    async (url) => {
      const response = await fetch(url, { credentials: "include" });
      if (!response.ok) {
        // Ne pas lancer d'erreur, juste retourner null
        return null;
      }
      return response.json();
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      revalidateIfStale: true,
      dedupingInterval: 60000,
      errorRetryCount: 1,
      shouldRetryOnError: true,
      revalidateOnMount: true, // Permettre la revalidation au montage
    },
  );

  // Extraire l'utilisateur de la structure de réponse de l'API
  const user = userData?.user?.profile || userData?.user || null;

  // Gérer l'état de chargement initial
  useEffect(() => {
    if (!swrIsLoading) {
      setIsInitialLoading(false);
    }
  }, [swrIsLoading]);

  // Revalider les données utilisateur quand nécessaire
  const refreshUser = useCallback(async () => {
    await mutateUser();
  }, [mutateUser]);

  const executeWithLoading = async <T>(
    operation: () => Promise<ApiResponse<T>>,
  ): Promise<ApiResponse<T>> => {
    setIsLoading(true);
    setError(null);
    setFieldErrors(null);
    setSuccess(null);

    try {
      const result = await operation();

      if (result.success) {
        setSuccess(result.message || "Opération réussie");
      } else {
        // Ne pas définir d'erreur générale, seulement les erreurs par champ
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
      }

      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Une erreur inattendue est survenue";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginForm) => {
    setIsLoading(true);
    setError(null);
    setFieldErrors(null);
    setGlobalErrors(null);
    setSuccess(null);

    try {
      const result = await authService.login(credentials);

      // Vérifier que result n'est pas null
      if (!result) {
        throw new Error("Réponse invalide du serveur");
      }

      if (result.success && result.data) {
        setSuccess(result.message || "Connexion réussie");
        // Forcer la revalidation immédiatement après la connexion
        await mutateUser(undefined, { revalidate: true });
      } else {
        // Gestion des erreurs
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
        if (result.globalErrors) {
          setGlobalErrors(result.globalErrors);
        }
        if (result.message) {
          setError(result.message);
        }
      }

      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Une erreur inattendue est survenue";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // const register = async (userData: RegisterForm) => {
  //   return await executeWithLoading(
  //     () => authService.register(userData)
  //   );
  // };

  const registerEmail = async (email: string) => {
    return await executeWithLoading(() => authService.registerEmail(email));
  };

  const registerVerifyEmailCode = async (email: string, code: string) => {
    return await executeWithLoading(() =>
      authService.registerVerifyEmail(email, code),
    );
  };

  const registerComplete = async (data: CompleteRegister) => {
    const result = await executeWithLoading(() =>
      authService.registerComplete(data),
    );
    if (result.success) {
      // Forcer la revalidation immédiatement après l'inscription
      await mutateUser(undefined, { revalidate: true });
    }
    return result;
  };

  const resendRegisterEmailVerification = async (email: string) => {
    return await executeWithLoading(() =>
      authService.resendRegisterVerifyEmail(email),
    );
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.logout();
      await mutateUser(null, false);
      setSuccess("Déconnexion réussie");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors de la déconnexion";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentUser = async () => {
    const result = await executeWithLoading(() => authService.getCurrentUser());
    if (result.success && result.data) {
      await mutateUser(result.data);
    }
    return result;
  };

  // Méthode pour initialiser l'utilisateur quand nécessaire (ex: après login)
  const initializeUser = useCallback(async () => {
    await mutateUser();
  }, [mutateUser]);

  const clearError = () => setError(null);
  const clearSuccess = () => setSuccess(null);
  const clearFieldErrors = () => setFieldErrors(null);
  const clearGlobalErrors = () => setGlobalErrors(null);
  const clearAllErrors = () => {
    setError(null);
    setFieldErrors(null);
    setGlobalErrors(null);
  };

  return {
    user,
    isLoading: isLoading || isInitialLoading,
    error,
    fieldErrors,
    globalErrors,
    success,
    login,
    registerEmail,
    registerVerifyEmailCode,
    registerComplete,
    resendRegisterEmailVerification,
    logout,
    getCurrentUser,
    initializeUser,
    clearError,
    clearSuccess,
    clearFieldErrors,
    clearGlobalErrors,
    clearAllErrors,
  };
};
