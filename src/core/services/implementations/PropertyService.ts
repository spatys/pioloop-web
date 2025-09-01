import { IPropertyService } from "../interfaces/IPropertyService";
import { PropertySearchCriteria, PropertySearchResponse, CreatePropertyRequest, PropertyResponse } from "@/core/types/Property";

export class PropertyService implements IPropertyService {
  private readonly baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/property`;

  async searchProperties(criteria: PropertySearchCriteria): Promise<PropertySearchResponse> {
    const queryParams = new URLSearchParams();
    
    if (criteria.location) {
      queryParams.append("location", criteria.location);
    }
    if (criteria.checkIn) {
      queryParams.append("checkIn", criteria.checkIn);
    }
    if (criteria.checkOut) {
      queryParams.append("checkOut", criteria.checkOut);
    }
    if (criteria.guests) {
      queryParams.append("guests", criteria.guests.toString());
    }
    queryParams.append("page", criteria.page?.toString() || "1");
    queryParams.append("pageSize", criteria.pageSize?.toString() || "20");

    const response = await fetch(`${this.baseUrl}/search?${queryParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }

  async getPropertyById(id: string): Promise<PropertyResponse | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      
      if (response.status === 404) {
        return null;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async createProperty(request: CreatePropertyRequest): Promise<PropertyResponse> {
    const response = await fetch(`${this.baseUrl}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }

  async updateProperty(id: string, request: Partial<CreatePropertyRequest>): Promise<PropertyResponse | null> {
    try {
      const response = await fetch(`${this.baseUrl}/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      
      if (response.status === 404) {
        return null;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async getLatestProperties(limit: number): Promise<PropertyResponse[]> {
    const response = await fetch(`${this.baseUrl}/latest?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }

  async getPropertiesByOwnerId(ownerId: string): Promise<PropertyResponse[]> {
    const response = await fetch(`${this.baseUrl}/owner/${ownerId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }
}

export const propertyService = new PropertyService();
