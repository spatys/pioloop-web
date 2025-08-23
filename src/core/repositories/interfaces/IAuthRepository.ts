import { ApiResponse } from "../../types";
import { LoginForm, RegisterForm, CompleteRegister } from "../../types/Forms";
import { User } from "../../types/User";
import { LoginSuccessResponseDto } from "../../types/Auth";

export interface IAuthRepository {
  login(credentials: LoginForm): Promise<ApiResponse<LoginSuccessResponseDto>>;
  registerEmail(
    email: string,
  ): Promise<ApiResponse<{ message: string; email: string }>>;
  registerVerifyEmail(
    email: string,
    code: string,
  ): Promise<ApiResponse<boolean>>;
  registerComplete(data: CompleteRegister): Promise<ApiResponse<any>>;
  resendRegisterVerifyEmail(
    email: string,
  ): Promise<ApiResponse<{ message: string; email: string }>>;
  logout(): Promise<ApiResponse<any>>;
  getCurrentUser(): Promise<ApiResponse<any>>;
}
