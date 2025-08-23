import { injectable, inject } from "inversify";
import type { IAuthRepository } from "../../repositories/interfaces/IAuthRepository";
import { IAuthService } from "../interfaces/IAuthService";
import { TYPES } from "../../di/types";
import { ApiResponse } from "../../types";
import { LoginForm, RegisterForm, CompleteRegister } from "../../types/Forms";
import { LoginSuccessResponseDto } from "../../types/Auth";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.IAuthRepository) private authRepository: IAuthRepository,
  ) {}

  async login(
    credentials: LoginForm,
  ): Promise<ApiResponse<LoginSuccessResponseDto>> {
    return await this.authRepository.login(credentials);
  }

  // async register(userData: RegisterForm): Promise<ApiResponse<any>> {
  //   return await this.authRepository.register(userData);
  // }

  async registerEmail(
    email: string,
  ): Promise<ApiResponse<{ message: string; email: string }>> {
    return await this.authRepository.registerEmail(email);
  }

  async registerVerifyEmail(
    email: string,
    code: string,
  ): Promise<ApiResponse<boolean>> {
    return await this.authRepository.registerVerifyEmail(email, code);
  }

  async registerComplete(data: CompleteRegister): Promise<ApiResponse<any>> {
    return await this.authRepository.registerComplete(data);
  }

  async resendRegisterVerifyEmail(
    email: string,
  ): Promise<ApiResponse<{ message: string; email: string }>> {
    return await this.authRepository.resendRegisterVerifyEmail(email);
  }

  async logout(): Promise<ApiResponse<any>> {
    return await this.authRepository.logout();
  }

  async getCurrentUser(): Promise<ApiResponse<any>> {
    return await this.authRepository.getCurrentUser();
  }
}
