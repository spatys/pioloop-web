import { User } from './User';
import { Money } from './Money';

export enum PropertyStatus {
  Available = 'Available',
  Rented = 'Rented',
  UnderMaintenance = 'UnderMaintenance',
  Unavailable = 'Unavailable',
  Sold = 'Sold'
}

export enum PropertyType {
  Apartment = 'Apartment',
  House = 'House',
  Condo = 'Condo',
  Villa = 'Villa',
  Studio = 'Studio',
  Loft = 'Loft',
  Townhouse = 'Townhouse',
  Penthouse = 'Penthouse',
  Duplex = 'Duplex',
  Triplex = 'Triplex',
  MobileHome = 'MobileHome',
  Cabin = 'Cabin',
  Cottage = 'Cottage',
  Bungalow = 'Bungalow',
  Mansion = 'Mansion',
  Other = 'Other'
}

export interface PropertyImage {
  id: string;
  propertyId: string;
  imageUrl: string;
  isPrimary: boolean;
  caption?: string;
  order: number;
  createdAt: Date;
}

export interface PropertyAmenity {
  id: string;
  propertyId: string;
  name: string;
  description?: string;
  icon?: string;
  createdAt: Date;
}

export interface PropertyAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  owner: User;
  propertyType: PropertyType;
  status: PropertyStatus;
  address: PropertyAddress;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  squareFootage?: number;
  pricePerNight: Money;
  monthlyRent?: Money;
  securityDeposit?: Money;
  images: PropertyImage[];
  amenities: PropertyAmenity[];
  houseRules?: string[];
  cancellationPolicy?: string;
  checkInTime: string;
  checkOutTime: string;
  minimumStay: number;
  maximumStay: number;
  instantBookable: boolean;
  petsAllowed: boolean;
  smokingAllowed: boolean;
  partiesAllowed: boolean;
  wifi: boolean;
  parking: boolean;
  airConditioning: boolean;
  heating: boolean;
  kitchen: boolean;
  washer: boolean;
  dryer: boolean;
  tv: boolean;
  workspace: boolean;
  pool?: boolean;
  gym?: boolean;
  spa?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePropertyForm {
  title: string;
  description: string;
  propertyType: PropertyType;
  address: PropertyAddress;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  squareFootage?: number;
  pricePerNight: number;
  monthlyRent?: number;
  securityDeposit?: number;
  houseRules?: string[];
  cancellationPolicy?: string;
  checkInTime: string;
  checkOutTime: string;
  minimumStay: number;
  maximumStay: number;
  instantBookable: boolean;
  petsAllowed: boolean;
  smokingAllowed: boolean;
  partiesAllowed: boolean;
  wifi: boolean;
  parking: boolean;
  airConditioning: boolean;
  heating: boolean;
  kitchen: boolean;
  washer: boolean;
  dryer: boolean;
  tv: boolean;
  workspace: boolean;
  pool?: boolean;
  gym?: boolean;
  spa?: boolean;
}

export interface UpdatePropertyForm {
  title?: string;
  description?: string;
  propertyType?: PropertyType;
  status?: PropertyStatus;
  address?: PropertyAddress;
  bedrooms?: number;
  bathrooms?: number;
  maxGuests?: number;
  squareFootage?: number;
  pricePerNight?: number;
  monthlyRent?: number;
  securityDeposit?: number;
  houseRules?: string[];
  cancellationPolicy?: string;
  checkInTime?: string;
  checkOutTime?: string;
  minimumStay?: number;
  maximumStay?: number;
  instantBookable?: boolean;
  petsAllowed?: boolean;
  smokingAllowed?: boolean;
  partiesAllowed?: boolean;
  wifi?: boolean;
  parking?: boolean;
  airConditioning?: boolean;
  heating?: boolean;
  kitchen?: boolean;
  washer?: boolean;
  dryer?: boolean;
  tv?: boolean;
  workspace?: boolean;
  pool?: boolean;
  gym?: boolean;
  spa?: boolean;
} 