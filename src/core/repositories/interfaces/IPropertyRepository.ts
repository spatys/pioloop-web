import { Property, PropertySearchForm, PaginatedResponse, ApiResponse } from '../../types';

export interface IPropertyRepository {
  // Get all properties with optional search parameters
  getProperties(searchParams?: PropertySearchForm): Promise<PaginatedResponse<Property>>;
  
  // Get a single property by ID
  getProperty(id: string): Promise<ApiResponse<Property>>;
  
  // Create a new property
  createProperty(propertyData: any): Promise<ApiResponse<Property>>;
  
  // Update an existing property
  updateProperty(id: string, propertyData: any): Promise<ApiResponse<Property>>;
  
  // Delete a property
  deleteProperty(id: string): Promise<ApiResponse<void>>;
  
  // Get properties owned by the current user
  getMyProperties(): Promise<ApiResponse<Property[]>>;
  
  // Get featured properties
  getFeaturedProperties(limit?: number): Promise<ApiResponse<Property[]>>;
  
  // Get properties by owner
  getPropertiesByOwner(ownerId: string): Promise<ApiResponse<Property[]>>;
  
  // Get similar properties
  getSimilarProperties(propertyId: string, limit?: number): Promise<ApiResponse<Property[]>>;
  
  // Get property statistics
  getPropertyStats(propertyId: string): Promise<ApiResponse<any>>;
} 