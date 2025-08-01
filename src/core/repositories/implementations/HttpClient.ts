import { injectable } from 'inversify';
import { IHttpClient } from '../interfaces/IHttpClient';
import { ApiResponse } from '../../types';

@injectable()
export class HttpClient implements IHttpClient {
  private baseURL: string;

  constructor() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      throw new Error('NEXT_PUBLIC_API_URL environment variable is not defined');
    }
    this.baseURL = apiUrl;
  }

  private async apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...this.getAuthHeaders(),
      ...(options.headers as Record<string, string> || {}),
    };

    console.log(`Making ${options.method || 'GET'} request to: ${url}`);

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
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async get<T>(endpoint: string, config?: RequestInit): Promise<ApiResponse<T>> {
    return await this.apiRequest<T>(endpoint, {
      method: 'GET',
      ...config,
    });
  }

  async post<T>(endpoint: string, data?: any, config?: RequestInit): Promise<ApiResponse<T>> {
    return await this.apiRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...config,
    });
  }

  async put<T>(endpoint: string, data?: any, config?: RequestInit): Promise<ApiResponse<T>> {
    return await this.apiRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...config,
    });
  }

  async delete<T>(endpoint: string, config?: RequestInit): Promise<ApiResponse<T>> {
    return await this.apiRequest<T>(endpoint, {
      method: 'DELETE',
      ...config,
    });
  }

  async patch<T>(endpoint: string, data?: any, config?: RequestInit): Promise<ApiResponse<T>> {
    return await this.apiRequest<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      ...config,
    });
  }
} 