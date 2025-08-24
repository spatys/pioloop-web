import { IPropertyRepository } from "../interfaces/IPropertyRepository";
import { Property, PropertySearchCriteria, PropertySearchResponse, CreatePropertyRequest, UpdatePropertyRequest } from "../../types/Property";
import { properties } from "../../data/properties";

export class PropertyRepository implements IPropertyRepository {
  
  // Search properties with filters and pagination
  async searchProperties(searchCriteria: PropertySearchCriteria): Promise<PropertySearchResponse> {
    // Utiliser directement les données locales
    let filteredProperties = [...properties];
    
    // Filtrer par localisation
    if (searchCriteria.location) {
      filteredProperties = filteredProperties.filter((property: Property) => 
        property.city.toLowerCase().includes(searchCriteria.location!.toLowerCase()) ||
        property.address.toLowerCase().includes(searchCriteria.location!.toLowerCase())
      );
    }
    
    // Pagination
    const page = searchCriteria.page || 1;
    const pageSize = searchCriteria.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProperties = filteredProperties.slice(startIndex, endIndex);
    
    return {
      properties: paginatedProperties,
      totalCount: filteredProperties.length,
      page,
      pageSize,
      totalPages: Math.ceil(filteredProperties.length / pageSize)
    };
  }

  // async searchProperties(searchCriteria: PropertySearchCriteria): Promise<PropertySearchResponse> {
  //   try {
  //     // Appeler l'API Gateway
  //     // En production, ceci serait un appel à l'endpoint /api/property/search via l'API Gateway
  //     const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/property/search`;
      
  //     const queryParams = new URLSearchParams();
  //     if (searchCriteria.location) queryParams.append('location', searchCriteria.location);
  //     if (searchCriteria.checkIn) queryParams.append('checkIn', searchCriteria.checkIn);
  //     if (searchCriteria.checkOut) queryParams.append('checkOut', searchCriteria.checkOut);
  //     if (searchCriteria.guests) queryParams.append('guests', searchCriteria.guests.toString());
  //     if (searchCriteria.page) queryParams.append('page', searchCriteria.page.toString());
  //     if (searchCriteria.pageSize) queryParams.append('pageSize', searchCriteria.pageSize.toString());

  //     const response = await fetch(`${apiUrl}?${queryParams.toString()}`);
      
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }
      
  //     const result: PropertySearchResponse = await response.json();
  //     return result;
      
  //   } catch (error) {
  //     console.error('Error searching properties:', error);
      
  //     // Fallback vers les données locales
  //     let filteredProperties = [...cityProperties];
      
  //     // Filtrer par localisation
  //     if (searchCriteria.location) {
  //       filteredProperties = filteredProperties.filter((property: Property) => 
  //         property.city.toLowerCase().includes(searchCriteria.location!.toLowerCase()) ||
  //         property.address.toLowerCase().includes(searchCriteria.location!.toLowerCase())
  //       );
  //     }
      
  //     // Pagination
  //     const page = searchCriteria.page || 1;
  //     const pageSize = searchCriteria.pageSize || 10;
  //     const startIndex = (page - 1) * pageSize;
  //     const endIndex = startIndex + pageSize;
  //     const paginatedProperties = filteredProperties.slice(startIndex, endIndex);
      
  //     return {
  //       properties: paginatedProperties,
  //       totalCount: filteredProperties.length,
  //       page,
  //       pageSize,
  //       totalPages: Math.ceil(filteredProperties.length / pageSize)
  //     };
  //   }
  // }
  
  // Get latest properties (most recently added)
  async getLatestProperties(limit: number): Promise<Property[]> {
    try {
      // Appeler l'API Gateway
      // En production, ceci serait un appel à l'endpoint /api/property/latest via l'API Gateway
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/property/latest?limit=${limit}`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const properties: Property[] = await response.json();
      return properties;
      
    } catch (error) {
      console.error('Error getting latest properties:', error);
      
      // Fallback vers les données locales avec tri par date de création
      const sortedProperties = [...properties]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);
      
      return sortedProperties;
    }
  }

  // Get property by ID
  async getPropertyById(id: string): Promise<Property | null> {
    try {
      // Appeler l'API Gateway
      // En production, ceci serait un appel à l'endpoint /api/property/{id} via l'API Gateway
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/property/${id}`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const property: Property = await response.json();
      return property;
      
    } catch (error) {
      console.error('Error getting property by ID:', error);
      
      // Fallback vers les données locales
      return properties.find((property: Property) => property.id === id) || null;
    }
  }
  
  // Create a new property
  async createProperty(createPropertyRequest: CreatePropertyRequest): Promise<Property> {
    try {
      // Appeler l'API Gateway
      // En production, ceci serait un appel à l'endpoint POST /api/property via l'API Gateway
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/property`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createPropertyRequest),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const property: Property = await response.json();
      return property;
      
    } catch (error) {
      console.error('Error creating property:', error);
      throw new Error('Failed to create property');
    }
  }
  
  // Update an existing property
  async updateProperty(id: string, updatePropertyRequest: UpdatePropertyRequest): Promise<Property> {
    try {
      // Appeler l'API Gateway
      // En production, ceci serait un appel à l'endpoint PUT /api/property/{id} via l'API Gateway
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/property/${id}`;
      
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePropertyRequest),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const property: Property = await response.json();
      return property;
      
    } catch (error) {
      console.error('Error updating property:', error);
      throw new Error('Failed to update property');
    }
  }
}
