export interface PropertyAvailability {
  id: string;
  propertyId: string;
  checkInDate: Date;
  checkOutDate: Date;
  isAvailable: boolean;
  specialPrice?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AvailabilityDay {
  date: Date;
  isAvailable: boolean;
  price: number;
  notes?: string;
  isToday: boolean;
  isPast: boolean;
  isSpecialPrice: boolean;
}

export interface PropertyAvailabilityCalendar {
  propertyId: string;
  calendar: AvailabilityDay[];
  basePrice: number;
  currency: string;
}

export interface CreateAvailabilityRequest {
  propertyId: string;
  checkInDate: Date;
  checkOutDate: Date;
  isAvailable: boolean;
  specialPrice?: number;
  notes?: string;
}

export interface UpdateAvailabilityRequest {
  id: string;
  checkInDate: Date;
  checkOutDate: Date;
  isAvailable: boolean;
  specialPrice?: number;
  notes?: string;
}

export interface BulkUpdateAvailabilityRequest {
  propertyId: string;
  periods: AvailabilityPeriod[];
}

export interface AvailabilityPeriod {
  startDate: Date;
  endDate: Date;
  isAvailable: boolean;
  specialPrice?: number;
  notes?: string;
}

export interface GetAvailabilityRequest {
  propertyId: string;
  startDate?: Date;
  endDate?: Date;
}

// Calendar selection types
export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export interface CalendarSelection {
  type: 'single' | 'range' | 'multiple';
  dates: Date[];
  range?: DateRange;
}

// Calendar display options
export interface CalendarOptions {
  showPastDates: boolean;
  showToday: boolean;
  allowPastSelection: boolean;
  minDate?: Date;
  maxDate?: Date;
  monthsToShow: number;
  startDayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
}

// Calendar events
export interface CalendarEvent {
  type: 'availability-change' | 'price-change' | 'note-change';
  date: Date;
  data: any;
}
