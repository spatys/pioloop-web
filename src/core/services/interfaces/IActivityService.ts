export interface RecentActivity {
  id: string;
  type: "booking" | "review" | "payment" | "maintenance";
  title: string;
  description: string;
  timestamp: string;
  propertyId: string;
  propertyTitle: string;
  amount?: number;
  rating?: number;
}

export interface IActivityService {
  getRecentActivities(ownerId: string): Promise<RecentActivity[]>;
}
