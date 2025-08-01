import { injectable, inject } from 'inversify';
import { IAuthService } from '../interfaces/IAuthService';
import type { IAuthRepository } from '../../repositories/interfaces/IAuthRepository';
import { User, LoginForm, RegisterForm, ApiResponse } from '../../types';
import { TYPES } from '../../di/types';

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.IAuthRepository) private authRepository: IAuthRepository
  ) {}

  async login(credentials: LoginForm): Promise<ApiResponse<{ token: string; user: User }>> {
    return await this.authRepository.login(credentials);
  }

  async register(userData: RegisterForm): Promise<ApiResponse<User>> {
    return await this.authRepository.register(userData);
  }

  async emailRegistration(email: string): Promise<ApiResponse<{ message: string; email: string }>> {
    return await this.authRepository.emailRegistration(email);
  }

  async confirmEmail(email: string, code: string): Promise<ApiResponse<boolean>> {
    return await this.authRepository.confirmEmail(email, code);
  }

  async logout(): Promise<void> {
    return await this.authRepository.logout();
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return await this.authRepository.getCurrentUser();
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    return await this.authRepository.refreshToken();
  }

  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    return await this.authRepository.forgotPassword(email);
  }

  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<void>> {
    return await this.authRepository.resetPassword(token, newPassword);
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<void>> {
    return await this.authRepository.changePassword(currentPassword, newPassword);
  }

  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return await this.authRepository.updateProfile(userData);
  }

  async uploadProfileImage(file: File): Promise<ApiResponse<{ imageUrl: string }>> {
    return await this.authRepository.uploadProfileImage(file);
  }

  async deleteAccount(password: string): Promise<ApiResponse<void>> {
    return await this.authRepository.deleteAccount(password);
  }
} 