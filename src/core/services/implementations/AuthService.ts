import { IAuthService } from '../interfaces/IAuthService';
import { User, LoginForm, RegisterForm } from '../../types';
import { authRepository } from '../../repositories/implementations/AuthRepository';

export class AuthService implements IAuthService {
  async login(credentials: LoginForm): Promise<{ user: User; token: string }> {
    const response = await authRepository.login(credentials);
    if (!response.success) {
      throw new Error(response.message || 'Login failed');
    }
    return response.data;
  }

  async register(userData: RegisterForm): Promise<User> {
    const response = await authRepository.register(userData);
    if (!response.success) {
      throw new Error(response.message || 'Registration failed');
    }
    return response.data;
  }

  async logout(): Promise<void> {
    await authRepository.logout();
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await authRepository.getCurrentUser();
      return response.success ? response.data : null;
    } catch {
      return null;
    }
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await authRepository.updateProfile(userData);
    if (!response.success) {
      throw new Error(response.message || 'Profile update failed');
    }
    return response.data;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const response = await authRepository.changePassword(currentPassword, newPassword);
    if (!response.success) {
      throw new Error(response.message || 'Password change failed');
    }
  }

  async confirmEmail(email: string, code: string): Promise<boolean> {
    const response = await authRepository.confirmEmail(email, code);
    if (!response.success) {
      throw new Error(response.message || 'Email confirmation failed');
    }
    return response.data;
  }

  async resendConfirmationEmail(email: string): Promise<void> {
    // This would be implemented in the repository
    throw new Error('Not implemented');
  }

  async forgotPassword(email: string): Promise<void> {
    const response = await authRepository.forgotPassword(email);
    if (!response.success) {
      throw new Error(response.message || 'Password reset request failed');
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const response = await authRepository.resetPassword(token, newPassword);
    if (!response.success) {
      throw new Error(response.message || 'Password reset failed');
    }
  }

  async uploadProfileImage(file: File): Promise<{ imageUrl: string }> {
    const response = await authRepository.uploadProfileImage(file);
    if (!response.success) {
      throw new Error(response.message || 'Profile image upload failed');
    }
    return response.data;
  }

  async deleteAccount(password: string): Promise<void> {
    const response = await authRepository.deleteAccount(password);
    if (!response.success) {
      throw new Error(response.message || 'Account deletion failed');
    }
  }

  async refreshToken(): Promise<{ token: string }> {
    const response = await authRepository.refreshToken();
    if (!response.success) {
      throw new Error(response.message || 'Token refresh failed');
    }
    return response.data;
  }

  isTokenValid(): boolean {
    const token = this.getStoredToken();
    if (!token) return false;
    
    try {
      // Basic token validation - in production you'd decode and check expiration
      return token.length > 0;
    } catch {
      return false;
    }
  }

  getStoredToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken');
  }

  setStoredToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('authToken', token);
  }

  clearStoredToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('authToken');
  }

  isAuthenticated(): boolean {
    return this.isTokenValid();
  }

  hasRole(role: string): boolean {
    // This would check the current user's role
    // For now, return false - would be implemented with user context
    return false;
  }

  hasAnyRole(roles: string[]): boolean {
    // This would check if the current user has any of the specified roles
    // For now, return false - would be implemented with user context
    return false;
  }
}

export const authService = new AuthService(); 