import { User } from './User';
import { Property } from './Property';
import { Reservation } from './Reservation';
import { Payment } from './Payment';
import { Money } from './Money';

export enum ContractStatus {
  Draft = 'Draft',
  Pending = 'Pending',
  Active = 'Active',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  Terminated = 'Terminated'
}

export interface Contract {
  id: string;
  reservationId: string;
  reservation: Reservation;
  tenantId: string;
  tenant: User;
  propertyId: string;
  property: Property;
  startDate: Date;
  endDate: Date;
  monthlyRent: Money;
  securityDeposit: Money;
  status: ContractStatus;
  terms: string;
  specialConditions?: string;
  signedByTenant: boolean;
  signedByOwner: boolean;
  tenantSignatureDate?: Date;
  ownerSignatureDate?: Date;
  payments: Payment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateContractForm {
  reservationId: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  terms: string;
  specialConditions?: string;
}

export interface UpdateContractForm {
  startDate?: string;
  endDate?: string;
  monthlyRent?: number;
  securityDeposit?: number;
  terms?: string;
  specialConditions?: string;
  status?: ContractStatus;
} 