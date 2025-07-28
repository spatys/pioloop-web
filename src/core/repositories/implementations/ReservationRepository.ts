import { IReservationRepository } from '../interfaces/IReservationRepository';
import { Reservation, CreateReservationForm, PaginatedResponse, ApiResponse } from '../../types';

class ReservationRepository implements IReservationRepository {
  private baseURL: string;

  constructor() {
    this.baseURL = typeof window !== 'undefined' && (window as any).env?.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  }

  private getAuthHeaders(): Record<string, string> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async makeRequest(url: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseURL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    });
    return response.json();
  }

  async getReservations(params?: any): Promise<PaginatedResponse<Reservation>> {
    try {
      const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
      return await this.makeRequest(`/reservations${queryString}`);
    } catch (error) {
      throw new Error('Failed to fetch reservations');
    }
  }

  async getReservation(id: string): Promise<ApiResponse<Reservation>> {
    try {
      return await this.makeRequest(`/reservations/${id}`);
    } catch (error) {
      throw new Error('Failed to fetch reservation');
    }
  }

  async createReservation(reservationData: CreateReservationForm): Promise<ApiResponse<Reservation>> {
    try {
      return await this.makeRequest('/reservations', {
        method: 'POST',
        body: JSON.stringify(reservationData),
      });
    } catch (error) {
      throw new Error('Failed to create reservation');
    }
  }

  async updateReservationStatus(id: string, status: string, reason?: string): Promise<ApiResponse<Reservation>> {
    try {
      return await this.makeRequest(`/reservations/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, reason }),
      });
    } catch (error) {
      throw new Error('Failed to update reservation status');
    }
  }

  async cancelReservation(id: string): Promise<ApiResponse<void>> {
    try {
      return await this.makeRequest(`/reservations/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      throw new Error('Failed to cancel reservation');
    }
  }

  async getMyBookings(): Promise<ApiResponse<Reservation[]>> {
    try {
      return await this.makeRequest('/reservations/my-bookings');
    } catch (error) {
      throw new Error('Failed to fetch my bookings');
    }
  }

  async getMyPropertyBookings(): Promise<ApiResponse<Reservation[]>> {
    try {
      return await this.makeRequest('/reservations/my-property-bookings');
    } catch (error) {
      throw new Error('Failed to fetch my property bookings');
    }
  }

  async getReservationsByProperty(propertyId: string): Promise<ApiResponse<Reservation[]>> {
    try {
      return await this.makeRequest(`/reservations?propertyId=${propertyId}`);
    } catch (error) {
      throw new Error('Failed to fetch reservations by property');
    }
  }

  async getReservationsByUser(userId: string): Promise<ApiResponse<Reservation[]>> {
    try {
      return await this.makeRequest(`/reservations?userId=${userId}`);
    } catch (error) {
      throw new Error('Failed to fetch reservations by user');
    }
  }

  async checkAvailability(propertyId: string, checkIn: string, checkOut: string): Promise<ApiResponse<boolean>> {
    try {
      return await this.makeRequest(`/reservations/check-availability?propertyId=${propertyId}&checkIn=${checkIn}&checkOut=${checkOut}`);
    } catch (error) {
      throw new Error('Failed to check availability');
    }
  }

  async getReservationStats(userId?: string): Promise<ApiResponse<any>> {
    try {
      const queryString = userId ? `?userId=${userId}` : '';
      return await this.makeRequest(`/reservations/stats${queryString}`);
    } catch (error) {
      throw new Error('Failed to fetch reservation stats');
    }
  }
}

export const reservationRepository = new ReservationRepository(); 