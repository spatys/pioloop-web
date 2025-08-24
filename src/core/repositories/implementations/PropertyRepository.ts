import type { IPropertyRepository } from "../interfaces/IPropertyRepository";
import type { PropertySearchCriteria } from "@/core/types/Property";
import type { PropertySearchResponse } from "@/core/types/Property";
import type { CreatePropertyRequest } from "@/core/types/Property";
import type { PropertyResponse } from "@/core/types/Property";
import { properties } from "@/core/data/properties";

export class PropertyRepository implements IPropertyRepository {
  async searchProperties(criteria: PropertySearchCriteria): Promise<PropertySearchResponse> {
    // Simulation d'une recherche avec filtres
    let filteredProperties = [...properties];

    if (criteria.location) {
      filteredProperties = filteredProperties.filter(p => 
        p.city.toLowerCase().includes(criteria.location!.toLowerCase())
      );
    }

    if (criteria.dateRange?.startDate && criteria.dateRange?.endDate) {
      // Logique de filtrage par date (simplifiée)
      filteredProperties = filteredProperties.filter(p => p.isAvailable);
    }

    if (criteria.travelers) {
      filteredProperties = filteredProperties.filter(p => p.maxGuests >= criteria.travelers!);
    }

    // Pagination
    const total = filteredProperties.length;
    const startIndex = (criteria.page - 1) * criteria.pageSize;
    const endIndex = startIndex + criteria.pageSize;
    const paginatedProperties = filteredProperties.slice(startIndex, endIndex);

    // Conversion vers PropertyResponse
    const propertyResponses: PropertyResponse[] = paginatedProperties.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      propertyType: p.propertyType,
      roomType: p.roomType,
      maxGuests: p.maxGuests,
      bedrooms: p.bedrooms,
      beds: p.beds,
      bathrooms: p.bathrooms,
      address: p.address,
      city: p.city,
      postalCode: p.postalCode,
      latitude: p.latitude,
      longitude: p.longitude,
      pricePerNight: p.pricePerNight,
      cleaningFee: p.cleaningFee,
      serviceFee: p.serviceFee,
      isInstantBookable: p.isInstantBookable,
      status: p.isAvailable ? "Available" : "Unavailable",
      ownerId: p.ownerId,
      ownerName: p.ownerName,
      ownerEmail: p.ownerEmail,
      imageUrls: p.imageUrls,
      amenities: p.amenities,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString()
    }));

    return {
      properties: propertyResponses,
      total,
      page: criteria.page,
      pageSize: criteria.pageSize,
      totalPages: Math.ceil(total / criteria.pageSize)
    };
  }

  async getPropertyById(id: string): Promise<PropertyResponse | null> {
    const property = properties.find(p => p.id === id);
    if (!property) return null;

    return {
      id: property.id,
      title: property.title,
      description: property.description,
      propertyType: property.propertyType,
      roomType: property.roomType,
      maxGuests: property.maxGuests,
      bedrooms: property.bedrooms,
      beds: property.beds,
      bathrooms: property.bathrooms,
      address: property.address,
      city: property.city,
      postalCode: property.postalCode,
      latitude: property.latitude,
      longitude: property.longitude,
      pricePerNight: property.pricePerNight,
      cleaningFee: property.cleaningFee,
      serviceFee: property.serviceFee,
      isInstantBookable: property.isInstantBookable,
      status: property.isAvailable ? "Available" : "Unavailable",
      ownerId: property.ownerId,
      ownerName: property.ownerName,
      ownerEmail: property.ownerEmail,
      imageUrls: property.imageUrls,
      amenities: property.amenities,
      createdAt: property.createdAt.toISOString(),
      updatedAt: property.updatedAt.toISOString()
    };
  }

  async createProperty(request: CreatePropertyRequest): Promise<PropertyResponse> {
    // Simulation de la création d'une propriété
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

    // Ici, vous ajouteriez normalement la propriété à la base de données
    // properties.push(newProperty);
    
    return newProperty;
  }

  async updateProperty(id: string, request: Partial<CreatePropertyRequest>): Promise<PropertyResponse | null> {
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
    // Trier par date de création (plus récent en premier)
    const sortedProperties = [...properties]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);

    // Conversion vers PropertyResponse
    return sortedProperties.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      propertyType: p.propertyType,
      roomType: p.roomType,
      maxGuests: p.maxGuests,
      bedrooms: p.bedrooms,
      beds: p.beds,
      bathrooms: p.bathrooms,
      address: p.address,
      city: p.city,
      postalCode: p.postalCode,
      latitude: p.latitude,
      longitude: p.longitude,
      pricePerNight: p.pricePerNight,
      cleaningFee: p.cleaningFee,
      serviceFee: p.serviceFee,
      isInstantBookable: p.isInstantBookable,
      status: p.isAvailable ? "Available" : "Unavailable",
      ownerId: p.ownerId,
      ownerName: p.ownerName,
      ownerEmail: p.ownerEmail,
      imageUrls: p.imageUrls,
      amenities: p.amenities,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString()
    }));
  }
}
