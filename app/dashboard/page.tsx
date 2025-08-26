"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { OwnerOnly } from "@/components/shared/RoleGuard";
import Dashboard from "@/modules/dashboard/components/Dashboard";
import { useDashboard } from "@/hooks/useDashboard";

export default function DashboardPage() {
  const { user } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState("all");
  const { properties, stats, recentActivity, revenueData, loading, error } = useDashboard();

  // Rediriger si pas d'utilisateur connecté
  if (!user) {
    return null; // ProtectedRoute gère la redirection
  }

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

  if (error) {
    return (
      <ProtectedRoute>
        <OwnerOnly>
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-600 text-lg font-medium mb-2">Erreur</div>
              <p className="text-gray-600">{error}</p>
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
              stats={stats || {
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
              }}
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
