import { PropertyResponse } from "@/core/types/Property";
import { PropertySearchCriteria, PropertySearchResponse } from "@/core/types/Property";
import { CreatePropertyRequest } from "@/core/types/Property";

export interface IPropertyRepository {
  searchProperties(criteria: PropertySearchCriteria): Promise<PropertySearchResponse>;
  getPropertyById(id: string): Promise<PropertyResponse | null>;
  createProperty(request: CreatePropertyRequest): Promise<PropertyResponse>;
  updateProperty(id: string, request: Partial<CreatePropertyRequest>): Promise<PropertyResponse | null>;
  getPopularProperties(limit: number): Promise<PropertyResponse[]>;
  getPropertiesByOwnerId(ownerId: string): Promise<PropertyResponse[]>;
}
