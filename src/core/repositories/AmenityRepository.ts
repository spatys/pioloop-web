import { injectable } from 'inversify';
import { Amenity, AmenityResponse } from '@/core/types/Amenity';

export interface IAmenityRepository {
  getAllAmenities(): Promise<Amenity[]>;
}

@injectable()
export class AmenityRepository implements IAmenityRepository {
  private baseUrl: string;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') {
    this.baseUrl = baseUrl;
  }

  async getAllAmenities(): Promise<Amenity[]> {
    const response = await fetch(`${this.baseUrl}/api/amenity`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Pour inclure les cookies d'authentification
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch amenities: ${response.status} ${response.statusText}`);
    }

    const data: Amenity[] = await response.json();
    return data;
  }
}
