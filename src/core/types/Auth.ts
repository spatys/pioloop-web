import { User } from './User';
import { ApiResponse } from './Api';

export interface LoginErrorDto {
  email: string;
  password: string;
}

export interface LoginErrorResponseDto {
  success: boolean;
  error: LoginErrorDto;
}

export interface LoginSuccessResponseDto {
  message: string;
  user: User;
  token: string;
}

// Type union pour gérer les deux cas de réponse
export type LoginApiResponse = LoginSuccessResponseDto | LoginErrorResponseDto;

// Type pour la réponse Next.js qui normalise les erreurs
export interface LoginNormalizedResponse {
  success: boolean;
  data: LoginSuccessResponseDto | null;
  message?: string;
  fieldErrors?: Record<string, string>;
  globalErrors?: string[];
}

// Nouveau type pour les réponses d'authentification standardisées
export interface LoginResponse extends ApiResponse<LoginSuccessResponseDto> {} 