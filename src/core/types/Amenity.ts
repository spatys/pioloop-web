export interface Amenity {
  id: number;
  name: string;
  category: string;
  icon: string;
  isActive: boolean;
}

export interface AmenityResponse {
  data: Amenity[];
  success: boolean;
  message?: string;
}