"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { OwnerOnly } from "@/components/shared/RoleGuard";
import Dashboard from "@/modules/dashboard/components/Dashboard";
import { useDashboard } from "@/hooks/useDashboard";
import { useAuth } from "@/hooks/useAuth";
import { DashboardSkeleton } from "@/modules/dashboard/components/DashboardSkeleton";

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getCurrentUser, isInitialLoading } = useAuth();
  
  const [selectedStatus, setSelectedStatus] = useState("all");
  const { properties, stats, recentActivity, revenueData, loading, error, authLoading, refetch } = useDashboard();
  
  // Gérer le paramètre de rafraîchissement
  useEffect(() => {
    const refresh = searchParams.get('refresh');
    if (refresh === 'true') {
      // Forcer la revalidation des données utilisateur et du dashboard
      getCurrentUser();
      refetch();
      // Nettoyer l'URL
      router.replace('/dashboard');
    }
  }, [searchParams, getCurrentUser, router, refetch]);
  
  const handleFilterChange = (status: string) => {
    setSelectedStatus(status);
  };

  // Afficher le skeleton pendant le chargement initial ou le chargement des données
  if (authLoading || loading || isInitialLoading) {
    return <DashboardSkeleton />;
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
