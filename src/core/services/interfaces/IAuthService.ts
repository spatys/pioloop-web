import { ApiResponse } from '../../types';
import { LoginForm, RegisterForm, CompleteRegistration } from '../../types/Forms';
import { LoginSuccessResponseDto } from '../../types/Auth';

export interface IAuthService {
  login(credentials: LoginForm): Promise<ApiResponse<LoginSuccessResponseDto>>;
  // register(userData: RegisterForm): Promise<ApiResponse<any>>;
  registrationEmail(email: string): Promise<ApiResponse<{ message: string; email: string; expirationMinutes: number }>>;
  registrationVerifyEmailCode(email: string, code: string): Promise<ApiResponse<boolean>>;
  registrationComplete(data: CompleteRegistration): Promise<ApiResponse<any>>;
  resendEmailVerificationCode(email: string): Promise<ApiResponse<{ message: string; email: string; expirationMinutes: number }>>;
  logout(): Promise<ApiResponse<any>>;
  getCurrentUser(): Promise<ApiResponse<any>>;
} 