import { Invoice, CreateInvoiceForm, UpdateInvoiceForm } from "../../types";

export interface IInvoiceService {
  // Invoice CRUD operations
  getInvoices(filters?: any): Promise<Invoice[]>;
  getInvoice(id: string): Promise<Invoice>;
  createInvoice(data: CreateInvoiceForm): Promise<Invoice>;
  updateInvoice(id: string, data: UpdateInvoiceForm): Promise<Invoice>;
  deleteInvoice(id: string): Promise<void>;

  // User-specific invoice operations
  getMyInvoices(): Promise<Invoice[]>;
  getInvoicesByTenant(tenantId: string): Promise<Invoice[]>;
  getInvoicesByProperty(propertyId: string): Promise<Invoice[]>;

  // Invoice status operations
  updateInvoiceStatus(id: string, status: string): Promise<Invoice>;
  markInvoiceAsPaid(id: string, paidAt: Date): Promise<Invoice>;

  // Invoice generation
  generateInvoice(reservationId: string): Promise<Invoice>;
  generateRecurringInvoices(
    propertyId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Invoice[]>;

  // Invoice validation
  validateInvoice(
    data: CreateInvoiceForm,
  ): Promise<{ isValid: boolean; errors: string[] }>;

  // Invoice statistics
  getInvoiceStats(userId?: string): Promise<any>;

  // Invoice templates
  getInvoiceTemplates(): Promise<any[]>;
  applyInvoiceTemplate(invoiceId: string, templateId: string): Promise<Invoice>;

  // Invoice calculations
  calculateInvoiceTotal(
    items: any[],
  ): Promise<{ subtotal: number; taxAmount: number; totalAmount: number }>;
}
