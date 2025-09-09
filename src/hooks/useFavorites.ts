import { useState, useEffect } from 'react';
import useSWR from 'swr';

interface Favorite {
  id: string;
  propertyId: string;
  userId: string;
  createdAt: string;
  property?: {
    id: string;
    title: string;
    pricePerNight: number;
    images: string[];
  };
}

interface FavoritesResponse {
  favorites: Favorite[];
  totalCount: number;
}

const fetcher = async (url: string): Promise<FavoritesResponse> => {
  const response = await fetch(url, {
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch favorites');
  }
  
  return response.json();
};

export const useFavorites = () => {
  const { data, error, isLoading, mutate } = useSWR<FavoritesResponse>(
    '/api/favorites',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 30000,
    }
  );

  const favorites = data?.favorites || [];
  const totalCount = data?.totalCount || 0;

  const addToFavorites = async (propertyId: string) => {
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ propertyId }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to favorites');
      }

      // Revalidate the data
      mutate();
      return true;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return false;
    }
  };

  const removeFromFavorites = async (propertyId: string) => {
    try {
      const response = await fetch(`/api/favorites/${propertyId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to remove from favorites');
      }

      // Revalidate the data
      mutate();
      return true;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return false;
    }
  };

  const isFavorite = (propertyId: string) => {
    return favorites.some(fav => fav.propertyId === propertyId);
  };

  return {
    favorites,
    totalCount,
    isLoading,
    error,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    mutate,
  };
};
