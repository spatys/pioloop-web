"use client";

import React, { useState } from "react";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { OwnerOnly } from "@/components/shared/RoleGuard";
import Dashboard from "@/modules/dashboard/components/Dashboard";
import { useDashboard } from "@/hooks/useDashboard";
import { PageLoader } from "@/components/ui/PageLoader";

export default function DashboardPage() {
  
  const [selectedStatus, setSelectedStatus] = useState("all");
  const { properties, stats, recentActivity, revenueData, loading, error, authLoading } = useDashboard();
  
  const handleFilterChange = (status: string) => {
    setSelectedStatus(status);
  };

  if (authLoading || loading) {
    return (
      <ProtectedRoute>
        <OwnerOnly>
          <PageLoader />
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
              stats={stats}
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
