import { ApiResponse } from '../../types';
import { LoginForm, CompleteRegistration } from '../../types/Forms';
import { LoginSuccessResponseDto } from '../../types/Auth';

export interface IAuthService {
  login(credentials: LoginForm): Promise<ApiResponse<LoginSuccessResponseDto>>;
  registerEmail(email: string): Promise<ApiResponse<{ message: string; email: string; expirationMinutes: number }>>;
  registerVerifyEmail(email: string, code: string): Promise<ApiResponse<boolean>>;
  registerComplete(data: CompleteRegistration): Promise<ApiResponse<any>>;
  resendRegisterVerifyEmail(email: string): Promise<ApiResponse<{ message: string; email: string; expirationMinutes: number }>>;
  logout(): Promise<ApiResponse<any>>;
  getCurrentUser(): Promise<ApiResponse<any>>;
} 