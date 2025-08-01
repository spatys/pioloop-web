import { injectable, inject } from 'inversify';
import type { IAuthRepository } from '../../repositories/interfaces/IAuthRepository';
import { IAuthService } from '../interfaces/IAuthService';
import { TYPES } from '../../di/types';
import { ApiResponse } from '../../types';
import { LoginForm, RegisterForm, CompleteRegistration } from '../../types/Forms';

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.IAuthRepository) private authRepository: IAuthRepository
  ) {}

  async login(credentials: LoginForm): Promise<ApiResponse<{ token: string; user: any }>> {
    return await this.authRepository.login(credentials);
  }

  async register(userData: RegisterForm): Promise<ApiResponse<any>> {
    return await this.authRepository.register(userData);
  }

  async registrationEmail(email: string): Promise<ApiResponse<{ message: string; email: string; expirationMinutes: number }>> {
    return await this.authRepository.registrationEmail(email);
  }

  async registrationVerifyEmailCode(email: string, code: string): Promise<ApiResponse<boolean>> {
    return await this.authRepository.registrationVerifyEmailCode(email, code);
  }

  async registrationComplete(data: CompleteRegistration): Promise<ApiResponse<any>> {
    return await this.authRepository.registrationComplete(data);
  }

  async logout(): Promise<ApiResponse<any>> {
    return await this.authRepository.logout();
  }

  async getCurrentUser(): Promise<ApiResponse<any>> {
    return await this.authRepository.getCurrentUser();
  }
} 