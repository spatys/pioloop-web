// Export all service interfaces
export type { IAuthService } from './interfaces/IAuthService';
export type { IPropertyService } from './interfaces/IPropertyService';
export type { IBookingService } from './interfaces/IBookingService';
export type { IContractService } from './interfaces/IContractService';
export type { IInvoiceService } from './interfaces/IInvoiceService';
export type { IPaymentService } from './interfaces/IPaymentService';

// Export all service implementations
export { authService } from './implementations/AuthService';
export { propertyService } from './implementations/PropertyService';
export { bookingService } from './implementations/BookingService';
export { contractService } from './implementations/ContractService';
export { invoiceService } from './implementations/InvoiceService';
export { paymentService } from './implementations/PaymentService'; 