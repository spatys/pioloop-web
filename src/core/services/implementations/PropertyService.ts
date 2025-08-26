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
    return await this.propertyRepository.createProperty(request);
  }

  async updateProperty(
    id: string,
    request: Partial<CreatePropertyRequest>,
  ): Promise<PropertyResponse | null> {
    return await this.propertyRepository.updateProperty(id, request);
  }

  async getLatestProperties(limit: number): Promise<PropertyResponse[]> {
    return await this.propertyRepository.getLatestProperties(limit);
  }

  async getPropertiesByOwnerId(ownerId: string): Promise<PropertyResponse[]> {
    return await this.propertyRepository.getPropertiesByOwnerId(ownerId);
  }
}
