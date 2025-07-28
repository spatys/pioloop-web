import { UserRole } from './User';
import { PropertyType, PropertyAddress } from './Property';

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phoneNumber?: string;
  address?: PropertyAddress;
}

export interface PropertySearchForm {
  location?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: PropertyType;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  pageNumber?: number;
  pageSize?: number;
}

export interface CreateReservationForm {
  propertyId: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  specialRequests?: string;
}

export interface CreatePropertyForm {
  title: string;
  description: string;
  address: PropertyAddress;
  propertyType: PropertyType;
  pricePerNight: number;
  pricePerMonth: number;
  pricePerYear: number;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  squareFootage: number;
  isFurnished: boolean;
  amenities: string[];
  images: File[];
} 