import { User } from './User';
import { Property } from './Property';
import { Payment } from './Payment';
import { Money } from './Money';

export enum ReservationStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  CheckedIn = 'CheckedIn',
  CheckedOut = 'CheckedOut',
  Cancelled = 'Cancelled',
  NoShow = 'NoShow'
}

export interface Reservation {
  id: string;
  propertyId: string;
  property: Property;
  tenantId: string;
  tenant: User;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfGuests: number;
  totalAmount: Money;
  status: ReservationStatus;
  specialRequests?: string;
  cancellationReason?: string;
  cancelledAt?: Date;
  cancelledBy?: string;
  checkInTime?: Date;
  checkOutTime?: Date;
  payments: Payment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReservationForm {
  propertyId: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  specialRequests?: string;
}

export interface UpdateReservationForm {
  checkInDate?: string;
  checkOutDate?: string;
  numberOfGuests?: number;
  status?: ReservationStatus;
  specialRequests?: string;
  cancellationReason?: string;
} 