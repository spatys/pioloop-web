import { injectable } from 'inversify';
import { IHttpClient } from '../interfaces/IHttpClient';
import { ApiResponse } from '../../types';

@injectable()
export class HttpClient implements IHttpClient {
  private baseURL: string;

  constructor() {
    this.baseURL = typeof window !== 'undefined' && (window as any).env?.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
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

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
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
      return {
        success: false,
        data: null as T,
        message: 'Network error',
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