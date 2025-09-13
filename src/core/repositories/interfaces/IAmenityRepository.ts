import { Amenity } from '@/core/types/Amenity';

export interface IAmenityRepository {
  getAllAmenities(): Promise<Amenity[]>;
}
