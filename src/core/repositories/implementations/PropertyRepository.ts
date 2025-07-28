import { IPropertyRepository } from '../interfaces/IPropertyRepository';
import { Property, PropertySearchForm, PaginatedResponse, ApiResponse } from '../../types';

class PropertyRepository implements IPropertyRepository {
  private baseURL: string;

  constructor() {
    this.baseURL = typeof window !== 'undefined' && (window as any).env?.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  }

  private getAuthHeaders(): Record<string, string> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async makeRequest(url: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseURL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    });
    return response.json();
  }

  async getProperties(searchParams?: PropertySearchForm): Promise<PaginatedResponse<Property>> {
    try {
      const queryString = searchParams ? `?${new URLSearchParams(searchParams as any).toString()}` : '';
      return await this.makeRequest(`/properties${queryString}`);
    } catch (error) {
      throw new Error('Failed to fetch properties');
    }
  }

  async getProperty(id: string): Promise<ApiResponse<Property>> {
    try {
      return await this.makeRequest(`/properties/${id}`);
    } catch (error) {
      throw new Error('Failed to fetch property');
    }
  }

  async createProperty(propertyData: any): Promise<ApiResponse<Property>> {
    try {
      return await this.makeRequest('/properties', {
        method: 'POST',
        body: JSON.stringify(propertyData),
      });
    } catch (error) {
      throw new Error('Failed to create property');
    }
  }

  async updateProperty(id: string, propertyData: any): Promise<ApiResponse<Property>> {
    try {
      return await this.makeRequest(`/properties/${id}`, {
        method: 'PUT',
        body: JSON.stringify(propertyData),
      });
    } catch (error) {
      throw new Error('Failed to update property');
    }
  }

  async deleteProperty(id: string): Promise<ApiResponse<void>> {
    try {
      return await this.makeRequest(`/properties/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      throw new Error('Failed to delete property');
    }
  }

  async getMyProperties(): Promise<ApiResponse<Property[]>> {
    try {
      return await this.makeRequest('/properties/my-properties');
    } catch (error) {
      throw new Error('Failed to fetch my properties');
    }
  }

  async getFeaturedProperties(limit: number = 6): Promise<ApiResponse<Property[]>> {
    try {
      const response = await this.makeRequest(`/properties?pageSize=${limit}`);
      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      throw new Error('Failed to fetch featured properties');
    }
  }

  async getPropertiesByOwner(ownerId: string): Promise<ApiResponse<Property[]>> {
    try {
      const response = await this.makeRequest(`/properties?ownerId=${ownerId}`);
      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      throw new Error('Failed to fetch properties by owner');
    }
  }

  async getSimilarProperties(propertyId: string, limit: number = 4): Promise<ApiResponse<Property[]>> {
    try {
      // This would typically be implemented on the backend
      // For now, we'll return an empty array
      return {
        success: true,
        data: [],
        message: 'Similar properties not implemented yet'
      };
    } catch (error) {
      throw new Error('Failed to fetch similar properties');
    }
  }

  async getPropertyStats(propertyId: string): Promise<ApiResponse<any>> {
    try {
      // This would typically be implemented on the backend
      // For now, we'll return mock data
      return {
        success: true,
        data: {
          totalBookings: 0,
          totalRevenue: 0,
          averageRating: 0,
          occupancyRate: 0
        },
        message: 'Property stats not implemented yet'
      };
    } catch (error) {
      throw new Error('Failed to fetch property stats');
    }
  }
}

export const propertyRepository = new PropertyRepository(); 