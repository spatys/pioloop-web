import { IBookingService } from '../interfaces/IBookingService';
import { Reservation, CreateReservationForm, PaginatedResponse } from '../../types';
import { reservationRepository } from '../../repositories/implementations/ReservationRepository';

export class BookingService implements IBookingService {
  async createReservation(data: CreateReservationForm): Promise<Reservation> {
    const response = await reservationRepository.createReservation(data);
    if (!response.success) {
      throw new Error(response.message || 'Failed to create reservation');
    }
    return response.data;
  }

  async getReservation(id: string): Promise<Reservation> {
    const response = await reservationRepository.getReservation(id);
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch reservation');
    }
    return response.data;
  }

  async updateReservationStatus(id: string, status: string, reason?: string): Promise<Reservation> {
    const response = await reservationRepository.updateReservationStatus(id, status, reason);
    if (!response.success) {
      throw new Error(response.message || 'Failed to update reservation status');
    }
    return response.data;
  }

  async cancelReservation(id: string): Promise<void> {
    const response = await reservationRepository.cancelReservation(id);
    if (!response.success) {
      throw new Error(response.message || 'Failed to cancel reservation');
    }
  }

  async getMyBookings(): Promise<Reservation[]> {
    const response = await reservationRepository.getMyBookings();
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch my bookings');
    }
    return response.data;
  }

  async getMyPropertyBookings(): Promise<Reservation[]> {
    const response = await reservationRepository.getMyPropertyBookings();
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch my property bookings');
    }
    return response.data;
  }

  async checkAvailability(propertyId: string, checkIn: Date, checkOut: Date): Promise<boolean> {
    const response = await reservationRepository.checkAvailability(
      propertyId,
      checkIn.toISOString(),
      checkOut.toISOString()
    );
    if (!response.success) {
      throw new Error(response.message || 'Failed to check availability');
    }
    return response.data;
  }

  async getAvailableDates(propertyId: string, month: number, year: number): Promise<Date[]> {
    // This would be implemented with availability service
    throw new Error('Available dates not implemented');
  }

  async validateReservation(data: CreateReservationForm): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (!data.propertyId) {
      errors.push('Property ID is required');
    }

    if (!data.checkInDate) {
      errors.push('Check-in date is required');
    }

    if (!data.checkOutDate) {
      errors.push('Check-out date is required');
    }

    if (data.checkInDate && data.checkOutDate) {
      const checkIn = new Date(data.checkInDate);
      const checkOut = new Date(data.checkOutDate);
      const today = new Date();

      if (checkIn < today) {
        errors.push('Check-in date cannot be in the past');
      }

      if (checkOut <= checkIn) {
        errors.push('Check-out date must be after check-in date');
      }

      const diffTime = checkOut.getTime() - checkIn.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 1) {
        errors.push('Minimum stay is 1 day');
      }

      if (diffDays > 365) {
        errors.push('Maximum stay is 365 days');
      }
    }

    if (!data.numberOfGuests || data.numberOfGuests <= 0) {
      errors.push('Number of guests is required');
    }

    if (data.numberOfGuests && data.numberOfGuests > 20) {
      errors.push('Maximum 20 guests allowed');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  async getBookingStats(userId?: string): Promise<any> {
    const response = await reservationRepository.getReservationStats(userId);
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch booking stats');
    }
    return response.data;
  }
}

export const bookingService = new BookingService(); 