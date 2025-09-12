import { injectable, inject } from 'inversify';
import { Amenity } from '@/core/types/Amenity';
import { IAmenityRepository } from '@/core/repositories/AmenityRepository';
import { TYPES } from '@/core/di/types';

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