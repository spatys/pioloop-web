import { User } from "./User";
import { Property } from "./Property";
import { Reservation } from "./Reservation";
import { Invoice } from "./Invoice";
import { Money } from "./Money";

export enum PaymentStatus {
  Pending = "Pending",
  Processing = "Processing",
  Completed = "Completed",
  Failed = "Failed",
  Refunded = "Refunded",
  Cancelled = "Cancelled",
}

export enum PaymentMethod {
  CreditCard = "CreditCard",
  DebitCard = "DebitCard",
  BankTransfer = "BankTransfer",
  PayPal = "PayPal",
  Stripe = "Stripe",
  Cash = "Cash",
  Check = "Check",
}

export enum PaymentType {
  Rent = "Rent",
  SecurityDeposit = "SecurityDeposit",
  LateFee = "LateFee",
  UtilityFee = "UtilityFee",
  MaintenanceFee = "MaintenanceFee",
  Other = "Other",
}

export interface Payment {
  id: string;
  reservationId: string;
  reservation: Reservation;
  invoiceId?: string;
  invoice?: Invoice;
  payerId: string;
  payer: User;
  propertyId: string;
  property: Property;
  amount: Money;
  paymentMethod: PaymentMethod;
  paymentType: PaymentType;
  status: PaymentStatus;
  transactionId?: string;
  stripePaymentIntentId?: string;
  description?: string;
  processedAt?: Date;
  refundedAt?: Date;
  refundAmount?: Money;
  refundReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePaymentForm {
  reservationId: string;
  invoiceId?: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentType: PaymentType;
  description?: string;
}

export interface ProcessPaymentForm {
  paymentId: string;
  transactionId: string;
  stripePaymentIntentId?: string;
}

export interface RefundPaymentForm {
  paymentId: string;
  refundAmount: number;
  refundReason: string;
}
