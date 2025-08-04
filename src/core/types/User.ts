import { Property } from './Property';
import { Reservation } from './Reservation';
import { Payment } from './Payment';
import { Contract } from './Contract';
import { Invoice } from './Invoice';

export enum UserRole {
  Tenant = 'Tenant',
  Owner = 'Owner',
  Admin = 'Admin',
  Manager = 'Manager'
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  profileImage?: string;
  bio?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  privacy: {
    showProfile: boolean;
    showContactInfo: boolean;
  };
  language: string;
  timezone: string;
}

export interface UserAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  email: string;
  userName?: string;
  roles: string[]; // Rôles depuis l'API backend
  profile: UserProfile;
  addresses?: UserAddress[];
  isEmailConfirmed?: boolean;
  isPhoneConfirmed?: boolean;
  isActive: boolean;
  lastLoginAt?: Date;
  properties?: Property[];
  reservations?: Reservation[];
  payments?: Payment[];
  contracts?: Contract[];
  invoices?: Invoice[];
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateUserForm {
  email: string;
  userName: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role?: UserRole;
}

export interface UpdateUserForm {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  bio?: string;
  preferences?: UserPreferences;
}

export interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ForgotPasswordForm {
  email: string;
}

export interface ResetPasswordForm {
  token: string;
  newPassword: string;
  confirmNewPassword: string;
} 