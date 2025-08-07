import { injectable, inject } from 'inversify';
import { IAuthRepository } from '../interfaces/IAuthRepository';
import type { IHttpClient } from '../interfaces/IHttpClient';
import { TYPES } from '../../di/types';
import { ApiResponse } from '../../types';
import { LoginForm, RegisterForm, CompleteRegistration } from '../../types/Forms';
import { LoginSuccessResponseDto } from '../../types/Auth';

@injectable()
export class AuthRepository implements IAuthRepository {
  constructor(
    @inject(TYPES.IHttpClient) private httpClient: IHttpClient
  ) {}

  async login(credentials: LoginForm): Promise<ApiResponse<LoginSuccessResponseDto>> {
    // Utiliser l'endpoint Next.js qui définira le cookie
    const response = await this.httpClient.post<LoginSuccessResponseDto>('/api/auth/login', credentials);
    
    // Retourner directement la réponse standardisée
    return response;
  }

  // async register(userData: RegisterForm): Promise<ApiResponse<any>> {
  //   return await this.httpClient.post<any>('/auth/registration', userData);
  // }

  async registrationEmail(email: string): Promise<ApiResponse<{ message: string; email: string; expirationMinutes: number }>> {
    const response = await this.httpClient.post<{ message: string; email: string; expirationMinutes: number }>('/api/auth/registration/registration-email', { email });
    
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

  async registrationVerifyEmailCode(email: string, code: string): Promise<ApiResponse<boolean>> {
    const response = await this.httpClient.post<boolean>('/api/auth/registration/registration-verify-email', { email, code });
    
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

  async registrationComplete(data: CompleteRegistration): Promise<ApiResponse<any>> {
    return await this.httpClient.post<any>('/api/auth/registration/registration-complete', data);
  }

  async resendEmailVerificationCode(email: string): Promise<ApiResponse<{ message: string; email: string; expirationMinutes: number }>> {
    const response = await this.httpClient.post<{ message: string; email: string; expirationMinutes: number }>('/api/auth/registration/registration-email-resend-verification', { email });
    
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