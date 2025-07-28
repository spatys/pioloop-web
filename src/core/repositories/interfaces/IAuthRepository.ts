import { User, LoginForm, RegisterForm, ApiResponse } from '../../types';

export interface IAuthRepository {
  // User login
  login(credentials: LoginForm): Promise<ApiResponse<{ token: string; user: User }>>;
  
  // User registration
  register(userData: RegisterForm): Promise<ApiResponse<User>>;
  
  // Email confirmation
  confirmEmail(email: string, code: string): Promise<ApiResponse<boolean>>;
  
  // User logout
  logout(): Promise<void>;
  
  // Get current user
  getCurrentUser(): Promise<ApiResponse<User>>;
  
  // Refresh token
  refreshToken(): Promise<ApiResponse<{ token: string }>>;
  
  // Forgot password
  forgotPassword(email: string): Promise<ApiResponse<void>>;
  
  // Reset password
  resetPassword(token: string, newPassword: string): Promise<ApiResponse<void>>;
  
  // Change password
  changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<void>>;
  
  // Update profile
  updateProfile(userData: Partial<User>): Promise<ApiResponse<User>>;
  
  // Upload profile image
  uploadProfileImage(file: File): Promise<ApiResponse<{ imageUrl: string }>>;
  
  // Delete account
  deleteAccount(password: string): Promise<ApiResponse<void>>;
} 