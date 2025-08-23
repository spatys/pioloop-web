import { IInvoiceService } from "../interfaces/IInvoiceService";
import { Invoice, CreateInvoiceForm, UpdateInvoiceForm } from "../../types";
import { invoiceRepository } from "../../repositories/implementations/InvoiceRepository";

export class InvoiceService implements IInvoiceService {
  async getInvoices(filters?: any): Promise<Invoice[]> {
    const response = await invoiceRepository.getInvoices(filters);
    return response.data || [];
  }

  async getInvoice(id: string): Promise<Invoice> {
    const response = await invoiceRepository.getInvoice(id);
    if (!response.success) {
      throw new Error(response.message || "Failed to fetch invoice");
    }
    return response.data;
  }

  async createInvoice(data: CreateInvoiceForm): Promise<Invoice> {
    const response = await invoiceRepository.createInvoice(data);
    if (!response.success) {
      throw new Error(response.message || "Failed to create invoice");
    }
    return response.data;
  }

  async updateInvoice(id: string, data: UpdateInvoiceForm): Promise<Invoice> {
    const response = await invoiceRepository.updateInvoice(id, data);
    if (!response.success) {
      throw new Error(response.message || "Failed to update invoice");
    }
    return response.data;
  }

  async deleteInvoice(id: string): Promise<void> {
    const response = await invoiceRepository.deleteInvoice(id);
    if (!response.success) {
      throw new Error(response.message || "Failed to delete invoice");
    }
  }

  async getMyInvoices(): Promise<Invoice[]> {
    const response = await invoiceRepository.getMyInvoices();
    if (!response.success) {
      throw new Error(response.message || "Failed to fetch my invoices");
    }
    return response.data;
  }

  async getInvoicesByTenant(tenantId: string): Promise<Invoice[]> {
    const response = await invoiceRepository.getInvoicesByTenant(tenantId);
    if (!response.success) {
      throw new Error(response.message || "Failed to fetch invoices by tenant");
    }
    return response.data;
  }

  async getInvoicesByProperty(propertyId: string): Promise<Invoice[]> {
    const response = await invoiceRepository.getInvoicesByProperty(propertyId);
    if (!response.success) {
      throw new Error(
        response.message || "Failed to fetch invoices by property",
      );
    }
    return response.data;
  }

  async updateInvoiceStatus(id: string, status: string): Promise<Invoice> {
    const response = await invoiceRepository.updateInvoiceStatus(id, status);
    if (!response.success) {
      throw new Error(response.message || "Failed to update invoice status");
    }
    return response.data;
  }

  async markInvoiceAsPaid(id: string, paidAt: Date): Promise<Invoice> {
    const response = await invoiceRepository.markInvoiceAsPaid(id, paidAt);
    if (!response.success) {
      throw new Error(response.message || "Failed to mark invoice as paid");
    }
    return response.data;
  }

  async generateInvoice(reservationId: string): Promise<Invoice> {
    const response = await invoiceRepository.generateInvoice(reservationId);
    if (!response.success) {
      throw new Error(response.message || "Failed to generate invoice");
    }
    return response.data;
  }

  async generateRecurringInvoices(
    propertyId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Invoice[]> {
    const response = await invoiceRepository.generateRecurringInvoices(
      propertyId,
      startDate,
      endDate,
    );
    if (!response.success) {
      throw new Error(
        response.message || "Failed to generate recurring invoices",
      );
    }
    return response.data;
  }

  async validateInvoice(
    data: CreateInvoiceForm,
  ): Promise<{ isValid: boolean; errors: string[] }> {
    const response = await invoiceRepository.validateInvoice(data);
    if (!response.success) {
      throw new Error(response.message || "Failed to validate invoice");
    }
    return response.data;
  }

  async getInvoiceStats(userId?: string): Promise<any> {
    const response = await invoiceRepository.getInvoiceStats(userId);
    if (!response.success) {
      throw new Error(response.message || "Failed to fetch invoice stats");
    }
    return response.data;
  }

  async getInvoiceTemplates(): Promise<any[]> {
    // This would be implemented with template service
    throw new Error("Invoice templates not implemented");
  }

  async applyInvoiceTemplate(
    invoiceId: string,
    templateId: string,
  ): Promise<Invoice> {
    // This would be implemented with template service
    throw new Error("Invoice template application not implemented");
  }

  async calculateInvoiceTotal(
    items: any[],
  ): Promise<{ subtotal: number; taxAmount: number; totalAmount: number }> {
    const subtotal = items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );
    const taxRate = 0.1; // 10% tax rate
    const taxAmount = subtotal * taxRate;
    const totalAmount = subtotal + taxAmount;

    return {
      subtotal,
      taxAmount,
      totalAmount,
    };
  }
}

export const invoiceService = new InvoiceService();
