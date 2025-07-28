import { Reservation, CreateReservationForm, PaginatedResponse } from '../../types';

export interface IBookingService {
  // Reservation management
  createReservation(data: CreateReservationForm): Promise<Reservation>;
  getReservation(id: string): Promise<Reservation>;
  updateReservationStatus(id: string, status: string, reason?: string): Promise<Reservation>;
  cancelReservation(id: string): Promise<void>;
  
  // User bookings
  getMyBookings(): Promise<Reservation[]>;
  getMyPropertyBookings(): Promise<Reservation[]>;
  
  // Availability
  checkAvailability(propertyId: string, checkIn: Date, checkOut: Date): Promise<boolean>;
  getAvailableDates(propertyId: string, month: number, year: number): Promise<Date[]>;
  
  // Booking validation
  validateReservation(data: CreateReservationForm): Promise<{ isValid: boolean; errors: string[] }>;
  
  // Booking statistics
  getBookingStats(userId?: string): Promise<any>;
} 