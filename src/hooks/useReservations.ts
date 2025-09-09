import { useState, useEffect } from 'react';
import useSWR from 'swr';

export enum ReservationStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Cancelled = 'Cancelled',
  Completed = 'Completed',
}

interface Reservation {
  id: string;
  propertyId: string;
  userId: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalPrice: number;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
  property?: {
    id: string;
    title: string;
    images: string[];
    address: string;
  };
}

interface ReservationsResponse {
  reservations: Reservation[];
  totalCount: number;
}

const fetcher = async (url: string): Promise<ReservationsResponse> => {
  const response = await fetch(url, {
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch reservations');
  }
  
  return response.json();
};

export const useReservations = () => {
  const { data, error, isLoading, mutate } = useSWR<ReservationsResponse>(
    '/api/reservations',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 30000,
    }
  );

  const reservations = data?.reservations || [];
  const totalCount = data?.totalCount || 0;

  const createReservation = async (reservationData: {
    propertyId: string;
    checkInDate: string;
    checkOutDate: string;
    numberOfGuests: number;
  }) => {
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(reservationData),
      });

      if (!response.ok) {
        throw new Error('Failed to create reservation');
      }

      const result = await response.json();
      mutate();
      return result;
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  };

  const cancelReservation = async (reservationId: string) => {
    try {
      const response = await fetch(`/api/reservations/${reservationId}/cancel`, {
        method: 'PATCH',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel reservation');
      }

      mutate();
      return true;
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      return false;
    }
  };

  const getReservationsByStatus = (status: ReservationStatus) => {
    return reservations.filter(reservation => reservation.status === status);
  };

  const getUpcomingReservations = () => {
    const now = new Date();
    return reservations.filter(reservation => 
      new Date(reservation.checkInDate) > now && 
      reservation.status === ReservationStatus.Confirmed
    );
  };

  return {
    reservations,
    totalCount,
    isLoading,
    error,
    createReservation,
    cancelReservation,
    getReservationsByStatus,
    getUpcomingReservations,
    mutate,
  };
};
