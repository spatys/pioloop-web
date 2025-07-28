import { Payment, CreatePaymentForm, ProcessPaymentForm, RefundPaymentForm } from '../../types';

export interface IPaymentService {
  // Payment CRUD operations
  getPayments(filters?: any): Promise<Payment[]>;
  getPayment(id: string): Promise<Payment>;
  createPayment(data: CreatePaymentForm): Promise<Payment>;
  updatePayment(id: string, data: any): Promise<Payment>;
  deletePayment(id: string): Promise<void>;
  
  // User-specific payment operations
  getMyPayments(): Promise<Payment[]>;
  getPaymentsByUser(userId: string): Promise<Payment[]>;
  getPaymentsByReservation(reservationId: string): Promise<Payment[]>;
  
  // Payment processing
  processPayment(data: ProcessPaymentForm): Promise<Payment>;
  refundPayment(data: RefundPaymentForm): Promise<Payment>;
  
  // Payment status operations
  updatePaymentStatus(id: string, status: string): Promise<Payment>;
  
  // Stripe integration
  createStripePaymentIntent(amount: number, currency: string): Promise<{ clientSecret: string }>;
  confirmStripePayment(paymentIntentId: string): Promise<Payment>;
  
  // Payment validation
  validatePayment(data: CreatePaymentForm): Promise<{ isValid: boolean; errors: string[] }>;
  
  // Payment statistics
  getPaymentStats(userId?: string): Promise<any>;
  
  // Payment methods
  getPaymentMethods(): Promise<any[]>;
  savePaymentMethod(data: any): Promise<any>;
  deletePaymentMethod(methodId: string): Promise<void>;
} 