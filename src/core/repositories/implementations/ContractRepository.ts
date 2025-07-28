import { IContractRepository } from '../interfaces/IContractRepository';
import { Contract, CreateContractForm, UpdateContractForm, ApiResponse, PaginatedResponse } from '../../types';

class ContractRepository implements IContractRepository {
  private baseURL: string;

  constructor() {
    this.baseURL = typeof window !== 'undefined' && (window as any).env?.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  }

  private async apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...this.getAuthHeaders(),
      ...(options.headers as Record<string, string> || {}),
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          data: null as T,
          message: data.message || 'Request failed',
          errors: data.errors || [],
        };
      }

      return {
        success: true,
        data,
        message: 'Success',
      };
    } catch (error) {
      return {
        success: false,
        data: null as T,
        message: 'Network error',
        errors: [],
      };
    }
  }

  private getAuthHeaders(): Record<string, string> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getContracts(filters?: any): Promise<PaginatedResponse<Contract>> {
    const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    const response = await this.apiRequest<PaginatedResponse<Contract>>(`/contracts${queryParams}`);
    return response.success ? response.data : { 
      success: true,
      data: [], 
      totalCount: 0, 
      pageNumber: 1, 
      pageSize: 10,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false
    };
  }

  async getContract(id: string): Promise<ApiResponse<Contract>> {
    return await this.apiRequest<Contract>(`/contracts/${id}`);
  }

  async createContract(data: CreateContractForm): Promise<ApiResponse<Contract>> {
    return await this.apiRequest<Contract>('/contracts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateContract(id: string, data: UpdateContractForm): Promise<ApiResponse<Contract>> {
    return await this.apiRequest<Contract>(`/contracts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteContract(id: string): Promise<ApiResponse<void>> {
    return await this.apiRequest<void>(`/contracts/${id}`, {
      method: 'DELETE',
    });
  }

  async getMyContracts(): Promise<ApiResponse<Contract[]>> {
    return await this.apiRequest<Contract[]>('/contracts/my');
  }

  async getContractsByTenant(tenantId: string): Promise<ApiResponse<Contract[]>> {
    return await this.apiRequest<Contract[]>(`/contracts/tenant/${tenantId}`);
  }

  async getContractsByProperty(propertyId: string): Promise<ApiResponse<Contract[]>> {
    return await this.apiRequest<Contract[]>(`/contracts/property/${propertyId}`);
  }

  async updateContractStatus(id: string, status: string, reason?: string): Promise<ApiResponse<Contract>> {
    return await this.apiRequest<Contract>(`/contracts/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, reason }),
    });
  }

  async signContract(id: string, signatureType: 'tenant' | 'owner'): Promise<ApiResponse<Contract>> {
    return await this.apiRequest<Contract>(`/contracts/${id}/sign`, {
      method: 'PUT',
      body: JSON.stringify({ signatureType }),
    });
  }

  async validateContract(data: CreateContractForm): Promise<ApiResponse<{ isValid: boolean; errors: string[] }>> {
    return await this.apiRequest<{ isValid: boolean; errors: string[] }>('/contracts/validate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getContractStats(userId?: string): Promise<ApiResponse<any>> {
    const queryParams = userId ? `?userId=${userId}` : '';
    return await this.apiRequest<any>(`/contracts/stats${queryParams}`);
  }
}

export const contractRepository = new ContractRepository(); 