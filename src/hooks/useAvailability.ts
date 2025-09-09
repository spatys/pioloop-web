import { useState, useEffect, useCallback } from 'react';
import { 
  PropertyAvailability, 
  PropertyAvailabilityCalendar,
  CreateAvailabilityRequest,
  UpdateAvailabilityRequest,
  BulkUpdateAvailabilityRequest,
  GetAvailabilityRequest
} from '@/core/types/Availability';
import { availabilityService } from '@/core/services/AvailabilityService';

interface UseAvailabilityOptions {
  propertyId?: string;
  autoLoad?: boolean;
  startDate?: Date;
  endDate?: Date;
}

interface UseAvailabilityReturn {
  availabilities: PropertyAvailability[];
  calendar: PropertyAvailabilityCalendar | null;
  loading: boolean;
  error: string | null;
  createAvailability: (request: CreateAvailabilityRequest) => Promise<PropertyAvailability>;
  updateAvailability: (request: UpdateAvailabilityRequest) => Promise<PropertyAvailability>;
  deleteAvailability: (id: string) => Promise<boolean>;
  bulkUpdateAvailability: (request: BulkUpdateAvailabilityRequest) => Promise<PropertyAvailability[]>;
  loadAvailabilities: (request?: GetAvailabilityRequest) => Promise<void>;
  loadCalendar: (propertyId: string, startDate?: Date, endDate?: Date) => Promise<void>;
  refresh: () => Promise<void>;
}

export const useAvailability = (options: UseAvailabilityOptions = {}): UseAvailabilityReturn => {
  const { propertyId, autoLoad = true, startDate, endDate } = options;
  
  const [availabilities, setAvailabilities] = useState<PropertyAvailability[]>([]);
  const [calendar, setCalendar] = useState<PropertyAvailabilityCalendar | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAvailabilities = useCallback(async (request?: GetAvailabilityRequest) => {
    if (!propertyId && !request?.propertyId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const loadRequest = request || {
        propertyId: propertyId!,
        startDate,
        endDate
      };
      
      const data = await availabilityService.getPropertyAvailability(loadRequest);
      setAvailabilities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load availabilities');
    } finally {
      setLoading(false);
    }
  }, [propertyId, startDate, endDate]);

  const loadCalendar = useCallback(async (propId: string, start?: Date, end?: Date) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await availabilityService.getAvailabilityCalendar(propId, start, end);
      setCalendar(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load calendar');
    } finally {
      setLoading(false);
    }
  }, []);

  const createAvailability = useCallback(async (request: CreateAvailabilityRequest): Promise<PropertyAvailability> => {
    setLoading(true);
    setError(null);
    
    try {
      const newAvailability = await availabilityService.createAvailability(request);
      setAvailabilities(prev => [...prev, newAvailability]);
      
      // Refresh calendar if it's for the same property
      if (calendar && calendar.propertyId === request.propertyId) {
        await loadCalendar(request.propertyId);
      }
      
      return newAvailability;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create availability');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [calendar, loadCalendar]);

  const updateAvailability = useCallback(async (request: UpdateAvailabilityRequest): Promise<PropertyAvailability> => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedAvailability = await availabilityService.updateAvailability(request);
      setAvailabilities(prev => 
        prev.map(av => av.id === request.id ? updatedAvailability : av)
      );
      
      // Refresh calendar if it's for the same property
      if (calendar && calendar.propertyId === updatedAvailability.propertyId) {
        await loadCalendar(updatedAvailability.propertyId);
      }
      
      return updatedAvailability;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update availability');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [calendar, loadCalendar]);

  const deleteAvailability = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const success = await availabilityService.deleteAvailability(id);
      if (success) {
        setAvailabilities(prev => prev.filter(av => av.id !== id));
        
        // Refresh calendar if needed
        if (calendar) {
          await loadCalendar(calendar.propertyId);
        }
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete availability');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [calendar, loadCalendar]);

  const bulkUpdateAvailability = useCallback(async (request: BulkUpdateAvailabilityRequest): Promise<PropertyAvailability[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const newAvailabilities = await availabilityService.bulkUpdateAvailability(request);
      setAvailabilities(prev => [...prev, ...newAvailabilities]);
      
      // Refresh calendar if it's for the same property
      if (calendar && calendar.propertyId === request.propertyId) {
        await loadCalendar(request.propertyId);
      }
      
      return newAvailabilities;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to bulk update availability');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [calendar, loadCalendar]);

  const refresh = useCallback(async () => {
    if (propertyId) {
      await Promise.all([
        loadAvailabilities(),
        loadCalendar(propertyId, startDate, endDate)
      ]);
    }
  }, [propertyId, loadAvailabilities, loadCalendar, startDate, endDate]);

  // Auto-load on mount
  useEffect(() => {
    if (autoLoad && propertyId) {
      refresh();
    }
  }, [autoLoad, propertyId, refresh]);

  return {
    availabilities,
    calendar,
    loading,
    error,
    createAvailability,
    updateAvailability,
    deleteAvailability,
    bulkUpdateAvailability,
    loadAvailabilities,
    loadCalendar,
    refresh
  };
};
