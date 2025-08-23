import {
  Payment,
  CreatePaymentForm,
  ProcessPaymentForm,
  RefundPaymentForm,
  ApiResponse,
  PaginatedResponse,
} from "../../types";

export interface IPaymentRepository {
  // Payment CRUD operations
  getPayments(filters?: any): Promise<PaginatedResponse<Payment>>;
  getPayment(id: string): Promise<ApiResponse<Payment>>;
  createPayment(data: CreatePaymentForm): Promise<ApiResponse<Payment>>;
  updatePayment(id: string, data: any): Promise<ApiResponse<Payment>>;
  deletePayment(id: string): Promise<ApiResponse<void>>;

  // User-specific payment operations
  getMyPayments(): Promise<ApiResponse<Payment[]>>;
  getPaymentsByUser(userId: string): Promise<ApiResponse<Payment[]>>;
  getPaymentsByReservation(
    reservationId: string,
  ): Promise<ApiResponse<Payment[]>>;

  // Payment processing
  processPayment(data: ProcessPaymentForm): Promise<ApiResponse<Payment>>;
  refundPayment(data: RefundPaymentForm): Promise<ApiResponse<Payment>>;

  // Payment status operations
  updatePaymentStatus(
    id: string,
    status: string,
  ): Promise<ApiResponse<Payment>>;

  // Stripe integration
  createStripePaymentIntent(
    amount: number,
    currency: string,
  ): Promise<ApiResponse<{ clientSecret: string }>>;
  confirmStripePayment(paymentIntentId: string): Promise<ApiResponse<Payment>>;

  // Payment validation
  validatePayment(
    data: CreatePaymentForm,
  ): Promise<ApiResponse<{ isValid: boolean; errors: string[] }>>;

  // Payment statistics
  getPaymentStats(userId?: string): Promise<ApiResponse<any>>;
}
