import { 
  PropertyAvailability, 
  PropertyAvailabilityCalendar,
  CreateAvailabilityRequest,
  UpdateAvailabilityRequest,
  BulkUpdateAvailabilityRequest,
  GetAvailabilityRequest
} from "@/core/types/Availability";

export interface IAvailabilityService {
  getPropertyAvailability(request: GetAvailabilityRequest): Promise<PropertyAvailability[]>;
  getAvailabilityCalendar(propertyId: string, startDate?: Date, endDate?: Date): Promise<PropertyAvailabilityCalendar>;
  createAvailability(request: CreateAvailabilityRequest): Promise<PropertyAvailability>;
  updateAvailability(request: UpdateAvailabilityRequest): Promise<PropertyAvailability>;
  deleteAvailability(id: string): Promise<boolean>;
  bulkUpdateAvailability(request: BulkUpdateAvailabilityRequest): Promise<PropertyAvailability[]>;
}

export class AvailabilityService implements IAvailabilityService {
  private baseUrl: string;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') {
    this.baseUrl = baseUrl;
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`${this.baseUrl}/api/propertyavailability${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getPropertyAvailability(request: GetAvailabilityRequest): Promise<PropertyAvailability[]> {
    const params = new URLSearchParams();
    if (request.startDate) params.append('startDate', request.startDate.toISOString());
    if (request.endDate) params.append('endDate', request.endDate.toISOString());

    const endpoint = `/property/${request.propertyId}?${params.toString()}`;
    return this.makeRequest<PropertyAvailability[]>(endpoint);
  }

  async getAvailabilityCalendar(
    propertyId: string, 
    startDate?: Date, 
    endDate?: Date
  ): Promise<PropertyAvailabilityCalendar> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate.toISOString());
    if (endDate) params.append('endDate', endDate.toISOString());

    const endpoint = `/property/${propertyId}/calendar?${params.toString()}`;
    return this.makeRequest<PropertyAvailabilityCalendar>(endpoint);
  }

  async createAvailability(request: CreateAvailabilityRequest): Promise<PropertyAvailability> {
    return this.makeRequest<PropertyAvailability>('', {
      method: 'POST',
      body: JSON.stringify({
        ...request,
        checkInDate: request.checkInDate.toISOString(),
        checkOutDate: request.checkOutDate.toISOString(),
      }),
    });
  }

  async updateAvailability(request: UpdateAvailabilityRequest): Promise<PropertyAvailability> {
    return this.makeRequest<PropertyAvailability>(`/${request.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        ...request,
        checkInDate: request.checkInDate.toISOString(),
        checkOutDate: request.checkOutDate.toISOString(),
      }),
    });
  }

  async deleteAvailability(id: string): Promise<boolean> {
    await this.makeRequest(`/${id}`, {
      method: 'DELETE',
    });
    return true;
  }

  async bulkUpdateAvailability(request: BulkUpdateAvailabilityRequest): Promise<PropertyAvailability[]> {
    const processedRequest = {
      ...request,
      periods: request.periods.map(period => ({
        ...period,
        startDate: period.startDate.toISOString(),
        endDate: period.endDate.toISOString(),
      })),
    };

    return this.makeRequest<PropertyAvailability[]>('/bulk', {
      method: 'POST',
      body: JSON.stringify(processedRequest),
    });
  }
}

// Singleton instance
export const availabilityService = new AvailabilityService();
