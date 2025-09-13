import type { IPropertyRepository } from "../interfaces/IPropertyRepository";
import type { PropertySearchCriteria } from "@/core/types/Property";
import type { PropertySearchResponse } from "@/core/types/Property";
import type { CreatePropertyRequest } from "@/core/types/Property";
import type { PropertyResponse } from "@/core/types/Property";
import { injectable, inject } from "inversify";
import { TYPES } from "@/core/di/types";
import type { IHttpClient } from "../interfaces/IHttpClient";
import { ApiResponse } from "@/core/types";
import { Properties } from "@/core/data/properties";

@injectable()
export class PropertyRepository implements IPropertyRepository {
  private mapPropertyToPropertyResponse(property: any): PropertyResponse {
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
      neighborhood: property.neighborhood,
      city: property.city,
      postalCode: property.postalCode,
      country: property.country || 'Cameroun', // Valeur par défaut pour le pays
      latitude: property.latitude,
      longitude: property.longitude,
      pricePerNight: property.pricePerNight,
      cleaningFee: property.cleaningFee,
      serviceFee: property.serviceFee,
      status: property.status,
      ownerId: property.ownerId,
      images: property.images || [],
      amenities: property.amenities || [],
      averageRating: property.averageRating,
      reviewCount: property.reviewCount,
      createdAt: property.createdAt.toISOString(),
      updatedAt: property.updatedAt.toISOString()
    };
  }
  constructor(
    @inject(TYPES.IHttpClient) private httpClient: IHttpClient,
  ) {}

  async searchProperties(
    criteria: PropertySearchCriteria,
  ): Promise<PropertySearchResponse> {
    // Utiliser les données mock
    let filteredProperties = [...Properties];
    
    // Filtrer par localisation si spécifiée
    if (criteria.location) {
      filteredProperties = filteredProperties.filter(property =>
        property.city.toLowerCase().includes(criteria.location!.toLowerCase()) ||
        property.neighborhood.toLowerCase().includes(criteria.location!.toLowerCase())
      );
    }
    
    // Filtrer par nombre de voyageurs si spécifié
    if (criteria.guests) {
      filteredProperties = filteredProperties.filter(property =>
        property.maxGuests >= criteria.guests!
      );
    }
    
    // Pagination
    const page = criteria.page || 1;
    const pageSize = criteria.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProperties = filteredProperties.slice(startIndex, endIndex);
    
    return {
      properties: paginatedProperties.map(property => this.mapPropertyToPropertyResponse(property)),
      totalCount: filteredProperties.length,
      page: page,
      pageSize: pageSize,
      totalPages: Math.ceil(filteredProperties.length / pageSize),
    };
  }

  async getPropertyById(id: string): Promise<PropertyResponse | null> {
    // Utiliser les données mock
    const property = Properties.find(p => p.id === id);
    if (!property) return null;
    
    return this.mapPropertyToPropertyResponse(property);
  }

  async createProperty(
    request: CreatePropertyRequest,
  ): Promise<PropertyResponse> {
    // Appeler directement l'API des microservices via l'API Gateway
    const response = await this.httpClient.post<PropertyResponse>('/api/properties/create', request);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Erreur lors de la création de la propriété');
  }

  async updateProperty(
    id: string,
    request: Partial<CreatePropertyRequest>,
  ): Promise<PropertyResponse | null> {
    const response = await this.httpClient.put<PropertyResponse>(`/api/property/${id}`, request);
    
    if (response.success && response.data) {
      return response.data;
    }
    
      return null;
  }

  async getPopularProperties(limit: number): Promise<PropertyResponse[]> {
    // Simuler la récupération des logements populaires (par prix, date de création, etc.)
    const popularProperties = Properties
      .sort((a, b) => {
        // Trier par prix décroissant comme indicateur de popularité
        return b.pricePerNight - a.pricePerNight;
      })
      .slice(0, limit);

    return popularProperties.map(property => this.mapPropertyToPropertyResponse(property));
  }

  async getPropertiesByOwnerId(ownerId: string): Promise<PropertyResponse[]> {
    // Appeler directement l'API des microservices via l'API Gateway
    const response = await this.httpClient.get<PropertyResponse[]>(`/api/property/owner/${ownerId}`);
  
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Erreur lors de la récupération des propriétés par owner');
  }
}
