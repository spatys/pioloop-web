import { User } from "./User";
import { Money } from "./Money";

export enum PropertyStatus {
  AwaitingVerification = "AwaitingVerification",
  Verified = "Verified",
  Rented = "Rented",
  Deleted = "Deleted",
}

// Constantes pour faciliter l'utilisation
export const PROPERTY_STATUS = {
  AWAITING_VERIFICATION: PropertyStatus.AwaitingVerification,
  VERIFIED: PropertyStatus.Verified,
  RENTED: PropertyStatus.Rented,
  DELETED: PropertyStatus.Deleted,
} as const;

// Fonction utilitaire pour obtenir le label affiché d'un statut
export const getPropertyStatusLabel = (status: PropertyStatus | string): string => {
  if (status === PropertyStatus.AwaitingVerification) {
    return "En attente de vérification";
  }
  
  switch (status) {
    case PropertyStatus.AwaitingVerification:
      return "En attente de vérification";
    case PropertyStatus.Verified:
      return "Vérifiée";
    case PropertyStatus.Rented:
      return "Louée";
    case PropertyStatus.Deleted:
      return "Supprimée";
    default:
      return "Statut inconnu";
  }
};

// Fonction utilitaire pour obtenir la couleur d'un statut (pour l'UI)
export const getPropertyStatusColor = (status: PropertyStatus | string): string => {
  if (status === PropertyStatus.AwaitingVerification) {
    return "warning"; // Orange/Yellow
  }
  
  switch (status) {
    case PropertyStatus.AwaitingVerification:
      return "warning"; // Orange/Yellow
    case PropertyStatus.Verified:
      return "success"; // Green
    case PropertyStatus.Rented:
      return "info"; // Blue
    case PropertyStatus.Deleted:
      return "danger"; // Red
    default:
      return "secondary"; // Gray
  }
};

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
  imageData: string; // Base64 encoded BLOB data
  contentType: string; // MIME type
  altText: string;
  isMainImage: boolean;
  displayOrder: number;
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
  images: PropertyImage[];
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
  imageData: string; // Base64 encoded image data
  contentType: string; // MIME type (e.g., 'image/webp')
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
  images: PropertyImage[];
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
