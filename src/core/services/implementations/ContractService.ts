import { injectable, inject } from 'inversify';
import { IContractService } from '../interfaces/IContractService';
import type { IContractRepository } from '../../repositories/interfaces/IContractRepository';
import { Contract, CreateContractForm, UpdateContractForm } from '../../types';
import { TYPES } from '../../di/types';

@injectable()
export class ContractService implements IContractService {
  constructor(
    @inject(TYPES.IContractRepository) private contractRepository: IContractRepository
  ) {}

  async getContracts(filters?: any): Promise<Contract[]> {
    const response = await this.contractRepository.getContracts(filters);
    return response.data || [];
  }

  async getContract(id: string): Promise<Contract> {
    const response = await this.contractRepository.getContract(id);
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch contract');
    }
    return response.data;
  }

  async createContract(data: CreateContractForm): Promise<Contract> {
    const response = await this.contractRepository.createContract(data);
    if (!response.success) {
      throw new Error(response.message || 'Failed to create contract');
    }
    return response.data;
  }

  async updateContract(id: string, data: UpdateContractForm): Promise<Contract> {
    const response = await this.contractRepository.updateContract(id, data);
    if (!response.success) {
      throw new Error(response.message || 'Failed to update contract');
    }
    return response.data;
  }

  async deleteContract(id: string): Promise<void> {
    const response = await this.contractRepository.deleteContract(id);
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete contract');
    }
  }

  async getMyContracts(): Promise<Contract[]> {
    const response = await this.contractRepository.getMyContracts();
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch my contracts');
    }
    return response.data;
  }

  async getContractsByTenant(tenantId: string): Promise<Contract[]> {
    const response = await this.contractRepository.getContractsByTenant(tenantId);
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch contracts by tenant');
    }
    return response.data;
  }

  async getContractsByProperty(propertyId: string): Promise<Contract[]> {
    const response = await this.contractRepository.getContractsByProperty(propertyId);
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch contracts by property');
    }
    return response.data;
  }

  async updateContractStatus(id: string, status: string, reason?: string): Promise<Contract> {
    const response = await this.contractRepository.updateContractStatus(id, status, reason);
    if (!response.success) {
      throw new Error(response.message || 'Failed to update contract status');
    }
    return response.data;
  }

  async signContract(id: string, signatureType: 'tenant' | 'owner'): Promise<Contract> {
    const response = await this.contractRepository.signContract(id, signatureType);
    if (!response.success) {
      throw new Error(response.message || 'Failed to sign contract');
    }
    return response.data;
  }

  async validateContract(data: CreateContractForm): Promise<{ isValid: boolean; errors: string[] }> {
    const response = await this.contractRepository.validateContract(data);
    if (!response.success) {
      throw new Error(response.message || 'Failed to validate contract');
    }
    return response.data;
  }

  async getContractStats(userId?: string): Promise<any> {
    const response = await this.contractRepository.getContractStats(userId);
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch contract stats');
    }
    return response.data;
  }

  async generateContractFromReservation(reservationId: string): Promise<Contract> {
    // This would be implemented with contract generation logic
    throw new Error('Contract generation not implemented');
  }

  async getContractTemplates(): Promise<any[]> {
    // This would be implemented with template fetching logic
    throw new Error('Contract templates not implemented');
  }

  async applyContractTemplate(contractId: string, templateId: string): Promise<Contract> {
    // This would be implemented with template application logic
    throw new Error('Contract template application not implemented');
  }
} 