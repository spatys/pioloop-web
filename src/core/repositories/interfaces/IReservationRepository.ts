import { Reservation, CreateReservationForm, PaginatedResponse, ApiResponse } from '../../types';

export interface IReservationRepository {
  // Get all reservations with optional filters
  getReservations(params?: any): Promise<PaginatedResponse<Reservation>>;
  
  // Get a single reservation by ID
  getReservation(id: string): Promise<ApiResponse<Reservation>>;
  
  // Create a new reservation
  createReservation(reservationData: CreateReservationForm): Promise<ApiResponse<Reservation>>;
  
  // Update reservation status
  updateReservationStatus(id: string, status: string, reason?: string): Promise<ApiResponse<Reservation>>;
  
  // Cancel a reservation
  cancelReservation(id: string): Promise<ApiResponse<void>>;
  
  // Get reservations for the current user as tenant
  getMyBookings(): Promise<ApiResponse<Reservation[]>>;
  
  // Get reservations for properties owned by the current user
  getMyPropertyBookings(): Promise<ApiResponse<Reservation[]>>;
  
  // Get reservations by property
  getReservationsByProperty(propertyId: string): Promise<ApiResponse<Reservation[]>>;
  
  // Get reservations by user
  getReservationsByUser(userId: string): Promise<ApiResponse<Reservation[]>>;
  
  // Check property availability for a date range
  checkAvailability(propertyId: string, checkIn: string, checkOut: string): Promise<ApiResponse<boolean>>;
  
  // Get reservation statistics
  getReservationStats(userId?: string): Promise<ApiResponse<any>>;
} 