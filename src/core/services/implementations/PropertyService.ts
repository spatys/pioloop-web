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
    @inject(TYPES.IPropertyRepository)
    private propertyRepository: IPropertyRepository,
  ) {}

  async searchProperties(
    criteria: PropertySearchCriteria,
  ): Promise<PropertySearchResponse> {
    return await this.propertyRepository.searchProperties(criteria);
  }

  async getPropertyById(id: string): Promise<PropertyResponse | null> {
    return await this.propertyRepository.getPropertyById(id);
  }

  async createProperty(
    request: CreatePropertyRequest,
  ): Promise<PropertyResponse> {
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
      imageUrls: request.images?.map((img) => img.imageUrl) || [],
      amenities: request.amenities?.map((amenity) => amenity.name) || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Ici, vous appelleriez normalement le repository pour sauvegarder
    // await this.propertyRepository.createProperty(newProperty);

    return newProperty;
  }

  async updateProperty(
    id: string,
    request: Partial<CreatePropertyRequest>,
  ): Promise<PropertyResponse | null> {
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
    return await this.propertyRepository.getLatestProperties(limit);
  }

  async getPropertiesByOwnerId(ownerId: string): Promise<PropertyResponse[]> {
    // TODO: Implémenter l'appel API pour récupérer les propriétés d'un propriétaire spécifique
    // Appel API: GET /api/properties/owner/{ownerId}
    
    // Pour l'instant, retourner des données mockées filtrées par ownerId
    const mockProperties: PropertyResponse[] = [
      {
        id: "1",
        title: "Appartement moderne au cœur de Paris",
        description: "Magnifique appartement rénové avec vue sur la Tour Eiffel",
        propertyType: "Appartement",
        maxGuests: 4,
        bedrooms: 2,
        beds: 2,
        bathrooms: 1,
        squareMeters: 80,
        address: "123 Rue de la Paix",
        city: "Paris",
        postalCode: "75001",
        latitude: 48.8566,
        longitude: 2.3522,
        pricePerNight: 150,
        cleaningFee: 50,
        serviceFee: 20,
        status: "PendingApproval",
        ownerId: ownerId,
        ownerName: "Propriétaire actuel",
        ownerEmail: "owner@example.com",
        imageUrls: ["/images/placeholder-property.jpg"],
        amenities: ["WiFi", "Cuisine", "Parking"],
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z",
      },
      {
        id: "2",
        title: "Maison de campagne avec piscine",
        description: "Belle maison traditionnelle avec jardin et piscine",
        propertyType: "Maison",
        maxGuests: 6,
        bedrooms: 3,
        beds: 3,
        bathrooms: 2,
        squareMeters: 150,
        address: "456 Chemin des Fleurs",
        city: "Lyon",
        postalCode: "69001",
        latitude: 45.7578,
        longitude: 4.8320,
        pricePerNight: 200,
        cleaningFee: 80,
        serviceFee: 25,
        status: "Published",
        ownerId: ownerId,
        ownerName: "Propriétaire actuel",
        ownerEmail: "owner@example.com",
        imageUrls: ["/images/placeholder-property.jpg"],
        amenities: ["WiFi", "Cuisine", "Parking", "Piscine", "Jardin"],
        createdAt: "2024-01-10T14:20:00Z",
        updatedAt: "2024-01-10T14:20:00Z",
      },
      {
        id: "3",
        title: "Studio cosy près de la plage",
        description: "Studio moderne à 5 minutes de la plage",
        propertyType: "Studio",
        maxGuests: 2,
        bedrooms: 1,
        beds: 1,
        bathrooms: 1,
        squareMeters: 45,
        address: "789 Avenue de la Mer",
        city: "Nice",
        postalCode: "06000",
        latitude: 43.7102,
        longitude: 7.2620,
        pricePerNight: 120,
        cleaningFee: 40,
        serviceFee: 15,
        status: "Rented",
        ownerId: ownerId,
        ownerName: "Propriétaire actuel",
        ownerEmail: "owner@example.com",
        imageUrls: ["/images/placeholder-property.jpg"],
        amenities: ["WiFi", "Cuisine", "Balcon"],
        createdAt: "2024-01-05T09:15:00Z",
        updatedAt: "2024-01-05T09:15:00Z",
      }
    ];

    return mockProperties;
  }
}
