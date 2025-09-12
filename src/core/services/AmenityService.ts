import { injectable, inject } from 'inversify';
import type { Amenity } from '@/core/types/Amenity';
import type { IAmenityRepository } from '../repositories/AmenityRepository';
import { TYPES } from '../di/types';

export interface IAmenityService {
  getAllAmenities(): Promise<Amenity[]>;
}

@injectable()
export class AmenityService implements IAmenityService {
  constructor(
    @inject(TYPES.IAmenityRepository) private amenityRepository: IAmenityRepository
  ) {}

  async getAllAmenities(): Promise<Amenity[]> {
    return await this.amenityRepository.getAllAmenities();
  }
}