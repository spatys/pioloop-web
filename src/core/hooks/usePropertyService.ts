import { useState, useCallback } from "react";
import { PropertyService } from "../services";
import { PropertyRepository } from "../repositories";
import {
  Property,
  PropertySearchCriteria,
  PropertySearchResponse,
  CreatePropertyRequest,
  UpdatePropertyRequest,
  convertPropertyResponseToProperty,
} from "../types/Property";

// Instance du service
const propertyRepository = new PropertyRepository();
const propertyService = new PropertyService(propertyRepository);

export const usePropertyService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search properties
  const searchProperties = useCallback(
    async (
      searchCriteria: PropertySearchCriteria,
    ): Promise<PropertySearchResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const result = await propertyService.searchProperties(searchCriteria);
        return result;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue",
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Get property by ID
  const getPropertyById = useCallback(
    async (id: string): Promise<Property | null> => {
      setLoading(true);
      setError(null);

      try {
        const result = await propertyService.getPropertyById(id);
        return result ? convertPropertyResponseToProperty(result) : null;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue",
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Create property
  const createProperty = useCallback(
    async (
      createPropertyRequest: CreatePropertyRequest,
    ): Promise<Property | null> => {
      setLoading(true);
      setError(null);

      try {
        const result = await propertyService.createProperty(
          createPropertyRequest,
        );
        return result ? convertPropertyResponseToProperty(result) : null;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue",
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Update property
  const updateProperty = useCallback(
    async (
      id: string,
      updatePropertyRequest: UpdatePropertyRequest,
    ): Promise<Property | null> => {
      setLoading(true);
      setError(null);

      try {
        const result = await propertyService.updateProperty(
          id,
          updatePropertyRequest,
        );
        return result ? convertPropertyResponseToProperty(result) : null;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue",
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    searchProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    clearError,
  };
};
