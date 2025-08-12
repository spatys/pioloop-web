import { injectable, inject } from 'inversify';
import { IAuthRepository } from '../interfaces/IAuthRepository';
import type { IHttpClient } from '../interfaces/IHttpClient';
import { TYPES } from '../../di/types';
import { ApiResponse } from '../../types';
import { LoginForm, CompleteRegistration } from '../../types/Forms';
import { LoginSuccessResponseDto } from '../../types/Auth';

@injectable()
export class AuthRepository implements IAuthRepository {
  constructor(
    @inject(TYPES.IHttpClient) private httpClient: IHttpClient
  ) {}

  async login(credentials: LoginForm): Promise<ApiResponse<LoginSuccessResponseDto>> {
    // Utiliser l'endpoint Next.js qui définira le cookie
    const response = await this.httpClient.post<LoginSuccessResponseDto>('/api/auth/login', credentials);
    
    return response;
  }

  async registerEmail(email: string): Promise<ApiResponse<{ message: string; email: string; expirationMinutes: number }>> {
    const response = await this.httpClient.post<{ message: string; email: string; expirationMinutes: number }>('/api/auth/register/register-email', { email });
    
    // Transformer toute erreur en fieldErrors pour l'email
    if (!response.success && response.message) {
      return {
        success: false,
        data: null as any,
        fieldErrors: { email: response.message || 'Une erreur est survenue' }
      };
    }
    
    return response;
  }

  async registerVerifyEmail(email: string, code: string): Promise<ApiResponse<boolean>> {
    const response = await this.httpClient.post<boolean>('/api/auth/register/register-verify-email', { email, code });
    
    // Transformer toute erreur en fieldErrors pour le code
    if (!response.success && response.message) {
      return {
        success: false,
        data: null as any,
        fieldErrors: { code: response.message || 'Une erreur est survenue' }
      };
    }
    
    return response;
  }

  async registerComplete(data: CompleteRegistration): Promise<ApiResponse<any>> {
    return await this.httpClient.post<any>('/api/auth/register/register-complete', data);
  }

  async resendRegisterVerifyEmail(email: string): Promise<ApiResponse<{ message: string; email: string; expirationMinutes: number }>> {
    const response = await this.httpClient.post<{ message: string; email: string; expirationMinutes: number }>('/api/auth/register/register-email-resend-verification', { email });
    
    // Transformer toute erreur en fieldErrors pour l'email
    if (!response.success && response.message) {
      return {
        success: false,
        data: null as any,
        fieldErrors: { email: response.message || 'Une erreur est survenue' }
      };
    }
    
    return response;
  }

  async logout(): Promise<ApiResponse<any>> {
    // Utiliser l'endpoint Next.js qui supprimera le cookie
    return await this.httpClient.post<any>('/api/auth/logout');
  }

  async getCurrentUser(): Promise<ApiResponse<any>> {
    return await this.httpClient.get<any>('/api/auth/me');
  }
} 