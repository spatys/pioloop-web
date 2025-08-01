import { ApiResponse } from '../../types';

export interface IHttpClient {
  get<T>(endpoint: string, config?: RequestInit): Promise<ApiResponse<T>>;
  post<T>(endpoint: string, data?: any, config?: RequestInit): Promise<ApiResponse<T>>;
  put<T>(endpoint: string, data?: any, config?: RequestInit): Promise<ApiResponse<T>>;
  delete<T>(endpoint: string, config?: RequestInit): Promise<ApiResponse<T>>;
  patch<T>(endpoint: string, data?: any, config?: RequestInit): Promise<ApiResponse<T>>;
} 