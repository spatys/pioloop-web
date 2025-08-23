import { IPropertyService } from "../interfaces/IPropertyService";
import {
  Property,
  PropertySearchForm,
  PropertyFilters,
  PaginatedResponse,
} from "../../types";
import { propertyRepository } from "../../repositories/implementations/PropertyRepository";

export class PropertyService implements IPropertyService {
  private propertyCache = new Map<string, Property>();

  async getProperties(
    filters?: PropertyFilters,
  ): Promise<PaginatedResponse<Property>> {
    return await propertyRepository.getProperties(filters as any);
  }

  async getProperty(id: string): Promise<Property> {
    // Check cache first
    const cached = this.getCachedProperty(id);
    if (cached) return cached;

    const response = await propertyRepository.getProperty(id);
    if (!response.success) {
      throw new Error(response.message || "Failed to fetch property");
    }

    // Cache the property
    this.cacheProperty(response.data);
    return response.data;
  }

  async createProperty(propertyData: any): Promise<Property> {
    const response = await propertyRepository.createProperty(propertyData);
    if (!response.success) {
      throw new Error(response.message || "Failed to create property");
    }
    return response.data;
  }

  async updateProperty(id: string, propertyData: any): Promise<Property> {
    const response = await propertyRepository.updateProperty(id, propertyData);
    if (!response.success) {
      throw new Error(response.message || "Failed to update property");
    }

    // Update cache
    this.cacheProperty(response.data);
    return response.data;
  }

  async deleteProperty(id: string): Promise<void> {
    const response = await propertyRepository.deleteProperty(id);
    if (!response.success) {
      throw new Error(response.message || "Failed to delete property");
    }

    // Remove from cache
    this.propertyCache.delete(id);
  }

  async searchProperties(
    searchParams: PropertySearchForm,
  ): Promise<PaginatedResponse<Property>> {
    return await propertyRepository.getProperties(searchParams);
  }

  async getFeaturedProperties(limit: number = 6): Promise<Property[]> {
    const response = await propertyRepository.getFeaturedProperties(limit);
    if (!response.success) {
      throw new Error(
        response.message || "Failed to fetch featured properties",
      );
    }
    return response.data;
  }

  async getSimilarProperties(
    propertyId: string,
    limit: number = 4,
  ): Promise<Property[]> {
    const response = await propertyRepository.getSimilarProperties(
      propertyId,
      limit,
    );
    if (!response.success) {
      throw new Error(response.message || "Failed to fetch similar properties");
    }
    return response.data;
  }

  async getMyProperties(): Promise<Property[]> {
    const response = await propertyRepository.getMyProperties();
    if (!response.success) {
      throw new Error(response.message || "Failed to fetch my properties");
    }
    return response.data;
  }

  async getPropertiesByOwner(ownerId: string): Promise<Property[]> {
    const response = await propertyRepository.getPropertiesByOwner(ownerId);
    if (!response.success) {
      throw new Error(
        response.message || "Failed to fetch properties by owner",
      );
    }
    return response.data;
  }

  async getPropertyStats(propertyId: string): Promise<any> {
    const response = await propertyRepository.getPropertyStats(propertyId);
    if (!response.success) {
      throw new Error(response.message || "Failed to fetch property stats");
    }
    return response.data;
  }

  async getPropertyAnalytics(
    propertyId: string,
    dateRange?: { start: Date; end: Date },
  ): Promise<any> {
    // This would be implemented with analytics service
    throw new Error("Property analytics not implemented");
  }

  async checkAvailability(
    propertyId: string,
    checkIn: Date,
    checkOut: Date,
  ): Promise<boolean> {
    // This would be implemented with availability service
    throw new Error("Availability check not implemented");
  }

  async getAvailableDates(
    propertyId: string,
    month: number,
    year: number,
  ): Promise<Date[]> {
    // This would be implemented with availability service
    throw new Error("Available dates not implemented");
  }

  async uploadPropertyImages(
    propertyId: string,
    files: File[],
  ): Promise<{ imageUrls: string[] }> {
    // This would be implemented with file upload service
    throw new Error("Image upload not implemented");
  }

  async deletePropertyImage(
    propertyId: string,
    imageId: string,
  ): Promise<void> {
    // This would be implemented with file service
    throw new Error("Image deletion not implemented");
  }

  async setPrimaryImage(propertyId: string, imageId: string): Promise<void> {
    // This would be implemented with file service
    throw new Error("Primary image setting not implemented");
  }

  async addAmenity(propertyId: string, amenity: string): Promise<void> {
    // This would be implemented with property update
    throw new Error("Amenity addition not implemented");
  }

  async removeAmenity(propertyId: string, amenityId: string): Promise<void> {
    // This would be implemented with property update
    throw new Error("Amenity removal not implemented");
  }

  async updateAmenities(
    propertyId: string,
    amenities: string[],
  ): Promise<void> {
    // This would be implemented with property update
    throw new Error("Amenities update not implemented");
  }

  async validatePropertyData(
    propertyData: any,
  ): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (!propertyData.title?.trim()) {
      errors.push("Property title is required");
    }

    if (!propertyData.description?.trim()) {
      errors.push("Property description is required");
    }

    if (!propertyData.address?.street?.trim()) {
      errors.push("Property address is required");
    }

    if (!propertyData.pricePerNight || propertyData.pricePerNight <= 0) {
      errors.push("Valid price per night is required");
    }

    if (!propertyData.bedrooms || propertyData.bedrooms <= 0) {
      errors.push("Number of bedrooms is required");
    }

    if (!propertyData.bathrooms || propertyData.bathrooms <= 0) {
      errors.push("Number of bathrooms is required");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  async validatePropertyImages(
    files: File[],
  ): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (files.length === 0) {
      errors.push("At least one image is required");
    }

    if (files.length > 10) {
      errors.push("Maximum 10 images allowed");
    }

    files.forEach((file, index) => {
      if (file.size > maxSize) {
        errors.push(`Image ${index + 1} is too large (max 5MB)`);
      }

      if (allowedTypes.indexOf(file.type) === -1) {
        errors.push(
          `Image ${index + 1} has invalid format (JPEG, PNG, WebP only)`,
        );
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  async getRecommendedProperties(
    userId: string,
    limit: number = 6,
  ): Promise<Property[]> {
    // This would be implemented with recommendation service
    throw new Error("Property recommendations not implemented");
  }

  async getPopularProperties(limit: number = 6): Promise<Property[]> {
    // This would be implemented with analytics service
    throw new Error("Popular properties not implemented");
  }

  cacheProperty(property: Property): void {
    this.propertyCache.set(property.id, property);
  }

  getCachedProperty(id: string): Property | null {
    return this.propertyCache.get(id) || null;
  }

  clearPropertyCache(): void {
    this.propertyCache.clear();
  }
}

export const propertyService = new PropertyService();
