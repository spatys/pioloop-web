import { ApiResponse } from '../../types';
import { LoginForm, RegisterForm, CompleteRegistration } from '../../types/Forms';
import { LoginNormalizedResponse } from '../../types/Auth';

export interface IAuthService {
  login(credentials: LoginForm): Promise<LoginNormalizedResponse>;
  register(userData: RegisterForm): Promise<ApiResponse<any>>;
  registrationEmail(email: string): Promise<ApiResponse<{ message: string; email: string; expirationMinutes: number }>>;
  registrationVerifyEmailCode(email: string, code: string): Promise<ApiResponse<boolean>>;
  registrationComplete(data: CompleteRegistration): Promise<ApiResponse<any>>;
  logout(): Promise<ApiResponse<any>>;
  getCurrentUser(): Promise<ApiResponse<any>>;
} 