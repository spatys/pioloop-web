"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { OwnerOnly } from "@/components/shared/RoleGuard";
import { 
  Home, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar,
  Users,
  MapPin,
  Euro,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react";

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
}

const getStatusInfo = (status: string) => {
  switch (status) {
    case "PendingApproval":
      return {
        label: "En attente de validation",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: Clock,
        bgColor: "bg-yellow-50"
      };
    case "Published":
      return {
        label: "Publié",
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
        bgColor: "bg-green-50"
      };
    case "Rented":
      return {
        label: "Loué",
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: Users,
        bgColor: "bg-blue-50"
      };
    case "Maintenance":
      return {
        label: "En maintenance",
        color: "bg-orange-100 text-orange-800 border-orange-200",
        icon: AlertCircle,
        bgColor: "bg-orange-50"
      };
    case "Deleted":
      return {
        label: "Supprimé",
        color: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle,
        bgColor: "bg-red-50"
      };
    default:
      return {
        label: status,
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: Clock,
        bgColor: "bg-gray-50"
      };
  }
};

export default function DashboardPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Mock data - à remplacer par un vrai appel API
  useEffect(() => {
    const mockProperties: Property[] = [
      {
        id: "1",
        title: "Appartement moderne au cœur de Douala",
        description: "Magnifique appartement avec vue sur la ville",
        propertyType: "Appartement",
        address: "123 Rue de la Paix",
        city: "Douala",
        pricePerNight: 45000,
        status: "PendingApproval",
        maxGuests: 4,
        bedrooms: 2,
        images: [
          { imageUrl: "/images/placeholder-property.jpg", altText: "Appartement" }
        ],
        createdAt: "2024-01-15T10:30:00Z"
      },
      {
        id: "2",
        title: "Villa avec piscine à Yaoundé",
        description: "Villa spacieuse avec jardin et piscine privée",
        propertyType: "Villa",
        address: "456 Avenue des Palmiers",
        city: "Yaoundé",
        pricePerNight: 75000,
        status: "Published",
        maxGuests: 6,
        bedrooms: 3,
        images: [
          { imageUrl: "/images/placeholder-property.jpg", altText: "Villa" }
        ],
        createdAt: "2024-01-10T14:20:00Z"
      }
    ];

    setTimeout(() => {
      setProperties(mockProperties);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredProperties = selectedStatus === "all" 
    ? properties 
    : properties.filter(prop => prop.status === selectedStatus);

  const stats = {
    total: properties.length,
    pending: properties.filter(p => p.status === "PendingApproval").length,
    published: properties.filter(p => p.status === "Published").length,
    rented: properties.filter(p => p.status === "Rented").length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <OwnerOnly>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Tableau de bord</h1>
              <p className="text-gray-600 mt-1">Gérez vos logements et suivez vos réservations</p>
            </div>
            <button
              onClick={() => router.push("/property/add")}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Ajouter un logement</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 rounded-lg p-3">
                <Home className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total logements</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 rounded-lg p-3">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-lg p-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Publiés</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.published}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-lg p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Loués</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.rented}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Properties List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Mes logements</h2>
              <div className="flex space-x-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="PendingApproval">En attente de validation</option>
                  <option value="Published">Publiés</option>
                  <option value="Rented">Loués</option>
                  <option value="Maintenance">En maintenance</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-6">
            {filteredProperties.length === 0 ? (
              <div className="text-center py-12">
                <Home className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun logement</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedStatus === "all" 
                    ? "Commencez par ajouter votre premier logement."
                    : "Aucun logement avec ce statut."
                  }
                </p>
                {selectedStatus === "all" && (
                  <div className="mt-6">
                    <button
                      onClick={() => router.push("/property/add")}
                      className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                    >
                      Ajouter un logement
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProperties.map((property) => {
                  const statusInfo = getStatusInfo(property.status);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <div key={property.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      {/* Image */}
                      <div className="aspect-video bg-gray-200 relative">
                        <img
                          src={property.images[0]?.imageUrl || "/images/placeholder-property.jpg"}
                          alt={property.images[0]?.altText || property.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusInfo.label}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-1">
                          {property.title}
                        </h3>
                        
                        <div className="flex items-center text-sm text-gray-600 mb-3">
                          <MapPin className="h-4 w-4 mr-1" />
                          {property.city}
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="h-4 w-4 mr-2" />
                            {property.maxGuests} voyageurs
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Home className="h-4 w-4 mr-2" />
                            {property.bedrooms} chambres
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center text-lg font-semibold text-gray-900">
                            <Euro className="h-5 w-5 mr-1" />
                            {property.pricePerNight.toLocaleString()} / nuit
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <button
                            onClick={() => router.push(`/property/${property.id}`)}
                            className="flex items-center text-sm text-purple-600 hover:text-purple-700"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Voir
                          </button>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => router.push(`/property/${property.id}/edit`)}
                              className="flex items-center text-sm text-gray-600 hover:text-gray-700"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Modifier
                            </button>
                            
                            <button
                              onClick={() => {
                                // TODO: Implement delete confirmation
                                console.log("Delete property:", property.id);
                              }}
                              className="flex items-center text-sm text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Supprimer
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
              </div>
      </div>
    </OwnerOnly>
  </ProtectedRoute>
);
}
