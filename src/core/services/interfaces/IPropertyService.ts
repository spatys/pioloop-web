import {
  Property,
  PropertySearchForm,
  PropertyFilters,
  PaginatedResponse,
} from "../../types";

export interface IPropertyService {
  // Property CRUD operations
  getProperties(
    filters?: PropertyFilters,
  ): Promise<PaginatedResponse<Property>>;
  getProperty(id: string): Promise<Property>;
  createProperty(propertyData: any): Promise<Property>;
  updateProperty(id: string, propertyData: any): Promise<Property>;
  deleteProperty(id: string): Promise<void>;

  // Property search and filtering
  searchProperties(
    searchParams: PropertySearchForm,
  ): Promise<PaginatedResponse<Property>>;
  getFeaturedProperties(limit?: number): Promise<Property[]>;
  getSimilarProperties(propertyId: string, limit?: number): Promise<Property[]>;

  // User-specific property operations
  getMyProperties(): Promise<Property[]>;
  getPropertiesByOwner(ownerId: string): Promise<Property[]>;

  // Property analytics
  getPropertyStats(propertyId: string): Promise<any>;
  getPropertyAnalytics(
    propertyId: string,
    dateRange?: { start: Date; end: Date },
  ): Promise<any>;

  // Property availability
  checkAvailability(
    propertyId: string,
    checkIn: Date,
    checkOut: Date,
  ): Promise<boolean>;
  getAvailableDates(
    propertyId: string,
    month: number,
    year: number,
  ): Promise<Date[]>;

  // Property images
  uploadPropertyImages(
    propertyId: string,
    files: File[],
  ): Promise<{ imageUrls: string[] }>;
  deletePropertyImage(propertyId: string, imageId: string): Promise<void>;
  setPrimaryImage(propertyId: string, imageId: string): Promise<void>;

  // Property amenities
  addAmenity(propertyId: string, amenity: string): Promise<void>;
  removeAmenity(propertyId: string, amenityId: string): Promise<void>;
  updateAmenities(propertyId: string, amenities: string[]): Promise<void>;

  // Property validation
  validatePropertyData(
    propertyData: any,
  ): Promise<{ isValid: boolean; errors: string[] }>;
  validatePropertyImages(
    files: File[],
  ): Promise<{ isValid: boolean; errors: string[] }>;

  // Property recommendations
  getRecommendedProperties(userId: string, limit?: number): Promise<Property[]>;
  getPopularProperties(limit?: number): Promise<Property[]>;

  // Property caching
  cacheProperty(property: Property): void;
  getCachedProperty(id: string): Property | null;
  clearPropertyCache(): void;
}
