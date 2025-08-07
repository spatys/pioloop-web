import { User } from './User';

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
  data: LoginSuccessResponseDto | null; // Rendre data obligatoire mais nullable
  message?: string;
  errors?: string[];
  fieldErrors?: Record<string, string>; // Erreurs spécifiques par champ (email, password)
} 