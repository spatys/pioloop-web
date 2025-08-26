import { injectable } from "inversify";
import type { IRevenueService, RevenueData } from "../interfaces/IRevenueService";

@injectable()
export class RevenueService implements IRevenueService {
  async getRevenueData(ownerId: string, months: number): Promise<RevenueData[]> {
    // Pour l'instant, retourner un tableau vide
    // À connecter avec le service de réservations et paiements pour calculer les vrais revenus
    return [];
  }
}
