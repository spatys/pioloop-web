import { injectable } from "inversify";
import type { IActivityService, RecentActivity } from "../interfaces/IActivityService";

@injectable()
export class ActivityService implements IActivityService {
  async getRecentActivities(ownerId: string): Promise<RecentActivity[]> {
    // Pour l'instant, retourner un tableau vide
    // À connecter avec les vrais services de réservations, paiements, avis, etc.
    return [];
  }
}
