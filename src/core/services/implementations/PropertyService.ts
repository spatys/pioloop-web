import type { IPropertyService } from "../interfaces/IPropertyService";
import type { IPropertyRepository } from "@/core/repositories/interfaces/IPropertyRepository";
import type { PropertySearchCriteria } from "@/core/types/Property";
import type { PropertySearchResponse } from "@/core/types/Property";
import type { CreatePropertyRequest } from "@/core/types/Property";
import type { PropertyResponse } from "@/core/types/Property";
import { injectable, inject } from "inversify";
import { TYPES } from "@/core/di/types";

@injectable()
export class PropertyService implements IPropertyService {
  constructor(
    @inject(TYPES.IPropertyRepository) private propertyRepository: IPropertyRepository
  ) {}

  async searchProperties(criteria: PropertySearchCriteria): Promise<PropertySearchResponse> {
    return await this.propertyRepository.searchProperties(criteria);
  }

  async getPropertyById(id: string): Promise<PropertyResponse | null> {
    return await this.propertyRepository.getPropertyById(id);
  }

  async createProperty(request: CreatePropertyRequest): Promise<PropertyResponse> {
    // Simuler la création d'une propriété avec un ID généré
    const newProperty: PropertyResponse = {
      id: crypto.randomUUID(),
      title: request.title,
      description: request.description,
      propertyType: request.propertyType,
      maxGuests: request.maxGuests,
      bedrooms: request.bedrooms,
      beds: request.beds,
      bathrooms: request.bathrooms,
      squareMeters: request.squareMeters,
      address: request.address,
      city: request.city,
      postalCode: request.postalCode,
      latitude: request.latitude,
      longitude: request.longitude,
      pricePerNight: request.pricePerNight,
      cleaningFee: request.cleaningFee,
      serviceFee: request.serviceFee,
      status: "Available",
      ownerId: request.ownerId || "",
      ownerName: "Current User", // À remplacer par les vraies données utilisateur
      ownerEmail: "user@example.com", // À remplacer par les vraies données utilisateur
      imageUrls: request.images?.map(img => img.imageUrl) || [],
      amenities: request.amenities?.map(amenity => amenity.name) || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Ici, vous appelleriez normalement le repository pour sauvegarder
    // await this.propertyRepository.createProperty(newProperty);
    
    return newProperty;
  }

  async updateProperty(id: string, request: Partial<CreatePropertyRequest>): Promise<PropertyResponse | null> {
    // Simuler la mise à jour
    const existingProperty = await this.getPropertyById(id);
    if (!existingProperty) {
      return null;
    }

    const updatedProperty: PropertyResponse = {
      ...existingProperty,
      title: request.title || existingProperty.title,
      description: request.description || existingProperty.description,
      propertyType: request.propertyType || existingProperty.propertyType,
      maxGuests: request.maxGuests || existingProperty.maxGuests,
      bedrooms: request.bedrooms || existingProperty.bedrooms,
      beds: request.beds || existingProperty.beds,
      bathrooms: request.bathrooms || existingProperty.bathrooms,
      squareMeters: request.squareMeters || existingProperty.squareMeters,
      address: request.address || existingProperty.address,
      city: request.city || existingProperty.city,
      postalCode: request.postalCode || existingProperty.postalCode,
      latitude: request.latitude || existingProperty.latitude,
      longitude: request.longitude || existingProperty.longitude,
      pricePerNight: request.pricePerNight || existingProperty.pricePerNight,
      cleaningFee: request.cleaningFee || existingProperty.cleaningFee,
      serviceFee: request.serviceFee || existingProperty.serviceFee,
      imageUrls: request.images?.map(img => img.imageUrl) || existingProperty.imageUrls,
      amenities: request.amenities?.map(amenity => amenity.name) || existingProperty.amenities,
      updatedAt: new Date().toISOString()
    };

    return updatedProperty;
  }

  async getLatestProperties(limit: number): Promise<PropertyResponse[]> {
    return await this.propertyRepository.getLatestProperties(limit);
  }
}
