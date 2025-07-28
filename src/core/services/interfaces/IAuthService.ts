import { User, LoginForm, RegisterForm } from '../../types';

export interface IAuthService {
  // Authentication methods
  login(credentials: LoginForm): Promise<{ user: User; token: string }>;
  register(userData: RegisterForm): Promise<User>;
  logout(): Promise<void>;
  
  // User management
  getCurrentUser(): Promise<User | null>;
  updateProfile(userData: Partial<User>): Promise<User>;
  changePassword(currentPassword: string, newPassword: string): Promise<void>;
  
  // Email verification
  confirmEmail(email: string, code: string): Promise<boolean>;
  resendConfirmationEmail(email: string): Promise<void>;
  
  // Password reset
  forgotPassword(email: string): Promise<void>;
  resetPassword(token: string, newPassword: string): Promise<void>;
  
  // Account management
  uploadProfileImage(file: File): Promise<{ imageUrl: string }>;
  deleteAccount(password: string): Promise<void>;
  
  // Token management
  refreshToken(): Promise<{ token: string }>;
  isTokenValid(): boolean;
  getStoredToken(): string | null;
  setStoredToken(token: string): void;
  clearStoredToken(): void;
  
  // Utility methods
  isAuthenticated(): boolean;
  hasRole(role: string): boolean;
  hasAnyRole(roles: string[]): boolean;
} 