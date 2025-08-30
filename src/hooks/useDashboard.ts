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
  stats: DashboardStats;
  recentActivity: RecentActivity[];
  revenueData: RevenueData[];
  loading: boolean;
  error: string | null;
  authLoading: boolean;
}

export const useDashboard = (): UseDashboardReturn => {
  const { user, isLoading } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const defaultStats: DashboardStats = {
    totalProperties: 0,
    pendingApprovals: 0,
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
  

  
  useEffect(() => {
    
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
        
        console.log("🔍 Chargement du dashboard pour l'utilisateur:", userId);
        
        const propertyService = container.get<IPropertyService>(TYPES.IPropertyService);
        const dashboardService = container.get<IDashboardService>(TYPES.IDashboardService);
        const activityService = container.get<IActivityService>(TYPES.IActivityService);
        const revenueService = container.get<IRevenueService>(TYPES.IRevenueService);
        
        // Récupérer les propriétés du propriétaire
        console.log("📋 Récupération des propriétés...");
        let ownerProperties: PropertyResponse[] = [];
        
        try {
          ownerProperties = await propertyService.getPropertiesByOwnerId(userId);
        } catch (error) {
          console.warn("⚠️ Erreur lors de la récupération des propriétés, utilisation des données mock:", error);
          // Fallback: utiliser toutes les propriétés mock pour le développement
          const propertyService = container.get<IPropertyService>(TYPES.IPropertyService);
          ownerProperties = await propertyService.getLatestProperties(10);
        }
        
        console.log("✅ Propriétés récupérées:", ownerProperties);
        
        // Convertir PropertyResponse[] en Property[] pour le dashboard
        const convertedProperties: Property[] = ownerProperties.map(prop => {
          return {
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
              imageUrl: img.imageUrl,
              altText: img.altText || `${prop.title} - Image ${index + 1}`
            })) || [],
            createdAt: prop.createdAt
          };
        });
        console.log("🔄 Propriétés converties:", convertedProperties);
        
        // Récupérer les statistiques
        console.log("📊 Calcul des statistiques...");
        const dashboardStats = await dashboardService.calculateStats(ownerProperties);
        console.log("✅ Statistiques calculées:", dashboardStats);
        
        // Récupérer les activités récentes
        console.log("📈 Récupération des activités...");
        const activities = await activityService.getRecentActivities(userId);
        console.log("✅ Activités récupérées:", activities);
        
        // Récupérer les données de revenus
        console.log("💰 Récupération des revenus...");
        const revenue = await revenueService.getRevenueData(userId, 6);
        console.log("✅ Revenus récupérés:", revenue);
        
        setProperties(convertedProperties);
        setStats(dashboardStats);
        setRecentActivity(activities);
        setRevenueData(revenue);
        
        console.log("🎉 Dashboard chargé avec succès!");
      } catch (err) {
        console.error("❌ Erreur lors du chargement du dashboard:", err);
        setError("Erreur lors du chargement du tableau de bord");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userId, isLoading]);

  return {
    properties,
    stats,
    recentActivity,
    revenueData,
    loading,
    error,
    authLoading: isLoading
  };
};
