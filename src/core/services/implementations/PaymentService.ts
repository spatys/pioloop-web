import { IPaymentService } from '../interfaces/IPaymentService';
import { Payment, CreatePaymentForm, ProcessPaymentForm, RefundPaymentForm } from '../../types';
import { paymentRepository } from '../../repositories/implementations/PaymentRepository';

export class PaymentService implements IPaymentService {
  async getPayments(filters?: any): Promise<Payment[]> {
    const response = await paymentRepository.getPayments(filters);
    return response.data || [];
  }

  async getPayment(id: string): Promise<Payment> {
    const response = await paymentRepository.getPayment(id);
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch payment');
    }
    return response.data;
  }

  async createPayment(data: CreatePaymentForm): Promise<Payment> {
    const response = await paymentRepository.createPayment(data);
    if (!response.success) {
      throw new Error(response.message || 'Failed to create payment');
    }
    return response.data;
  }

  async updatePayment(id: string, data: any): Promise<Payment> {
    const response = await paymentRepository.updatePayment(id, data);
    if (!response.success) {
      throw new Error(response.message || 'Failed to update payment');
    }
    return response.data;
  }

  async deletePayment(id: string): Promise<void> {
    const response = await paymentRepository.deletePayment(id);
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete payment');
    }
  }

  async getMyPayments(): Promise<Payment[]> {
    const response = await paymentRepository.getMyPayments();
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch my payments');
    }
    return response.data;
  }

  async getPaymentsByUser(userId: string): Promise<Payment[]> {
    const response = await paymentRepository.getPaymentsByUser(userId);
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch payments by user');
    }
    return response.data;
  }

  async getPaymentsByReservation(reservationId: string): Promise<Payment[]> {
    const response = await paymentRepository.getPaymentsByReservation(reservationId);
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch payments by reservation');
    }
    return response.data;
  }

  async processPayment(data: ProcessPaymentForm): Promise<Payment> {
    const response = await paymentRepository.processPayment(data);
    if (!response.success) {
      throw new Error(response.message || 'Failed to process payment');
    }
    return response.data;
  }

  async refundPayment(data: RefundPaymentForm): Promise<Payment> {
    const response = await paymentRepository.refundPayment(data);
    if (!response.success) {
      throw new Error(response.message || 'Failed to refund payment');
    }
    return response.data;
  }

  async updatePaymentStatus(id: string, status: string): Promise<Payment> {
    const response = await paymentRepository.updatePaymentStatus(id, status);
    if (!response.success) {
      throw new Error(response.message || 'Failed to update payment status');
    }
    return response.data;
  }

  async createStripePaymentIntent(amount: number, currency: string): Promise<{ clientSecret: string }> {
    const response = await paymentRepository.createStripePaymentIntent(amount, currency);
    if (!response.success) {
      throw new Error(response.message || 'Failed to create payment intent');
    }
    return response.data;
  }

  async confirmStripePayment(paymentIntentId: string): Promise<Payment> {
    const response = await paymentRepository.confirmStripePayment(paymentIntentId);
    if (!response.success) {
      throw new Error(response.message || 'Failed to confirm payment');
    }
    return response.data;
  }

  async validatePayment(data: CreatePaymentForm): Promise<{ isValid: boolean; errors: string[] }> {
    const response = await paymentRepository.validatePayment(data);
    if (!response.success) {
      throw new Error(response.message || 'Failed to validate payment');
    }
    return response.data;
  }

  async getPaymentStats(userId?: string): Promise<any> {
    const response = await paymentRepository.getPaymentStats(userId);
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch payment stats');
    }
    return response.data;
  }

  async getPaymentMethods(): Promise<any[]> {
    // This would be implemented with payment method service
    throw new Error('Payment methods not implemented');
  }

  async savePaymentMethod(data: any): Promise<any> {
    // This would be implemented with payment method service
    throw new Error('Payment method saving not implemented');
  }

  async deletePaymentMethod(methodId: string): Promise<void> {
    // This would be implemented with payment method service
    throw new Error('Payment method deletion not implemented');
  }
}

export const paymentService = new PaymentService(); 