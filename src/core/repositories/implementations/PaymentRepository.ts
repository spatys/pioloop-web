import { IPaymentRepository } from '../interfaces/IPaymentRepository';
import { Payment, CreatePaymentForm, ProcessPaymentForm, RefundPaymentForm, ApiResponse, PaginatedResponse } from '../../types';
import { HttpClient } from '../../services/implementations/HttpClient';

class PaymentRepository implements IPaymentRepository {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }

  async getPayments(filters?: any): Promise<PaginatedResponse<Payment>> {
    const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    const response = await this.httpClient.get<PaginatedResponse<Payment>>(`/payments${queryParams}`);
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
    return await this.httpClient.get<Payment>(`/payments/${id}`);
  }

  async createPayment(data: CreatePaymentForm): Promise<ApiResponse<Payment>> {
    return await this.httpClient.post<Payment>('/payments', data);
  }

  async updatePayment(id: string, data: any): Promise<ApiResponse<Payment>> {
    return await this.httpClient.put<Payment>(`/payments/${id}`, data);
  }

  async deletePayment(id: string): Promise<ApiResponse<void>> {
    return await this.httpClient.delete<void>(`/payments/${id}`);
  }

  async getMyPayments(): Promise<ApiResponse<Payment[]>> {
    return await this.httpClient.get<Payment[]>('/payments/my');
  }

  async getPaymentsByUser(userId: string): Promise<ApiResponse<Payment[]>> {
    return await this.httpClient.get<Payment[]>(`/payments/user/${userId}`);
  }

  async getPaymentsByReservation(reservationId: string): Promise<ApiResponse<Payment[]>> {
    return await this.httpClient.get<Payment[]>(`/payments/reservation/${reservationId}`);
  }

  async processPayment(data: ProcessPaymentForm): Promise<ApiResponse<Payment>> {
    return await this.httpClient.put<Payment>(`/payments/${data.paymentId}/process`, data);
  }

  async refundPayment(data: RefundPaymentForm): Promise<ApiResponse<Payment>> {
    return await this.httpClient.put<Payment>(`/payments/${data.paymentId}/refund`, data);
  }

  async updatePaymentStatus(id: string, status: string): Promise<ApiResponse<Payment>> {
    return await this.httpClient.put<Payment>(`/payments/${id}/status`, { status });
  }

  async createStripePaymentIntent(amount: number, currency: string): Promise<ApiResponse<{ clientSecret: string }>> {
    return await this.httpClient.post<{ clientSecret: string }>('/payments/stripe/create-intent', { amount, currency });
  }

  async confirmStripePayment(paymentIntentId: string): Promise<ApiResponse<Payment>> {
    return await this.httpClient.post<Payment>('/payments/stripe/confirm', { paymentIntentId });
  }

  async validatePayment(data: CreatePaymentForm): Promise<ApiResponse<{ isValid: boolean; errors: string[] }>> {
    return await this.httpClient.post<{ isValid: boolean; errors: string[] }>('/payments/validate', data);
  }

  async getPaymentStats(userId?: string): Promise<ApiResponse<any>> {
    const queryParams = userId ? `?userId=${userId}` : '';
    return await this.httpClient.get<any>(`/payments/stats${queryParams}`);
  }
}

export const paymentRepository = new PaymentRepository(); 