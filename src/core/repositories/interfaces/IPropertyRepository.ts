import type { PropertySearchCriteria } from "@/core/types/Property";
import type { PropertySearchResponse } from "@/core/types/Property";
import type { CreatePropertyRequest } from "@/core/types/Property";
import type { PropertyResponse } from "@/core/types/Property";

export interface IPropertyRepository {
  searchProperties(
    criteria: PropertySearchCriteria,
  ): Promise<PropertySearchResponse>;
  getPropertyById(id: string): Promise<PropertyResponse | null>;
  createProperty(request: CreatePropertyRequest): Promise<PropertyResponse>;
  updateProperty(
    id: string,
    request: Partial<CreatePropertyRequest>,
  ): Promise<PropertyResponse | null>;
  getLatestProperties(limit: number): Promise<PropertyResponse[]>;
}
