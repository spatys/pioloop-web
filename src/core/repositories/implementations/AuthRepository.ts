import { injectable, inject } from 'inversify';
import { IAuthRepository } from '../interfaces/IAuthRepository';
import type { IHttpClient } from '../../services/interfaces/IHttpClient';
import { TYPES } from '../../di/types';
import { ApiResponse } from '../../types';
import { LoginForm, RegisterForm, CompleteRegistration } from '../../types/Forms';

@injectable()
export class AuthRepository implements IAuthRepository {
  constructor(
    @inject(TYPES.IHttpClient) private httpClient: IHttpClient
  ) {}

  async login(credentials: LoginForm): Promise<ApiResponse<{ token: string; user: any }>> {
    try {
      return await this.httpClient.post<{ token: string; user: any }>('/auth/login', credentials);
    } catch (error) {
      throw new Error('Login failed');
    }
  }

  async register(userData: RegisterForm): Promise<ApiResponse<any>> {
    try {
      return await this.httpClient.post<any>('/auth/register', userData);
    } catch (error) {
      throw new Error('Registration failed');
    }
  }

  async registrationEmail(email: string): Promise<ApiResponse<{ message: string; email: string; expirationMinutes: number }>> {
    try {
      return await this.httpClient.post<{ message: string; email: string; expirationMinutes: number }>('/auth/register/register-email', { email });
    } catch (error) {
      throw new Error('Email registration failed');
    }
  }

  async registrationVerifyEmailCode(email: string, code: string): Promise<ApiResponse<boolean>> {
    try {
      return await this.httpClient.post<boolean>('/auth/register/verify-email', { email, code });
    } catch (error) {
      throw new Error('Email verification failed');
    }
  }

  async registrationComplete(data: CompleteRegistration): Promise<ApiResponse<any>> {
    try {
      return await this.httpClient.post<any>('/auth/register/complete', data);
    } catch (error) {
      throw new Error('Registration completion failed');
    }
  }

  async logout(): Promise<ApiResponse<any>> {
    try {
      return await this.httpClient.post<any>('/auth/logout');
    } catch (error) {
      throw new Error('Logout failed');
    }
  }

  async getCurrentUser(): Promise<ApiResponse<any>> {
    try {
      return await this.httpClient.get<any>('/auth/me');
    } catch (error) {
      throw new Error('Get current user failed');
    }
  }
} 