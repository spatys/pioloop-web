import {
  Contract,
  CreateContractForm,
  UpdateContractForm,
  ApiResponse,
  PaginatedResponse,
} from "../../types";

export interface IContractRepository {
  // Contract CRUD operations
  getContracts(filters?: any): Promise<PaginatedResponse<Contract>>;
  getContract(id: string): Promise<ApiResponse<Contract>>;
  createContract(data: CreateContractForm): Promise<ApiResponse<Contract>>;
  updateContract(
    id: string,
    data: UpdateContractForm,
  ): Promise<ApiResponse<Contract>>;
  deleteContract(id: string): Promise<ApiResponse<void>>;

  // User-specific contract operations
  getMyContracts(): Promise<ApiResponse<Contract[]>>;
  getContractsByTenant(tenantId: string): Promise<ApiResponse<Contract[]>>;
  getContractsByProperty(propertyId: string): Promise<ApiResponse<Contract[]>>;

  // Contract status operations
  updateContractStatus(
    id: string,
    status: string,
    reason?: string,
  ): Promise<ApiResponse<Contract>>;
  signContract(
    id: string,
    signatureType: "tenant" | "owner",
  ): Promise<ApiResponse<Contract>>;

  // Contract validation
  validateContract(
    data: CreateContractForm,
  ): Promise<ApiResponse<{ isValid: boolean; errors: string[] }>>;

  // Contract statistics
  getContractStats(userId?: string): Promise<ApiResponse<any>>;
}
