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

  async getPopularProperties(limit: number): Promise<PropertyResponse[]> {
    try {
      // Appeler directement l'API Gateway pour récupérer les logements populaires
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      if (!apiUrl) {
        throw new Error('URL de l\'API non configurée. Veuillez définir NEXT_PUBLIC_API_URL dans votre fichier .env.local');
      }
      
      const response = await fetch(`${apiUrl}/api/property/search?page=1&pageSize=${limit}&sortBy=Popularity&sortOrder=Descending`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Si la réponse est paginée, extraire les données
      if (data.data && Array.isArray(data.data)) {
        return data.data;
      }
      
      // Si la réponse n'est pas paginée, retourner directement
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching popular properties:', error);
      throw new Error('Erreur lors de la récupération des logements populaires');
    }
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
