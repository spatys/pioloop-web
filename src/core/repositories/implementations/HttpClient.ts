import { injectable } from 'inversify';
import { IHttpClient } from '../interfaces/IHttpClient';
import { ApiResponse } from '../../types';

@injectable()
export class HttpClient implements IHttpClient {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:64604';
  }

  private async apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Endpoints qui nécessitent des cookies → API routes Next.js
    const cookieEndpoints = [
      '/api/auth/login', 
      '/api/auth/logout', 
      '/api/auth/me', 
      '/api/auth/registration-complete'
    ];

    // Endpoints qui vont directement au backend C# (pas de cookies nécessaires)
    const directBackendEndpoints = [
      '/api/auth/register/register-email',
      '/api/auth/register/verify-email'
    ];

    // Déterminer l'URL cible
    let url: string;
    if (cookieEndpoints.includes(endpoint)) {
      // Endpoints de cookies → API routes Next.js
      url = `http://localhost:3000${endpoint}`;
    } else if (directBackendEndpoints.includes(endpoint)) {
      // Endpoints directs → Backend C# (mais avec /api/ dans l'URL)
      url = `${this.baseURL}${endpoint}`;
    } else if (endpoint.startsWith('/api/')) {
      // Autres endpoints /api/ → API routes Next.js (par défaut)
      url = `http://localhost:3000${endpoint}`;
    } else {
      // Endpoints sans /api/ → Backend C# direct
      url = `${this.baseURL}${endpoint}`;
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...this.getAuthHeaders(),
      ...(options.headers as Record<string, string> || {}),
    };

    console.log(`🌐 Making request to: ${url} (endpoint: ${endpoint})`);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });

      // Vérifier si la réponse a du contenu
      const responseText = await response.text();

      let data;
      try {
        data = responseText ? JSON.parse(responseText) : null;
      } catch (jsonError) {
        return {
          success: false,
          data: null as T,
          message: 'Invalid JSON response from server',
          errors: [],
        };
      }

      if (!response.ok) {
        // Ne pas log les erreurs 401 normales pour /auth/me
        if (response.status !== 401 || !endpoint.includes('/auth/me')) {
          console.error(`HTTP ${response.status} error for ${endpoint}:`, data);
        }
        
        return {
          success: false,
          data: null as T,
          message: data?.message || 'Request failed',
          errors: data?.errors || [],
        };
      }

      return {
        success: true,
        data,
        message: 'Success',
      };
    } catch (error) {
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