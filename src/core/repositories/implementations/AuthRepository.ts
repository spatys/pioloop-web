import { IAuthRepository } from '../interfaces/IAuthRepository';
import { User, LoginForm, RegisterForm, ApiResponse } from '../../types';

class AuthRepository implements IAuthRepository {
  private baseURL: string;
  private api: any;

  constructor() {
    this.baseURL = typeof window !== 'undefined' && (window as any).env?.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    this.setupApi();
  }

  private setupApi() {
    // This would be replaced with actual axios instance
    // For now, we'll use fetch with proper configuration
    this.api = {
      get: async (url: string, config?: any) => {
        const response = await fetch(`${this.baseURL}${url}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...config?.headers,
          },
          credentials: 'include',
        });
        return response.json();
      },
      post: async (url: string, data?: any, config?: any) => {
        const response = await fetch(`${this.baseURL}${url}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...config?.headers,
          },
          credentials: 'include',
          body: JSON.stringify(data),
        });
        return response.json();
      },
      put: async (url: string, data?: any, config?: any) => {
        const response = await fetch(`${this.baseURL}${url}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...config?.headers,
          },
          credentials: 'include',
          body: JSON.stringify(data),
        });
        return response.json();
      },
      delete: async (url: string, config?: any) => {
        const response = await fetch(`${this.baseURL}${url}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            ...config?.headers,
          },
          credentials: 'include',
        });
        return response.json();
      },
    };
  }

  private getAuthHeaders(): Record<string, string> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async login(credentials: LoginForm): Promise<ApiResponse<{ token: string; user: User }>> {
    try {
      const response = await this.api.post('/auth/login', credentials);
      if (response.success && response.data.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('authToken', response.data.token);
        }
      }
      return response;
    } catch (error) {
      throw new Error('Login failed');
    }
  }

  async register(userData: RegisterForm): Promise<ApiResponse<User>> {
    try {
      return await this.api.post('/auth/register', userData);
    } catch (error) {
      throw new Error('Registration failed');
    }
  }

  async confirmEmail(email: string, code: string): Promise<ApiResponse<boolean>> {
    try {
      return await this.api.post('/auth/confirm-email', { email, code });
    } catch (error) {
      throw new Error('Email confirmation failed');
    }
  }

  async logout(): Promise<void> {
    try {
      await this.api.post('/auth/logout');
    } catch (error) {
      // Even if logout fails, clear local token
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
      }
    }
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      return await this.api.get('/auth/me', { headers: this.getAuthHeaders() });
    } catch (error) {
      throw new Error('Failed to get current user');
    }
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    try {
      const response = await this.api.post('/auth/refresh', {}, { headers: this.getAuthHeaders() });
      if (response.success && response.data.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('authToken', response.data.token);
        }
      }
      return response;
    } catch (error) {
      throw new Error('Token refresh failed');
    }
  }

  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    try {
      return await this.api.post('/auth/forgot-password', { email });
    } catch (error) {
      throw new Error('Password reset request failed');
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<void>> {
    try {
      return await this.api.post('/auth/reset-password', { token, newPassword });
    } catch (error) {
      throw new Error('Password reset failed');
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<void>> {
    try {
      return await this.api.put('/auth/change-password', { currentPassword, newPassword }, { headers: this.getAuthHeaders() });
    } catch (error) {
      throw new Error('Password change failed');
    }
  }

  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    try {
      return await this.api.put('/auth/profile', userData, { headers: this.getAuthHeaders() });
    } catch (error) {
      throw new Error('Profile update failed');
    }
  }

  async uploadProfileImage(file: File): Promise<ApiResponse<{ imageUrl: string }>> {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch(`${this.baseURL}/auth/upload-profile-image`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        credentials: 'include',
        body: formData,
      });
      
      return response.json();
    } catch (error) {
      throw new Error('Profile image upload failed');
    }
  }

  async deleteAccount(password: string): Promise<ApiResponse<void>> {
    try {
      return await this.api.delete('/auth/account', { 
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ password })
      });
    } catch (error) {
      throw new Error('Account deletion failed');
    }
  }
}

export const authRepository = new AuthRepository(); 