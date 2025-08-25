import type { IPropertyRepository } from "../interfaces/IPropertyRepository";
import type { PropertySearchCriteria } from "@/core/types/Property";
import type { PropertySearchResponse } from "@/core/types/Property";
import type { CreatePropertyRequest } from "@/core/types/Property";
import type { PropertyResponse } from "@/core/types/Property";
import { properties } from "@/core/data/properties";

export class PropertyRepository implements IPropertyRepository {
  async searchProperties(
    criteria: PropertySearchCriteria,
  ): Promise<PropertySearchResponse> {
    // Simulation d'une recherche avec filtres
    let filteredProperties = [...properties];
    
    if (criteria.location) {
      filteredProperties = filteredProperties.filter((p) =>
        p.city.toLowerCase().includes(criteria.location!.toLowerCase()),
      );
    }

    if (criteria.checkIn && criteria.checkOut) {
      // Logique de filtrage par date (simplifiée)
      filteredProperties = filteredProperties.filter(
        (p) => p.status === "Available",
      );
    }

    if (criteria.guests) {
      filteredProperties = filteredProperties.filter(
        (p) => p.maxGuests >= criteria.guests!,
      );
    }

    // Pagination avec valeurs par défaut
    const total = filteredProperties.length;
    const page = criteria.page || 1;
    const pageSize = criteria.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProperties = filteredProperties.slice(startIndex, endIndex);

    // Conversion vers PropertyResponse
    const propertyResponses: PropertyResponse[] = paginatedProperties.map(
      (p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        propertyType: p.propertyType,
        maxGuests: p.maxGuests,
        bedrooms: p.bedrooms,
        beds: p.beds,
        bathrooms: p.bathrooms,
        squareMeters: p.squareMeters,
        address: p.address,
        city: p.city,
        postalCode: p.postalCode,
        latitude: p.latitude,
        longitude: p.longitude,
        pricePerNight: p.pricePerNight,
        cleaningFee: p.cleaningFee,
        serviceFee: p.serviceFee,
        status: p.status,
        ownerId: p.ownerId,
        ownerName: p.ownerName,
        ownerEmail: p.ownerEmail,
        imageUrls: p.imageUrls,
        amenities: p.amenities,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      }),
    );
    
    return {
      properties: propertyResponses,
      totalCount: total,
      page: page,
      pageSize: pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async getPropertyById(id: string): Promise<PropertyResponse | null> {
    const property = properties.find((p) => p.id === id);
    if (!property) return null;

    return {
      id: property.id,
      title: property.title,
      description: property.description,
      propertyType: property.propertyType,
      maxGuests: property.maxGuests,
      bedrooms: property.bedrooms,
      beds: property.beds,
      bathrooms: property.bathrooms,
      squareMeters: property.squareMeters,
      address: property.address,
      city: property.city,
      postalCode: property.postalCode,
      latitude: property.latitude,
      longitude: property.longitude,
      pricePerNight: property.pricePerNight,
      cleaningFee: property.cleaningFee,
      serviceFee: property.serviceFee,
      status: property.status,
      ownerId: property.ownerId,
      ownerName: property.ownerName,
      ownerEmail: property.ownerEmail,
      imageUrls: property.imageUrls,
      amenities: property.amenities,
      createdAt: property.createdAt.toISOString(),
      updatedAt: property.updatedAt.toISOString(),
    };
  }

  async createProperty(
    request: CreatePropertyRequest,
  ): Promise<PropertyResponse> {
    // Simulation de la création d'une propriété
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
      imageUrls: request.images?.map((img) => img.imageUrl) || [],
      amenities: request.amenities?.map((amenity) => amenity.name) || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Ici, vous ajouteriez normalement la propriété à la base de données
    // properties.push(newProperty);

    return newProperty;
  }

  async updateProperty(
    id: string,
    request: Partial<CreatePropertyRequest>,
  ): Promise<PropertyResponse | null> {
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
      imageUrls:
        request.images?.map((img) => img.imageUrl) ||
        existingProperty.imageUrls,
      amenities:
        request.amenities?.map((amenity) => amenity.name) ||
        existingProperty.amenities,
      updatedAt: new Date().toISOString(),
    };

    return updatedProperty;
  }

  async getLatestProperties(limit: number): Promise<PropertyResponse[]> {
    // Trier par date de création (plus récent en premier)
    const sortedProperties = [...properties]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);

    // Conversion vers PropertyResponse
    return sortedProperties.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      propertyType: p.propertyType,
      maxGuests: p.maxGuests,
      bedrooms: p.bedrooms,
      beds: p.beds,
      bathrooms: p.bathrooms,
      squareMeters: p.squareMeters,
      address: p.address,
      city: p.city,
      postalCode: p.postalCode,
      latitude: p.latitude,
      longitude: p.longitude,
      pricePerNight: p.pricePerNight,
      cleaningFee: p.cleaningFee,
      serviceFee: p.serviceFee,
      status: p.status,
      ownerId: p.ownerId,
      ownerName: p.ownerName,
      ownerEmail: p.ownerEmail,
      imageUrls: p.imageUrls,
      amenities: p.amenities,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));
  }
}
