import { User } from "./User";
import { Money } from "./Money";

export enum PropertyStatus {
  Available = "Available",
  Rented = "Rented",
  UnderMaintenance = "UnderMaintenance",
  Unavailable = "Unavailable",
}

export enum PropertyType {
  Room = "Chambre",
  Studio = "Studio",
  Apartment = "Appartement",
  House = "Maison",
  Duplex = "Duplex",
  Villa = "Villa",
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
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  squareMeters: number;
  address: string;
  neighborhood: string;
  city: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
  pricePerNight: number;
  cleaningFee: number;
  serviceFee: number;
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
  properties: PropertyResponse[];
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
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  squareMeters: number;
  address: string;
  neighborhood: string;
  city: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
  pricePerNight: number;
  cleaningFee: number;
  serviceFee: number;
  ownerId?: string; // Optionnel, sera récupéré automatiquement depuis le token JWT
  amenities: PropertyAmenityRequest[];
  images: PropertyImageRequest[];
}

export interface PropertyAmenityRequest {
  name: string;
  description: string;
  type: number;
  category: number;
  isAvailable: boolean;
  isIncludedInRent: boolean;
  additionalCost?: number;
  icon: string;
  priority: number;
}

export interface PropertyImageRequest {
  imageUrl: string;
  altText: string;
  isMainImage: boolean;
  displayOrder: number;
}

export interface UpdatePropertyRequest {
  title?: string;
  description?: string;
  propertyType?: string;
  maxGuests?: number;
  bedrooms?: number;
  beds?: number;
  bathrooms?: number;
  squareMeters?: number;
  address?: string;
  neighborhood?: string;
  city?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  pricePerNight?: number;
  cleaningFee?: number;
  serviceFee?: number;
  amenities?: PropertyAmenityRequest[];
  images?: PropertyImageRequest[];
}

export interface PropertyResponse {
  id: string;
  title: string;
  description: string;
  propertyType: string;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  squareMeters: number;
  address: string;
  neighborhood: string;
  city: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
  pricePerNight: number;
  cleaningFee: number;
  serviceFee: number;
  status: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  imageUrls: string[];
  amenities: string[];
  createdAt: string;
  updatedAt: string;
}

// Fonction utilitaire pour convertir PropertyResponse en Property
export const convertPropertyResponseToProperty = (response: PropertyResponse): Property => {
  return {
    ...response,
    createdAt: new Date(response.createdAt),
    updatedAt: new Date(response.updatedAt),
  };
};
