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
    const response = await this.httpClient.get<Amenity[]>('/api/amenity');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Erreur lors de la récupération des équipements');
  }
}
