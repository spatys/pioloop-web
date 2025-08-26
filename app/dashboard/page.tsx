"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { OwnerOnly } from "@/components/shared/RoleGuard";
import Dashboard from "@/modules/dashboard/components/Dashboard";

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

interface DashboardStats {
  totalProperties: number;
  pendingApprovals: number;
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

interface RecentActivity {
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

interface RevenueData {
  month: string;
  revenue: number;
  bookings: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Données mockées pour la démonstration
  useEffect(() => {
    // Simuler un chargement
    setTimeout(() => {
      const mockProperties: Property[] = [
        {
          id: "1",
          title: "Appartement moderne au cœur de Paris",
          description: "Magnifique appartement rénové avec vue sur la Tour Eiffel",
          propertyType: "Appartement",
          address: "123 Rue de la Paix",
          city: "Paris",
          pricePerNight: 150,
          status: "PendingApproval",
          maxGuests: 4,
          bedrooms: 2,
          images: [
            {
              imageUrl: "/images/placeholder-property.jpg",
              altText: "Appartement Paris"
            }
          ],
          createdAt: "2024-01-15",
          rating: 4.8,
          reviewCount: 12,
          occupancyRate: 85,
          monthlyRevenue: 3200
        },
        {
          id: "2",
          title: "Maison de campagne avec piscine",
          description: "Belle maison traditionnelle avec jardin et piscine",
          propertyType: "Maison",
          address: "456 Chemin des Fleurs",
          city: "Lyon",
          pricePerNight: 200,
          status: "Published",
          maxGuests: 6,
          bedrooms: 3,
          images: [
            {
              imageUrl: "/images/placeholder-property.jpg",
              altText: "Maison Lyon"
            }
          ],
          createdAt: "2024-01-10",
          rating: 4.9,
          reviewCount: 8,
          occupancyRate: 92,
          monthlyRevenue: 4800
        },
        {
          id: "3",
          title: "Studio cosy près de la plage",
          description: "Studio moderne à 5 minutes de la plage",
          propertyType: "Studio",
          address: "789 Avenue de la Mer",
          city: "Nice",
          pricePerNight: 120,
          status: "Rented",
          maxGuests: 2,
          bedrooms: 1,
          images: [
            {
              imageUrl: "/images/placeholder-property.jpg",
              altText: "Studio Nice"
            }
          ],
          createdAt: "2024-01-05",
          rating: 4.7,
          reviewCount: 15,
          occupancyRate: 78,
          monthlyRevenue: 2800
        }
      ];

      setProperties(mockProperties);
      setLoading(false);
    }, 1000);
  }, []);

  // Calculer les statistiques à partir des propriétés
  const calculateStats = (): DashboardStats => {
    const totalProperties = properties.length;
    const pendingApprovals = properties.filter(p => p.status === "PendingApproval").length;
    const publishedProperties = properties.filter(p => p.status === "Published").length;
    const rentedProperties = properties.filter(p => p.status === "Rented").length;
    
    const totalRevenue = properties.reduce((sum, p) => sum + (p.monthlyRevenue || 0), 0);
    const monthlyRevenue = totalRevenue;
    const revenueGrowth = 12.5; // Mock data
    
    const totalBookings = 45; // Mock data
    const activeBookings = 8; // Mock data
    
    const averageRating = properties.length > 0 
      ? properties.reduce((sum, p) => sum + (p.rating || 0), 0) / properties.length 
      : 0;
    const totalReviews = properties.reduce((sum, p) => sum + (p.reviewCount || 0), 0);
    
    const occupancyRate = properties.length > 0 
      ? Math.round(properties.reduce((sum, p) => sum + (p.occupancyRate || 0), 0) / properties.length)
      : 0;

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
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
      occupancyRate
    };
  };

  // Données d'activité récente mockées
  const recentActivity: RecentActivity[] = [
    {
      id: "1",
      type: "booking",
      title: "Nouvelle réservation",
      description: "Réservation pour 4 personnes du 15 au 20 janvier",
      timestamp: "Il y a 2 heures",
      propertyId: "1",
      propertyTitle: "Appartement moderne au cœur de Paris",
      amount: 750
    },
    {
      id: "2",
      type: "review",
      title: "Nouvel avis 5 étoiles",
      description: "Excellent séjour, très propre et bien situé",
      timestamp: "Il y a 1 jour",
      propertyId: "2",
      propertyTitle: "Maison de campagne avec piscine",
      rating: 5
    },
    {
      id: "3",
      type: "payment",
      title: "Paiement reçu",
      description: "Paiement pour réservation du 10 au 15 janvier",
      timestamp: "Il y a 2 jours",
      propertyId: "3",
      propertyTitle: "Studio cosy près de la plage",
      amount: 600
    },
    {
      id: "4",
      type: "maintenance",
      title: "Maintenance programmée",
      description: "Nettoyage de la piscine prévu demain",
      timestamp: "Il y a 3 jours",
      propertyId: "2",
      propertyTitle: "Maison de campagne avec piscine"
    },
    {
      id: "5",
      type: "booking",
      title: "Réservation annulée",
      description: "Annulation pour le week-end du 20 janvier",
      timestamp: "Il y a 4 jours",
      propertyId: "1",
      propertyTitle: "Appartement moderne au cœur de Paris"
    }
  ];

  // Données de revenus mockées
  const revenueData: RevenueData[] = [
    { month: "Août", revenue: 2800, bookings: 12 },
    { month: "Sept", revenue: 3200, bookings: 15 },
    { month: "Oct", revenue: 2900, bookings: 13 },
    { month: "Nov", revenue: 3500, bookings: 16 },
    { month: "Déc", revenue: 4200, bookings: 18 },
    { month: "Jan", revenue: 3800, bookings: 17 }
  ];

  const handleFilterChange = (status: string) => {
    setSelectedStatus(status);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <OwnerOnly>
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement du tableau de bord...</p>
            </div>
          </div>
        </OwnerOnly>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <OwnerOnly>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Dashboard
              properties={properties}
              stats={calculateStats()}
              recentActivity={recentActivity}
              revenueData={revenueData}
              onFilterChange={handleFilterChange}
              selectedStatus={selectedStatus}
            />
          </div>
        </div>
      </OwnerOnly>
    </ProtectedRoute>
  );
}
