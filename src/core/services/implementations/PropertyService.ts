import { IPropertyRepository } from "../../repositories/interfaces/IPropertyRepository";
import { Property, PropertySearchCriteria, PropertySearchResponse, CreatePropertyRequest, UpdatePropertyRequest } from "../../types/Property";

export class PropertyService {
  constructor(private propertyRepository: IPropertyRepository) {}

  // Search properties with filters and pagination
  async searchProperties(searchCriteria: PropertySearchCriteria): Promise<PropertySearchResponse> {
    return this.propertyRepository.searchProperties(searchCriteria);
  }

  // Get property by ID
  async getPropertyById(id: string): Promise<Property | null> {
    return this.propertyRepository.getPropertyById(id);
  }

  // Create a new property
  async createProperty(createPropertyRequest: CreatePropertyRequest): Promise<Property> {
    return this.propertyRepository.createProperty(createPropertyRequest);
  }

  // Update an existing property
  async updateProperty(id: string, updatePropertyRequest: UpdatePropertyRequest): Promise<Property> {
    return this.propertyRepository.updateProperty(id, updatePropertyRequest);
  }
}
