import { IInvoiceRepository } from '../interfaces/IInvoiceRepository';
import { Invoice, CreateInvoiceForm, UpdateInvoiceForm, ApiResponse, PaginatedResponse } from '../../types';

class InvoiceRepository implements IInvoiceRepository {
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

  async getInvoices(filters?: any): Promise<PaginatedResponse<Invoice>> {
    const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    const response = await this.apiRequest<PaginatedResponse<Invoice>>(`/invoices${queryParams}`);
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
    return await this.apiRequest<Invoice>(`/invoices/${id}`);
  }

  async createInvoice(data: CreateInvoiceForm): Promise<ApiResponse<Invoice>> {
    return await this.apiRequest<Invoice>('/invoices', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateInvoice(id: string, data: UpdateInvoiceForm): Promise<ApiResponse<Invoice>> {
    return await this.apiRequest<Invoice>(`/invoices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteInvoice(id: string): Promise<ApiResponse<void>> {
    return await this.apiRequest<void>(`/invoices/${id}`, {
      method: 'DELETE',
    });
  }

  async getMyInvoices(): Promise<ApiResponse<Invoice[]>> {
    return await this.apiRequest<Invoice[]>('/invoices/my');
  }

  async getInvoicesByTenant(tenantId: string): Promise<ApiResponse<Invoice[]>> {
    return await this.apiRequest<Invoice[]>(`/invoices/tenant/${tenantId}`);
  }

  async getInvoicesByProperty(propertyId: string): Promise<ApiResponse<Invoice[]>> {
    return await this.apiRequest<Invoice[]>(`/invoices/property/${propertyId}`);
  }

  async updateInvoiceStatus(id: string, status: string): Promise<ApiResponse<Invoice>> {
    return await this.apiRequest<Invoice>(`/invoices/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async markInvoiceAsPaid(id: string, paidAt: Date): Promise<ApiResponse<Invoice>> {
    return await this.apiRequest<Invoice>(`/invoices/${id}/paid`, {
      method: 'PUT',
      body: JSON.stringify({ paidAt }),
    });
  }

  async generateInvoice(reservationId: string): Promise<ApiResponse<Invoice>> {
    return await this.apiRequest<Invoice>(`/invoices/generate/${reservationId}`, {
      method: 'POST',
    });
  }

  async generateRecurringInvoices(propertyId: string, startDate: Date, endDate: Date): Promise<ApiResponse<Invoice[]>> {
    return await this.apiRequest<Invoice[]>('/invoices/generate-recurring', {
      method: 'POST',
      body: JSON.stringify({ propertyId, startDate, endDate }),
    });
  }

  async validateInvoice(data: CreateInvoiceForm): Promise<ApiResponse<{ isValid: boolean; errors: string[] }>> {
    return await this.apiRequest<{ isValid: boolean; errors: string[] }>('/invoices/validate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getInvoiceStats(userId?: string): Promise<ApiResponse<any>> {
    const queryParams = userId ? `?userId=${userId}` : '';
    return await this.apiRequest<any>(`/invoices/stats${queryParams}`);
  }
}

export const invoiceRepository = new InvoiceRepository(); 