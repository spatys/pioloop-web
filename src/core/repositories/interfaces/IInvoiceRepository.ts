import { Invoice, CreateInvoiceForm, UpdateInvoiceForm, ApiResponse, PaginatedResponse } from '../../types';

export interface IInvoiceRepository {
  // Invoice CRUD operations
  getInvoices(filters?: any): Promise<PaginatedResponse<Invoice>>;
  getInvoice(id: string): Promise<ApiResponse<Invoice>>;
  createInvoice(data: CreateInvoiceForm): Promise<ApiResponse<Invoice>>;
  updateInvoice(id: string, data: UpdateInvoiceForm): Promise<ApiResponse<Invoice>>;
  deleteInvoice(id: string): Promise<ApiResponse<void>>;
  
  // User-specific invoice operations
  getMyInvoices(): Promise<ApiResponse<Invoice[]>>;
  getInvoicesByTenant(tenantId: string): Promise<ApiResponse<Invoice[]>>;
  getInvoicesByProperty(propertyId: string): Promise<ApiResponse<Invoice[]>>;
  
  // Invoice status operations
  updateInvoiceStatus(id: string, status: string): Promise<ApiResponse<Invoice>>;
  markInvoiceAsPaid(id: string, paidAt: Date): Promise<ApiResponse<Invoice>>;
  
  // Invoice generation
  generateInvoice(reservationId: string): Promise<ApiResponse<Invoice>>;
  generateRecurringInvoices(propertyId: string, startDate: Date, endDate: Date): Promise<ApiResponse<Invoice[]>>;
  
  // Invoice validation
  validateInvoice(data: CreateInvoiceForm): Promise<ApiResponse<{ isValid: boolean; errors: string[] }>>;
  
  // Invoice statistics
  getInvoiceStats(userId?: string): Promise<ApiResponse<any>>;
} 