import { useState, useEffect } from 'react';
import { PropertyResponse } from '@/core/types/Property';
import { propertyService } from '@/core/services/implementations/PropertyService';

interface UsePropertyReturn {
  property: PropertyResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useProperty = (propertyId: string): UsePropertyReturn => {
  const [property, setProperty] = useState<PropertyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperty = async () => {
    if (!propertyId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await propertyService.getPropertyById(propertyId);
      setProperty(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setProperty(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [propertyId]);

  const refetch = () => {
    fetchProperty();
  };

  return {
    property,
    loading,
    error,
    refetch,
  };
};
