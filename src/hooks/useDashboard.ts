import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { container } from "@/core/di/container";
import { TYPES } from "@/core/di/types";
import { IPropertyService } from "@/core/services/interfaces/IPropertyService";
import { IDashboardService } from "@/core/services/interfaces/IDashboardService";
import { IActivityService } from "@/core/services/interfaces/IActivityService";
import { IRevenueService } from "@/core/services/interfaces/IRevenueService";
import type { PropertyResponse } from "@/core/types/Property";
import type { DashboardStats } from "@/core/services/interfaces/IDashboardService";
import type { RecentActivity } from "@/core/services/interfaces/IActivityService";
import type { RevenueData } from "@/core/services/interfaces/IRevenueService";

interface Property {
  id: string;
  title: string;
  description: string;
  propertyType: string;
  address: string;
  city: string;
  pricePerNight: number;
  status: string;
  maxGuests: number;
  bedrooms: number;
  images: Array<{ imageUrl: string; altText: string }>;
  createdAt: string;
  rating?: number;
  reviewCount?: number;
  lastBooking?: string;
  occupancyRate?: number;
  monthlyRevenue?: number;
}

interface UseDashboardReturn {
  properties: Property[];
  stats: DashboardStats | null;
  recentActivity: RecentActivity[];
  revenueData: RevenueData[];
  loading: boolean;
  error: string | null;
}

export const useDashboard = (): UseDashboardReturn => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        const propertyService = container.get<IPropertyService>(TYPES.IPropertyService);
        const dashboardService = container.get<IDashboardService>(TYPES.IDashboardService);
        const activityService = container.get<IActivityService>(TYPES.IActivityService);
        const revenueService = container.get<IRevenueService>(TYPES.IRevenueService);
        
        // Récupérer les propriétés du propriétaire
        const ownerProperties: PropertyResponse[] = await propertyService.getPropertiesByOwnerId(user.id);
        
        // Convertir PropertyResponse[] en Property[] pour le dashboard
        const convertedProperties: Property[] = ownerProperties.map(prop => ({
          id: prop.id,
          title: prop.title,
          description: prop.description,
          propertyType: prop.propertyType,
          address: prop.address,
          city: prop.city,
          pricePerNight: prop.pricePerNight,
          status: prop.status,
          maxGuests: prop.maxGuests,
          bedrooms: prop.bedrooms,
          images: prop.imageUrls.map((url, index) => ({
            imageUrl: url,
            altText: `${prop.title} - Image ${index + 1}`
          })),
          createdAt: prop.createdAt
        }));
        
        // Récupérer les statistiques
        const dashboardStats = await dashboardService.calculateStats(ownerProperties);
        
        // Récupérer les activités récentes
        const activities = await activityService.getRecentActivities(user.id);
        
        // Récupérer les données de revenus
        const revenue = await revenueService.getRevenueData(user.id, 6);
        
        setProperties(convertedProperties);
        setStats(dashboardStats);
        setRecentActivity(activities);
        setRevenueData(revenue);
      } catch (err) {
        console.error("Erreur lors du chargement du dashboard:", err);
        setError("Erreur lors du chargement du tableau de bord");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id]);

  return {
    properties,
    stats,
    recentActivity,
    revenueData,
    loading,
    error
  };
};
