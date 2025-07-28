export interface DashboardStats {
  totalProperties: number;
  totalReservations: number;
  totalRevenue: number;
  activeBookings: number;
  pendingApprovals: number;
  recentActivity: ActivityItem[];
}

export interface DashboardChart {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}

export interface ActivityItem {
  id: string;
  type: 'reservation' | 'payment' | 'property' | 'user';
  title: string;
  description: string;
  timestamp: Date;
  userId?: string;
  userName?: string;
} 