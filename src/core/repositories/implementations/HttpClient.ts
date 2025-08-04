import { injectable } from 'inversify';
import { IHttpClient } from '../interfaces/IHttpClient';
import { ApiResponse } from '../../types';

@injectable()
export class HttpClient implements IHttpClient {
  private baseURL: string;

  constructor() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      this.baseURL = 'http://localhost:64604';
    } else {
      // Si l'URL contient /api, on l'enlève pour éviter le double /api/
      this.baseURL = apiUrl.replace('/api', '');
    }
  }

  private async apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Si l'endpoint commence par /api/, utiliser l'URL du frontend Next.js
    const url = endpoint.startsWith('/api/') 
      ? `http://localhost:3000${endpoint}`
      : `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...this.getAuthHeaders(),
      ...(options.headers as Record<string, string> || {}),
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        // Ne pas log les erreurs 401 normales pour /auth/me
        if (response.status !== 401 || !endpoint.includes('/auth/me')) {
          console.error(`HTTP ${response.status} error for ${endpoint}:`, data);
        }
        
        return {
          success: false,
          data: null as T,
          message: data.message || 'Request failed',
          errors: data.errors || [],
        };
      }

      return {
        success: true,
        data,
        message: 'Success',
      };
    } catch (error) {
      console.error('HTTP Request failed:', error);
      return {
        success: false,
        data: null as T,
        message: error instanceof Error ? error.message : 'Network error',
        errors: [],
      };
    }
  }

  private getAuthHeaders(): Record<string, string> {
    // Pour l'instant, on n'ajoute pas de headers d'authentification
    // car on utilise les cookies HttpOnly
    return {};
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.apiRequest<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.apiRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.apiRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.apiRequest<T>(endpoint, { method: 'DELETE' });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.apiRequest<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
} 