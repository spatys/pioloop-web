import { useState, useEffect, useCallback } from "react";
import { Property } from "@/core/types/Property";
import { getPropertyService } from "@/core/di/container";

export const useLatestProperties = (limit: number = 5) => {
  const [latestProperties, setLatestProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLatestProperties = useCallback(async () => {
    try {
      setError(null);
      const propertyService = getPropertyService();
      const properties = await propertyService.getLatestProperties(limit);
      setLatestProperties(properties);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la récupération des logements');
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchLatestProperties();
  }, [fetchLatestProperties]);

  return {
    latestProperties,
    isLoading,
    error,
    refetch: () => {
      setIsLoading(true);
      setError(null);
      fetchLatestProperties();
    }
  };
};
