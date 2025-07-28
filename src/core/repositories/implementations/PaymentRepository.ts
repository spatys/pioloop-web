import { IPaymentRepository } from '../interfaces/IPaymentRepository';
import { Payment, CreatePaymentForm, ProcessPaymentForm, RefundPaymentForm, ApiResponse, PaginatedResponse } from '../../types';

class PaymentRepository implements IPaymentRepository {
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

  async getPayments(filters?: any): Promise<PaginatedResponse<Payment>> {
    const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    const response = await this.apiRequest<PaginatedResponse<Payment>>(`/payments${queryParams}`);
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

  async getPayment(id: string): Promise<ApiResponse<Payment>> {
    return await this.apiRequest<Payment>(`/payments/${id}`);
  }

  async createPayment(data: CreatePaymentForm): Promise<ApiResponse<Payment>> {
    return await this.apiRequest<Payment>('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePayment(id: string, data: any): Promise<ApiResponse<Payment>> {
    return await this.apiRequest<Payment>(`/payments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePayment(id: string): Promise<ApiResponse<void>> {
    return await this.apiRequest<void>(`/payments/${id}`, {
      method: 'DELETE',
    });
  }

  async getMyPayments(): Promise<ApiResponse<Payment[]>> {
    return await this.apiRequest<Payment[]>('/payments/my');
  }

  async getPaymentsByUser(userId: string): Promise<ApiResponse<Payment[]>> {
    return await this.apiRequest<Payment[]>(`/payments/user/${userId}`);
  }

  async getPaymentsByReservation(reservationId: string): Promise<ApiResponse<Payment[]>> {
    return await this.apiRequest<Payment[]>(`/payments/reservation/${reservationId}`);
  }

  async processPayment(data: ProcessPaymentForm): Promise<ApiResponse<Payment>> {
    return await this.apiRequest<Payment>(`/payments/${data.paymentId}/process`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async refundPayment(data: RefundPaymentForm): Promise<ApiResponse<Payment>> {
    return await this.apiRequest<Payment>(`/payments/${data.paymentId}/refund`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updatePaymentStatus(id: string, status: string): Promise<ApiResponse<Payment>> {
    return await this.apiRequest<Payment>(`/payments/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async createStripePaymentIntent(amount: number, currency: string): Promise<ApiResponse<{ clientSecret: string }>> {
    return await this.apiRequest<{ clientSecret: string }>('/payments/stripe/create-intent', {
      method: 'POST',
      body: JSON.stringify({ amount, currency }),
    });
  }

  async confirmStripePayment(paymentIntentId: string): Promise<ApiResponse<Payment>> {
    return await this.apiRequest<Payment>('/payments/stripe/confirm', {
      method: 'POST',
      body: JSON.stringify({ paymentIntentId }),
    });
  }

  async validatePayment(data: CreatePaymentForm): Promise<ApiResponse<{ isValid: boolean; errors: string[] }>> {
    return await this.apiRequest<{ isValid: boolean; errors: string[] }>('/payments/validate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPaymentStats(userId?: string): Promise<ApiResponse<any>> {
    const queryParams = userId ? `?userId=${userId}` : '';
    return await this.apiRequest<any>(`/payments/stats${queryParams}`);
  }
}

export const paymentRepository = new PaymentRepository(); 