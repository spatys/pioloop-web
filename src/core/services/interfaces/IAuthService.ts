import { ApiResponse } from '../../types';
import { LoginForm, RegisterForm } from '../../types/Forms';

export interface IAuthService {
  login(credentials: LoginForm): Promise<ApiResponse<{ token: string; user: any }>>;
  register(userData: RegisterForm): Promise<ApiResponse<any>>;
  registrationEmail(email: string): Promise<ApiResponse<{ message: string; email: string }>>;
  registrationVerifyEmailCode(email: string, code: string): Promise<ApiResponse<boolean>>;
  logout(): Promise<ApiResponse<any>>;
  getCurrentUser(): Promise<ApiResponse<any>>;
} 