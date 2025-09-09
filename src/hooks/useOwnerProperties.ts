import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { PropertyStatus } from '@/core/types/Property';

interface UserProperty {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  country: string;
  pricePerNight: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  status: PropertyStatus;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

interface OwnerPropertiesResponse {
  properties: UserProperty[];
  totalCount: number;
  statistics: {
    totalProperties: number;
    verifiedProperties: number;
    awaitingApprovalss: number;
    rentedProperties: number;
  };
}

const fetcher = async (url: string): Promise<OwnerPropertiesResponse> => {
  const response = await fetch(url, {
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch user properties');
  }
  
  return response.json();
};

export const useOwnerProperties = () => {
  const { data, error, isLoading, mutate } = useSWR<OwnerPropertiesResponse>(
    '/api/properties/my-properties',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 30000,
    }
  );

  const properties = data?.properties || [];
  const totalCount = data?.totalCount || 0;
  const statistics = data?.statistics || {
    totalProperties: 0,
    verifiedProperties: 0,
    awaitingApprovalss: 0,
    rentedProperties: 0,
  };

  const createProperty = async (propertyData: any) => {
    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(propertyData),
      });

      if (!response.ok) {
        throw new Error('Failed to create property');
      }

      const result = await response.json();
      mutate();
      return result;
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  };

  const updateProperty = async (propertyId: string, propertyData: any) => {
    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(propertyData),
      });

      if (!response.ok) {
        throw new Error('Failed to update property');
      }

      const result = await response.json();
      mutate();
      return result;
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  };

  const deleteProperty = async (propertyId: string) => {
    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete property');
      }

      mutate();
      return true;
    } catch (error) {
      console.error('Error deleting property:', error);
      return false;
    }
  };

  const getPropertiesByStatus = (status: PropertyStatus) => {
    return properties.filter(property => property.status === status);
  };

  const getVerifiedProperties = () => {
    return getPropertiesByStatus(PropertyStatus.Verified);
  };

  const getPendingProperties = () => {
    return getPropertiesByStatus(PropertyStatus.PendingVerification);
  };

  const getRentedProperties = () => {
    return getPropertiesByStatus(PropertyStatus.Rented);
  };

  return {
    properties,
    totalCount,
    statistics,
    isLoading,
    error,
    createProperty,
    updateProperty,
    deleteProperty,
    getPropertiesByStatus,
    getVerifiedProperties,
    getPendingProperties,
    getRentedProperties,
    mutate,
  };
};
