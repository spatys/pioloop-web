export interface Amenity {
  id: number;
  name: string;
  category: string;
  isActive: boolean;
}

export interface AmenityResponse {
  data: Amenity[];
  success: boolean;
  message?: string;
}