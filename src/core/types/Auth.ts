export interface LoginErrorDto {
  email: string;
  password: string;
}

export interface LoginErrorResponseDto {
  status: boolean;
  error: LoginErrorDto;
} 