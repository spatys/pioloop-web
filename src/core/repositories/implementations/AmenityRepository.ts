import { injectable, inject } from 'inversify';
import { TYPES } from '@/core/di/types';
import type { IAmenityRepository } from '../interfaces/IAmenityRepository';
import type { IHttpClient } from '../interfaces/IHttpClient';
import { Amenity } from '@/core/types/Amenity';

@injectable()
export class AmenityRepository implements IAmenityRepository {
  constructor(
    @inject(TYPES.IHttpClient) private httpClient: IHttpClient,
  ) {}

  async getAllAmenities(): Promise<Amenity[]> {
    // Appeler directement le backend Property au lieu de l'API route Next.js
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/api/amenity`);
    
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des équipements: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  }
}
