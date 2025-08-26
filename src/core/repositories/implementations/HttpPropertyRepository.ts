import type { IPropertyRepository } from "../interfaces/IPropertyRepository";
import type { PropertySearchCriteria } from "@/core/types/Property";
import type { PropertySearchResponse } from "@/core/types/Property";
import type { CreatePropertyRequest } from "@/core/types/Property";
import type { PropertyResponse } from "@/core/types/Property";
import { IHttpClient } from "../interfaces/IHttpClient";

export class HttpPropertyRepository implements IPropertyRepository {
  constructor(private httpClient: IHttpClient) {}

  async searchProperties(criteria: PropertySearchCriteria): Promise<PropertySearchResponse> {
    const queryParams = new URLSearchParams();
    
    if (criteria.location) queryParams.append('location', criteria.location);
    if (criteria.checkIn) queryParams.append('checkIn', criteria.checkIn);
    if (criteria.checkOut) queryParams.append('checkOut', criteria.checkOut);
    if (criteria.guests) queryParams.append('guests', criteria.guests.toString());
    if (criteria.page) queryParams.append('page', criteria.page.toString());
    if (criteria.pageSize) queryParams.append('pageSize', criteria.pageSize.toString());

    const response = await this.httpClient.get<PropertySearchResponse>(`/api/properties/search?${queryParams}`);
    return response;
  }

  async getPropertyById(id: string): Promise<PropertyResponse | null> {
    try {
      const response = await this.httpClient.get<PropertyResponse>(`/api/properties/${id}`);
      return response;
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async createProperty(request: CreatePropertyRequest): Promise<PropertyResponse> {
    const response = await this.httpClient.post<PropertyResponse>('/api/properties/create', request);
    return response;
  }

  async updateProperty(id: string, request: Partial<CreatePropertyRequest>): Promise<PropertyResponse | null> {
    try {
      const response = await this.httpClient.put<PropertyResponse>(`/api/properties/${id}`, request);
      return response;
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async getLatestProperties(limit: number): Promise<PropertyResponse[]> {
    // Pour l'instant, utiliser la recherche avec un limit
    const response = await this.searchProperties({ page: 1, pageSize: limit });
    return response.properties;
  }

  async getPropertiesByOwnerId(ownerId: string): Promise<PropertyResponse[]> {
    const response = await this.httpClient.get<PropertyResponse[]>(`/api/properties/owner/${ownerId}`);
    return response;
  }
}
