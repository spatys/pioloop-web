import { injectable, inject } from 'inversify';
import { IAuthRepository } from '../interfaces/IAuthRepository';
import type { IHttpClient } from '../interfaces/IHttpClient';
import { TYPES } from '../../di/types';
import { ApiResponse } from '../../types';
import { LoginForm, RegisterForm, CompleteRegistration } from '../../types/Forms';
import { LoginNormalizedResponse } from '../../types/Auth';

@injectable()
export class AuthRepository implements IAuthRepository {
  constructor(
    @inject(TYPES.IHttpClient) private httpClient: IHttpClient
  ) {}

  async login(credentials: LoginForm): Promise<LoginNormalizedResponse> {
    // Utiliser l'endpoint Next.js qui définira le cookie
    const response = await this.httpClient.post<LoginNormalizedResponse>('/api/auth/login', credentials);
    return response.data; // Retourner directement les données normalisées
  }

  async register(userData: RegisterForm): Promise<ApiResponse<any>> {
    return await this.httpClient.post<any>('/auth/register', userData);
  }

  async registrationEmail(email: string): Promise<ApiResponse<{ message: string; email: string; expirationMinutes: number }>> {
    return await this.httpClient.post<{ message: string; email: string; expirationMinutes: number }>('/api/auth/register/register-email', { email });
  }

  async registrationVerifyEmailCode(email: string, code: string): Promise<ApiResponse<boolean>> {
    return await this.httpClient.post<boolean>('/api/auth/register/verify-email', { email, code });
  }

  async registrationComplete(data: CompleteRegistration): Promise<ApiResponse<any>> {
    // Utiliser l'endpoint Next.js qui définira le cookie
    return await this.httpClient.post<any>('/api/auth/registration-complete', data);
  }

  async logout(): Promise<ApiResponse<any>> {
    // Utiliser l'endpoint Next.js qui supprimera le cookie
    return await this.httpClient.post<any>('/api/auth/logout');
  }

  async getCurrentUser(): Promise<ApiResponse<any>> {
    return await this.httpClient.get<any>('/api/auth/me');
  }
} 