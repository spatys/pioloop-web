import { IInvoiceRepository } from '../interfaces/IInvoiceRepository';
import { Invoice, CreateInvoiceForm, UpdateInvoiceForm, ApiResponse, PaginatedResponse } from '../../types';
import { HttpClient } from './HttpClient';

class InvoiceRepository implements IInvoiceRepository {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }

  async getInvoices(filters?: any): Promise<PaginatedResponse<Invoice>> {
    const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    const response = await this.httpClient.get<PaginatedResponse<Invoice>>(`/invoices${queryParams}`);
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

  async getInvoice(id: string): Promise<ApiResponse<Invoice>> {
    return await this.httpClient.get<Invoice>(`/invoices/${id}`);
  }

  async createInvoice(data: CreateInvoiceForm): Promise<ApiResponse<Invoice>> {
    return await this.httpClient.post<Invoice>('/invoices', data);
  }

  async updateInvoice(id: string, data: UpdateInvoiceForm): Promise<ApiResponse<Invoice>> {
    return await this.httpClient.put<Invoice>(`/invoices/${id}`, data);
  }

  async deleteInvoice(id: string): Promise<ApiResponse<void>> {
    return await this.httpClient.delete<void>(`/invoices/${id}`);
  }

  async getMyInvoices(): Promise<ApiResponse<Invoice[]>> {
    return await this.httpClient.get<Invoice[]>('/invoices/my');
  }

  async getInvoicesByTenant(tenantId: string): Promise<ApiResponse<Invoice[]>> {
    return await this.httpClient.get<Invoice[]>(`/invoices/tenant/${tenantId}`);
  }

  async getInvoicesByProperty(propertyId: string): Promise<ApiResponse<Invoice[]>> {
    return await this.httpClient.get<Invoice[]>(`/invoices/property/${propertyId}`);
  }

  async updateInvoiceStatus(id: string, status: string): Promise<ApiResponse<Invoice>> {
    return await this.httpClient.put<Invoice>(`/invoices/${id}/status`, { status });
  }

  async markInvoiceAsPaid(id: string, paidAt: Date): Promise<ApiResponse<Invoice>> {
    return await this.httpClient.put<Invoice>(`/invoices/${id}/paid`, { paidAt });
  }

  async generateInvoice(reservationId: string): Promise<ApiResponse<Invoice>> {
    return await this.httpClient.post<Invoice>(`/invoices/generate/${reservationId}`);
  }

  async generateRecurringInvoices(propertyId: string, startDate: Date, endDate: Date): Promise<ApiResponse<Invoice[]>> {
    return await this.httpClient.post<Invoice[]>('/invoices/generate-recurring', { propertyId, startDate, endDate });
  }

  async validateInvoice(data: CreateInvoiceForm): Promise<ApiResponse<{ isValid: boolean; errors: string[] }>> {
    return await this.httpClient.post<{ isValid: boolean; errors: string[] }>('/invoices/validate', data);
  }

  async getInvoiceStats(userId?: string): Promise<ApiResponse<any>> {
    const queryParams = userId ? `?userId=${userId}` : '';
    return await this.httpClient.get<any>(`/invoices/stats${queryParams}`);
  }
}

export const invoiceRepository = new InvoiceRepository(); 