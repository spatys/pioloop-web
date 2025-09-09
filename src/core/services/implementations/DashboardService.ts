import { injectable } from "inversify";
import type { IDashboardService, DashboardStats } from "../interfaces/IDashboardService";
import type { PropertyResponse } from "@/core/types/Property";

@injectable()
export class DashboardService implements IDashboardService {
  async calculateStats(properties: PropertyResponse[]): Promise<DashboardStats> {
    const totalProperties = properties.length;
    const pendingApprovals = properties.filter(p => p.status === "AwaitingVerification").length;
    const publishedProperties = properties.filter(p => p.status === "Verified").length;
    const rentedProperties = properties.filter(p => p.status === "Rented").length;
    
    // Calculer les revenus basés sur les prix des propriétés
    const totalRevenue = properties.reduce((sum, p) => sum + p.pricePerNight * 30, 0); // Estimation mensuelle
    const monthlyRevenue = totalRevenue;
    
    // Calculer le taux de croissance (pour l'instant fixe, à connecter avec l'historique)
    const revenueGrowth = 0; // À calculer avec l'historique des revenus
    
    // Statistiques de réservations (à connecter avec le service de réservations)
    const totalBookings = 0; // À récupérer depuis le service de réservations
    const activeBookings = 0; // À récupérer depuis le service de réservations
    
    // Calculer la note moyenne (à connecter avec le service d'avis)
    const averageRating = 0; // À calculer avec les vrais avis
    const totalReviews = 0; // À récupérer depuis le service d'avis
    
    // Calculer le taux d'occupation (à connecter avec le service de réservations)
    const occupancyRate = 0; // À calculer avec les vraies réservations

    return {
      totalProperties,
      pendingApprovals,
      publishedProperties,
      rentedProperties,
      totalRevenue,
      monthlyRevenue,
      revenueGrowth,
      totalBookings,
      activeBookings,
      averageRating,
      totalReviews,
      occupancyRate
    };
  }
}
