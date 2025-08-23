import { PropertyType } from "./Property";

export interface PropertyFilters {
  location?: string;
  checkIn?: Date;
  checkOut?: Date;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: PropertyType[];
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
}

export interface PropertySearchForm {
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: PropertyType[];
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
}

export interface SortOptions {
  field: string;
  direction: "asc" | "desc";
}

export interface PaginationParams {
  pageNumber: number;
  pageSize: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}
