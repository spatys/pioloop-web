export interface RevenueData {
  month: string;
  revenue: number;
  bookings: number;
}

export interface IRevenueService {
  getRevenueData(ownerId: string, months: number): Promise<RevenueData[]>;
}
