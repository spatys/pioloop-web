import { useState, useEffect } from 'react';
import { Amenity } from '@/core/types/Amenity';
import { getAmenityService } from '@/core/di/container';

export const useAmenities = () => {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        setLoading(true);
        setError(null);
        const amenityService = getAmenityService();
        const data = await amenityService.getAllAmenities();
        setAmenities(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch amenities');
      } finally {
        setLoading(false);
      }
    };

    fetchAmenities();
  }, []);

  return { amenities, loading, error };
};