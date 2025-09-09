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
  images: Array<{ imageData: string; contentType: string; altText: string }>;
  createdAt: string;
  rating?: number;
  reviewCount?: number;
  lastBooking?: string;
  occupancyRate?: number;
  monthlyRevenue?: number;
}

interface UseDashboardReturn {
  properties: Property[];
  stats: DashboardStats;
  recentActivity: RecentActivity[];
  revenueData: RevenueData[];
  loading: boolean;
  error: string | null;
  authLoading: boolean;
  refetch: () => Promise<void>;
}

export const useDashboard = (): UseDashboardReturn => {
  const { user, isLoading } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const defaultStats: DashboardStats = {
    totalProperties: 0,
    awaitingApprovals: 0,
    publishedProperties: 0,
    rentedProperties: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    revenueGrowth: 0,
    totalBookings: 0,
    activeBookings: 0,
    averageRating: 0,
    totalReviews: 0,
    occupancyRate: 0
  };
  const [stats, setStats] = useState<DashboardStats>(defaultStats);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(false); // Commencer à false
  const [error, setError] = useState<string | null>(null);

  // Extraire l'ID utilisateur - user est l'objet de réponse avec data.id
  const userId = user?.data?.id;
  
  const fetchDashboardData = async () => {
    // Attendre que le chargement de l'authentification soit terminé
    if (isLoading) {
      return;
    }
    
    if (!userId) {
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
      let ownerProperties: PropertyResponse[] = [];
      
      try {
        ownerProperties = await propertyService.getPropertiesByOwnerId(userId);
      } catch (error) {
        console.error('Error fetching owner properties:', error);
        // Fallback: utiliser toutes les propriétés mock pour le développement
        const propertyService = container.get<IPropertyService>(TYPES.IPropertyService);
        ownerProperties = await propertyService.getPopularProperties(10);
      }
      
      // Convertir PropertyResponse[] en Property[] pour le dashboard
      const convertedProperties: Property[] = ownerProperties.map(prop => {
        const converted = {
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
          images: prop.images?.map((img, index) => ({
            imageData: img.imageData,
            contentType: img.contentType,
            altText: img.altText || `${prop.title} - Image ${index + 1}`
          })) || [],
          createdAt: prop.createdAt
        };
        return converted;
      });
      
      // Récupérer les statistiques
      const dashboardStats = await dashboardService.calculateStats(ownerProperties);
      
      // Récupérer les activités récentes et revenus
      const activities = await activityService.getRecentActivities(userId);
      const revenue = await revenueService.getRevenueData(userId, 6);
      
      setProperties(convertedProperties);
      setStats(dashboardStats);
      setRecentActivity(activities);
      setRevenueData(revenue);
      
    } catch (err) {
      setError("Erreur lors du chargement du tableau de bord");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchDashboardData();
  }, [userId, isLoading]);

  const refetch = async () => {
    if (userId) {
      await fetchDashboardData();
    }
  };

  return {
    properties,
    stats,
    recentActivity,
    revenueData,
    loading,
    error,
    authLoading: isLoading,
    refetch
  };
};
