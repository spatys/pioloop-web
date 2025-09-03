import { useState, useEffect, useCallback } from "react";
import { Property } from "@/core/types/Property";
import { getPropertyService } from "@/core/di/container";

export const usePopularProperties = (limit: number = 5) => {
  const [popularProperties, setPopularProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPopularProperties = useCallback(async () => {
    try {
      setError(null);
      const propertyService = getPropertyService();
      const properties = await propertyService.getPopularProperties(limit);
      setPopularProperties(properties);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la récupération des logements populaires",
      );
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchPopularProperties();
  }, [fetchPopularProperties]);

  return {
    popularProperties,
    isLoading,
    error,
    refetch: () => {
      setIsLoading(true);
      setError(null);
      fetchPopularProperties();
    },
  };
};
