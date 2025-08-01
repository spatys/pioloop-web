import { injectable, inject } from 'inversify';
import { IAuthRepository } from '../interfaces/IAuthRepository';
import type { IHttpClient } from '../../services/interfaces/IHttpClient';
import { User, LoginForm, RegisterForm, ApiResponse } from '../../types';
import { TYPES } from '../../di/types';

@injectable()
export class AuthRepository implements IAuthRepository {
  constructor(
    @inject(TYPES.IHttpClient) private httpClient: IHttpClient
  ) {}

  async login(credentials: LoginForm): Promise<ApiResponse<{ token: string; user: User }>> {
    try {
      const response = await this.httpClient.post<{ token: string; user: User }>('/auth/login', credentials);
      if (response.success && response.data?.token) {
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
      return await this.httpClient.post<User>('/auth/register', userData);
    } catch (error) {
      throw new Error('Registration failed');
    }
  }

  async emailRegistration(email: string): Promise<ApiResponse<{ message: string; email: string }>> {
    try {
      return await this.httpClient.post<{ message: string; email: string }>('/auth/registration/registration-email', { email });
    } catch (error) {
      throw new Error('Email registration failed');
    }
  }

  async confirmEmail(email: string, code: string): Promise<ApiResponse<boolean>> {
    try {
      return await this.httpClient.post<boolean>('/auth/confirm-email', { email, code });
    } catch (error) {
      throw new Error('Email confirmation failed');
    }
  }

  async logout(): Promise<void> {
    try {
      await this.httpClient.post<void>('/auth/logout', {});
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
      return await this.httpClient.get<User>('/auth/me');
    } catch (error) {
      throw new Error('Failed to get current user');
    }
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    try {
      const response = await this.httpClient.post<{ token: string }>('/auth/refresh', {});
      if (response.success && response.data?.token) {
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
      return await this.httpClient.post<void>('/auth/forgot-password', { email });
    } catch (error) {
      throw new Error('Password reset request failed');
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<void>> {
    try {
      return await this.httpClient.post<void>('/auth/reset-password', { token, newPassword });
    } catch (error) {
      throw new Error('Password reset failed');
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<void>> {
    try {
      return await this.httpClient.put<void>('/auth/change-password', { currentPassword, newPassword });
    } catch (error) {
      throw new Error('Password change failed');
    }
  }

  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    try {
      return await this.httpClient.put<User>('/auth/profile', userData);
    } catch (error) {
      throw new Error('Profile update failed');
    }
  }

  async uploadProfileImage(file: File): Promise<ApiResponse<{ imageUrl: string }>> {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      // Note: Pour les uploads de fichiers, on peut étendre HttpClient ou créer une méthode spéciale
      const response = await fetch(`${typeof window !== 'undefined' && (window as any).env?.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/upload-profile-image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken') || ''}`,
        },
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
      return await this.httpClient.delete<void>('/auth/account', {
        body: JSON.stringify({ password })
      });
    } catch (error) {
      throw new Error('Account deletion failed');
    }
  }
} 