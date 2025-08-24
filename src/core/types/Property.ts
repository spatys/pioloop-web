import { User } from "./User";
import { Money } from "./Money";

export enum PropertyStatus {
  Available = "Available",
  Rented = "Rented",
  UnderMaintenance = "UnderMaintenance",
  Unavailable = "Unavailable"
}

export enum PropertyType {
  Room = "Chambre",
  Studio = "Studio",
  Apartment = "Appartement",
  House = "Maison",
  Duplex = "Duplex",
  Villa = "Villa"
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

// Types simplifiés pour correspondre au backend PropertyResponse

export interface Property {
  id: string;
  title: string;
  description: string;
  propertyType: string;
  roomType: string;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  address: string;
  city: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
  pricePerNight: number;
  cleaningFee: number;
  serviceFee: number;
  isInstantBookable: boolean;
  status: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  imageUrls: string[];
  amenities: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Types pour les requêtes de recherche
export interface PropertySearchCriteria {
  location?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  page?: number;
  pageSize?: number;
}

// Types pour les réponses de recherche
export interface PropertySearchResponse {
  properties: Property[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Types pour la création et mise à jour
export interface CreatePropertyRequest {
  title: string;
  description: string;
  propertyType: string;
  roomType: string;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  address: string;
  city: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
  pricePerNight: number;
  cleaningFee: number;
  serviceFee: number;
  isInstantBookable: boolean;
  ownerId: string;
  imageUrls: string[];
  amenities: string[];
}

export interface UpdatePropertyRequest {
  title?: string;
  description?: string;
  propertyType?: string;
  roomType?: string;
  maxGuests?: number;
  bedrooms?: number;
  beds?: number;
  bathrooms?: number;
  address?: string;
  city?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  pricePerNight?: number;
  cleaningFee?: number;
  serviceFee?: number;
  isInstantBookable?: boolean;
  imageUrls?: string[];
  amenities?: string[];
}
