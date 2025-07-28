import { User } from './User';
import { Property } from './Property';
import { Reservation } from './Reservation';
import { Money } from './Money';

export enum InvoiceStatus {
  Draft = 'Draft',
  Sent = 'Sent',
  Paid = 'Paid',
  Overdue = 'Overdue',
  Cancelled = 'Cancelled'
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: Money;
  totalAmount: Money;
  createdAt: Date;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  reservationId: string;
  reservation: Reservation;
  tenantId: string;
  tenant: User;
  propertyId: string;
  property: Property;
  issueDate: Date;
  dueDate: Date;
  subtotal: Money;
  taxAmount: Money;
  totalAmount: Money;
  status: InvoiceStatus;
  items: InvoiceItem[];
  notes?: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateInvoiceForm {
  reservationId: string;
  issueDate: string;
  dueDate: string;
  items: CreateInvoiceItemForm[];
  notes?: string;
}

export interface CreateInvoiceItemForm {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface UpdateInvoiceForm {
  issueDate?: string;
  dueDate?: string;
  status?: InvoiceStatus;
  notes?: string;
} 