import type { IPropertyRepository } from "../interfaces/IPropertyRepository";
import type { PropertySearchCriteria } from "@/core/types/Property";
import type { PropertySearchResponse } from "@/core/types/Property";
import type { CreatePropertyRequest } from "@/core/types/Property";
import type { PropertyResponse } from "@/core/types/Property";
import { injectable, inject } from "inversify";
import { TYPES } from "@/core/di/types";
import type { IHttpClient } from "../interfaces/IHttpClient";
import { ApiResponse } from "@/core/types";

@injectable()
export class PropertyRepository implements IPropertyRepository {
  constructor(
    @inject(TYPES.IHttpClient) private httpClient: IHttpClient,
  ) {}

  async searchProperties(
    criteria: PropertySearchCriteria,
  ): Promise<PropertySearchResponse> {
    const queryParams = new URLSearchParams();
    
    if (criteria.location) {
      queryParams.append('location', criteria.location);
    }
    if (criteria.checkIn) {
      queryParams.append('checkIn', criteria.checkIn);
    }
    if (criteria.checkOut) {
      queryParams.append('checkOut', criteria.checkOut);
    }
    if (criteria.guests) {
      queryParams.append('guests', criteria.guests.toString());
    }
    if (criteria.page) {
      queryParams.append('page', criteria.page.toString());
    }
    if (criteria.pageSize) {
      queryParams.append('pageSize', criteria.pageSize.toString());
    }

    const endpoint = `/api/properties/search?${queryParams.toString()}`;
    const response = await this.httpClient.get<PropertySearchResponse>(endpoint);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    // Fallback avec des données vides en cas d'erreur
    return {
      properties: [],
      totalCount: 0,
      page: criteria.page || 1,
      pageSize: criteria.pageSize || 10,
      totalPages: 0,
    };
  }

  async getPropertyById(id: string): Promise<PropertyResponse | null> {
    const response = await this.httpClient.get<PropertyResponse>(`/api/properties/${id}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    return null;
  }

  async createProperty(
    request: CreatePropertyRequest,
  ): Promise<PropertyResponse> {
    const response = await this.httpClient.post<PropertyResponse>('/api/properties', request);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Erreur lors de la création de la propriété');
  }

  async updateProperty(
    id: string,
    request: Partial<CreatePropertyRequest>,
  ): Promise<PropertyResponse | null> {
    const response = await this.httpClient.put<PropertyResponse>(`/api/properties/${id}`, request);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    return null;
  }

  async getLatestProperties(limit: number): Promise<PropertyResponse[]> {
    const response = await this.httpClient.get<PropertyResponse[]>(`/api/properties/latest?limit=${limit}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    return [];
  }

  async getPropertiesByOwnerId(ownerId: string): Promise<PropertyResponse[]> {
    const response = await this.httpClient.get<PropertyResponse[]>(`/api/properties/owner/${ownerId}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    return [];
  }
}
