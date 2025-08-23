import { Contract, CreateContractForm, UpdateContractForm } from "../../types";

export interface IContractService {
  // Contract CRUD operations
  getContracts(filters?: any): Promise<Contract[]>;
  getContract(id: string): Promise<Contract>;
  createContract(data: CreateContractForm): Promise<Contract>;
  updateContract(id: string, data: UpdateContractForm): Promise<Contract>;
  deleteContract(id: string): Promise<void>;

  // User-specific contract operations
  getMyContracts(): Promise<Contract[]>;
  getContractsByTenant(tenantId: string): Promise<Contract[]>;
  getContractsByProperty(propertyId: string): Promise<Contract[]>;

  // Contract status operations
  updateContractStatus(
    id: string,
    status: string,
    reason?: string,
  ): Promise<Contract>;
  signContract(
    id: string,
    signatureType: "tenant" | "owner",
  ): Promise<Contract>;

  // Contract validation
  validateContract(
    data: CreateContractForm,
  ): Promise<{ isValid: boolean; errors: string[] }>;

  // Contract statistics
  getContractStats(userId?: string): Promise<any>;

  // Contract generation
  generateContractFromReservation(reservationId: string): Promise<Contract>;

  // Contract templates
  getContractTemplates(): Promise<any[]>;
  applyContractTemplate(
    contractId: string,
    templateId: string,
  ): Promise<Contract>;
}
