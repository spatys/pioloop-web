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
      roomType: request.roomType || "",
      maxGuests: request.maxGuests,
      bedrooms: request.bedrooms,
      beds: request.beds,
      bathrooms: request.bathrooms,
      address: request.address,
      city: request.city,
      postalCode: request.postalCode || "",
      latitude: undefined,
      longitude: undefined,
      pricePerNight: request.pricePerNight,
      cleaningFee: request.cleaningFee,
      serviceFee: request.serviceFee,
      isInstantBookable: request.isInstantBookable,
      status: "Available",
      ownerId: request.ownerId,
      ownerName: "Current User", // À remplacer par les vraies données utilisateur
      ownerEmail: "user@example.com", // À remplacer par les vraies données utilisateur
      imageUrls: request.imageUrls || [],
      amenities: request.amenities || [],
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
      ...request,
      updatedAt: new Date().toISOString()
    };

    return updatedProperty;
  }

  async getLatestProperties(limit: number): Promise<PropertyResponse[]> {
    return await this.propertyRepository.getLatestProperties(limit);
  }
}
