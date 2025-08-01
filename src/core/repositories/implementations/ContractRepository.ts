import { injectable, inject } from 'inversify';
import { IContractRepository } from '../interfaces/IContractRepository';
import type { IHttpClient } from '../interfaces/IHttpClient';
import { Contract, CreateContractForm, UpdateContractForm, ApiResponse, PaginatedResponse } from '../../types';
import { TYPES } from '../../di/types';

@injectable()
class ContractRepository implements IContractRepository {
  constructor(
    @inject(TYPES.IHttpClient) private httpClient: IHttpClient
  ) {}



  async getContracts(filters?: any): Promise<PaginatedResponse<Contract>> {
    const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    const response = await this.httpClient.get<PaginatedResponse<Contract>>(`/contracts${queryParams}`);
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
    return await this.httpClient.get<Contract>(`/contracts/${id}`);
  }

  async createContract(data: CreateContractForm): Promise<ApiResponse<Contract>> {
    return await this.httpClient.post<Contract>('/contracts', data);
  }

  async updateContract(id: string, data: UpdateContractForm): Promise<ApiResponse<Contract>> {
    return await this.httpClient.put<Contract>(`/contracts/${id}`, data);
  }

  async deleteContract(id: string): Promise<ApiResponse<void>> {
    return await this.httpClient.delete<void>(`/contracts/${id}`);
  }

  async getMyContracts(): Promise<ApiResponse<Contract[]>> {
    return await this.httpClient.get<Contract[]>('/contracts/my');
  }

  async getContractsByTenant(tenantId: string): Promise<ApiResponse<Contract[]>> {
    return await this.httpClient.get<Contract[]>(`/contracts/tenant/${tenantId}`);
  }

  async getContractsByProperty(propertyId: string): Promise<ApiResponse<Contract[]>> {
    return await this.httpClient.get<Contract[]>(`/contracts/property/${propertyId}`);
  }

  async updateContractStatus(id: string, status: string, reason?: string): Promise<ApiResponse<Contract>> {
    return await this.httpClient.patch<Contract>(`/contracts/${id}/status`, { status, reason });
  }

  async signContract(id: string, signatureType: 'tenant' | 'owner'): Promise<ApiResponse<Contract>> {
    return await this.httpClient.post<Contract>(`/contracts/${id}/sign`, { signatureType });
  }

  async validateContract(data: CreateContractForm): Promise<ApiResponse<{ isValid: boolean; errors: string[] }>> {
    return await this.httpClient.post<{ isValid: boolean; errors: string[] }>('/contracts/validate', data);
  }

  async getContractStats(userId?: string): Promise<ApiResponse<any>> {
    const queryParams = userId ? `?userId=${userId}` : '';
    return await this.httpClient.get<any>(`/contracts/stats${queryParams}`);
  }
}

export { ContractRepository }; 