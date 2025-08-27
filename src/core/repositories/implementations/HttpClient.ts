import { injectable } from "inversify";
import { IHttpClient } from "../interfaces/IHttpClient";
import { ApiResponse } from "../../types";

@injectable()
export class HttpClient implements IHttpClient {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL!;
  }

  private async apiRequest<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    // Endpoints qui nécessitent des cookies → API routes Next.js
    const cookieEndpoints = [
      "/api/auth/login",
      "/api/auth/logout",
      "/api/auth/me",
    ];

    // Endpoints qui vont directement au backend C# (avec cookies via credentials: "include")
    const directBackendEndpoints = [
      "/api/auth/register/register-email",
      "/api/auth/register/register-verify-email",
      "/api/auth/register/register-complete",
      "/api/auth/register/resend-email-code",
      "/api/property/create",
      "/api/property/update",
      "/api/property/delete",
    ];

    // Déterminer l'URL cible
    let url: string;
    if (cookieEndpoints.includes(endpoint)) {
      // Endpoints de cookies → API routes Next.js
      url = `http://localhost:5000${endpoint}`;
    } else if (directBackendEndpoints.includes(endpoint)) {
      // Endpoints directs → Backend C# (enlever /api/ du baseURL car endpoint contient déjà /api/)
      const baseURLWithoutApi = this.baseURL.replace("/api", "");
      url = `${baseURLWithoutApi}${endpoint}`;
    } else if (endpoint.startsWith("/api/")) {
      // Autres endpoints /api/ → API routes Next.js (par défaut)
      url = `http://localhost:5000${endpoint}`;
    } else {
      // Endpoints sans /api/ → Backend C# direct
      url = `${this.baseURL}${endpoint}`;
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...this.getAuthHeaders(),
      ...((options.headers as Record<string, string>) || {}),
    };

    console.log(`🌐 Making request to: ${url} (endpoint: ${endpoint})`);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: "include",
      });

      // Vérifier si la réponse a du contenu
      const responseText = await response.text();

      let data;
      try {
        data = responseText ? JSON.parse(responseText) : null;
      } catch (jsonError) {
        return {
          success: false,
          data: null as T,
          message: "Invalid JSON response from server",
          fieldErrors: undefined,
          globalErrors: undefined,
        };
      }

      if (!response.ok) {
        // Ne pas log les erreurs 401 normales pour /auth/me
        // if (response.status !== 401 || !endpoint.includes('/auth/me')) {
        //   console.error(`HTTP ${response.status} error for ${endpoint}:`, data);
        // }

        return {
          success: false,
          data: data as T, // Retourner les données même en cas d'erreur
          message: data?.message || "Request failed",
          fieldErrors: data?.fieldErrors,
          globalErrors: data?.globalErrors,
        };
      }

      return {
        success: true,
        data,
        message: "Success",
      };
    } catch (error) {
      return {
        success: false,
        data: null as T,
        message: error instanceof Error ? error.message : "Network error",
        fieldErrors: undefined,
        globalErrors: undefined,
      };
    }
  }

  private getAuthHeaders(): Record<string, string> {
    // Pour l'instant, on n'ajoute pas de headers d'authentification
    // car on utilise les cookies HttpOnly
    return {};
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.apiRequest<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.apiRequest<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.apiRequest<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.apiRequest<T>(endpoint, { method: "DELETE" });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.apiRequest<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}
