import { useState } from 'react';
import { getAuthService } from '@/core/di/container';
import type { LoginForm, RegisterForm, ApiResponse, User } from '@/core/types';

interface UseAuthReturn {
  // States
  user: User | null;
  isLoading: boolean;
  error: string | null;
  success: string | null;
  
  // Methods
  login: (credentials: LoginForm) => Promise<ApiResponse<{ token: string; user: any }>>;
  register: (userData: RegisterForm) => Promise<ApiResponse<any>>;
  emailRegistration: (email: string) => Promise<ApiResponse<{ message: string; email: string }>>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<ApiResponse<any>>;
  
  // Utilities
  clearError: () => void;
  clearSuccess: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const authService = getAuthService();

  const clearError = () => setError(null);
  const clearSuccess = () => setSuccess(null);

  const executeWithLoading = async <T>(
    operation: () => Promise<ApiResponse<T>>
  ): Promise<ApiResponse<T>> => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await operation();
      
      if (result.success) {
        // Utilise le message de l'API si disponible, sinon un message par défaut
        if (result.data && typeof result.data === 'object' && 'message' in result.data) {
          setSuccess((result.data as any).message);
        } else {
          setSuccess('Opération réussie');
        }
      } else {
        setError(result.message || 'Une erreur est survenue');
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur inattendue est survenue';
      setError(errorMessage);
      return {
        success: false,
        data: null as T,
        message: errorMessage,
        errors: []
      };
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

  const emailRegistration = async (email: string) => {
    return await executeWithLoading(
      () => authService.emailRegistration(email)
    );
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

  return {
    // States
    user,
    isLoading,
    error,
    success,
    
    // Methods
    login,
    register,
    emailRegistration,
    logout,
    getCurrentUser,
    
    // Utilities
    clearError,
    clearSuccess,
  };
}; 