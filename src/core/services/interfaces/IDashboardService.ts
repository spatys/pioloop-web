import type { PropertyResponse } from "@/core/types/Property";

export interface DashboardStats {
  totalProperties: number;
  awaitingApprovals: number;
  publishedProperties: number;
  rentedProperties: number;
  totalRevenue: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  totalBookings: number;
  activeBookings: number;
  averageRating: number;
  totalReviews: number;
  occupancyRate: number;
}

export interface IDashboardService {
  calculateStats(properties: PropertyResponse[]): Promise<DashboardStats>;
}
