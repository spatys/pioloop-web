import { Property, PropertySearchCriteria, PropertySearchResponse, CreatePropertyRequest, UpdatePropertyRequest } from "../../types/Property";

export interface IPropertyService {
  // Search properties with filters and pagination
  searchProperties(searchCriteria: PropertySearchCriteria): Promise<PropertySearchResponse>;
  
  // Get property by ID
  getPropertyById(id: string): Promise<Property | null>;
  
  // Get latest properties (most recently added)
  getLatestProperties(limit: number): Promise<Property[]>;
  
  // Create a new property
  createProperty(createPropertyRequest: CreatePropertyRequest): Promise<Property>;
  
  // Update an existing property
  updateProperty(id: string, updatePropertyRequest: UpdatePropertyRequest): Promise<Property>;
}
