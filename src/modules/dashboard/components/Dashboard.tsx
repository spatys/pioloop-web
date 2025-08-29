"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
  XCircle,
  TrendingUp,
  TrendingDown,
  Star,
  MessageSquare,
  DollarSign,
  BarChart3,
  Activity,
  Filter,
  Search,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { PropertyCard } from "@/modules/property/components/PropertyCard";
import { Property as PropertyCardType } from "@/core/types/Property";

interface DashboardProperty {
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
    default:
      return {
        label: status,
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: Clock,
        bgColor: "bg-gray-50"
      };
  }
};

interface DashboardProps {
  properties: DashboardProperty[]; // Doit être filtré par ownerId
  stats: DashboardStats;
  recentActivity: RecentActivity[];
  revenueData: RevenueData[];
  onFilterChange: (status: string) => void;
  selectedStatus: string;
}

// Fonction pour transformer DashboardProperty en PropertyCardType
const transformToPropertyCard = (dashboardProperty: DashboardProperty): PropertyCardType => {
  return {
    id: dashboardProperty.id,
    title: dashboardProperty.title,
    description: dashboardProperty.description,
    propertyType: dashboardProperty.propertyType,
    maxGuests: dashboardProperty.maxGuests,
    bedrooms: dashboardProperty.bedrooms,
    beds: dashboardProperty.bedrooms, // Utiliser bedrooms comme approximation
    bathrooms: 1, // Valeur par défaut
    squareMeters: 100, // Valeur par défaut
    address: dashboardProperty.address,
    neighborhood: dashboardProperty.city, // Utiliser city comme neighborhood
    city: dashboardProperty.city,
    postalCode: "", // Valeur par défaut
    latitude: undefined,
    longitude: undefined,
    pricePerNight: dashboardProperty.pricePerNight,
    cleaningFee: 0, // Valeur par défaut
    serviceFee: 0, // Valeur par défaut
    status: dashboardProperty.status,
    ownerId: "", // Valeur par défaut
    imageUrls: dashboardProperty.images.map(img => img.imageUrl),
    amenities: [], // Valeur par défaut
    createdAt: new Date(dashboardProperty.createdAt),
    updatedAt: new Date(dashboardProperty.createdAt)
  };
};

export default function Dashboard({ 
  properties, 
  stats, 
  recentActivity, 
  revenueData,
  onFilterChange,
  selectedStatus 
}: DashboardProps) {
  
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProperties = properties.filter(prop => {
    const matchesStatus = selectedStatus === "all" || prop.status === selectedStatus;
    const matchesSearch = prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prop.city.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });
  

  const topPerformingProperties = properties
    .filter(p => p.monthlyRevenue && p.occupancyRate)
    .sort((a, b) => (b.monthlyRevenue || 0) - (a.monthlyRevenue || 0))
    .slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Header avec actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600 mt-1">Gérez vos logements et suivez vos performances</p>
        </div>
        <button
          onClick={() => router.push("/property/add")}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Ajouter un logement</span>
        </button>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenus totaux</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalRevenue.toLocaleString()} €
              </p>
              <div className="flex items-center mt-2">
                {stats.revenueGrowth >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${
                  stats.revenueGrowth >= 0 ? "text-green-600" : "text-red-600"
                }`}>
                  {Math.abs(stats.revenueGrowth)}%
                </span>
                <span className="text-sm text-gray-500 ml-1">vs mois dernier</span>
              </div>
            </div>
            <div className="bg-green-100 rounded-lg p-3">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taux d'occupation</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.occupancyRate}%</p>
              <p className="text-sm text-gray-500 mt-1">{stats.activeBookings} réservations actives</p>
            </div>
            <div className="bg-blue-100 rounded-lg p-3">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Note moyenne</p>
              <div className="flex items-center mt-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-2xl font-semibold text-gray-900 ml-1">{stats.averageRating}</span>
                <span className="text-sm text-gray-500 ml-1">/5</span>
              </div>
              <p className="text-sm text-gray-500">{stats.totalReviews} avis</p>
            </div>
            <div className="bg-yellow-100 rounded-lg p-3">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Logements</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalProperties}</p>
              <div className="flex items-center mt-2 space-x-2">
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {stats.publishedProperties} publiés
                </span>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  {stats.pendingApprovals} en attente
                </span>
              </div>
            </div>
            <div className="bg-purple-100 rounded-lg p-3">
              <Home className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Graphique des revenus et activité récente */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique des revenus */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Évolution des revenus</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">6 derniers mois</span>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between space-x-2">
            {revenueData.length > 0 ? (
              revenueData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-gray-200 rounded-t relative">
                    <div 
                      className="bg-purple-600 rounded-t transition-all duration-500"
                      style={{ 
                        height: `${(data.revenue / Math.max(...revenueData.map(d => d.revenue))) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">{data.month}</p>
                  <p className="text-xs font-medium text-gray-900">{data.revenue}€</p>
                </div>
              ))
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-gray-500 text-sm">Aucune donnée de revenus disponible</p>
              </div>
            )}
          </div>
        </div>

        {/* Activité récente */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Activité récente</h3>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === "booking" ? "bg-green-500" :
                    activity.type === "review" ? "bg-yellow-500" :
                    activity.type === "payment" ? "bg-blue-500" :
                    "bg-orange-500"
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                    <p className="text-xs text-gray-500 truncate">{activity.propertyTitle}</p>
                    <p className="text-xs text-gray-400">{activity.timestamp}</p>
                  </div>
                  {activity.amount && (
                    <span className="text-sm font-medium text-green-600">+{activity.amount}€</span>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Activity className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Aucune activité récente</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logements les plus performants */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Logements les plus performants</h3>
        {topPerformingProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topPerformingProperties.map((property, index) => (
              <div key={property.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 truncate">{property.title}</h4>
                  <span className="text-sm text-gray-500">#{index + 1}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Revenus mensuels</span>
                    <span className="font-medium text-green-600">{property.monthlyRevenue}€</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taux d'occupation</span>
                    <span className="font-medium">{property.occupancyRate}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Note</span>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="ml-1">{property.rating || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Home className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Aucun logement performant pour le moment</p>
          </div>
        )}
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Mes logements</h3>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un logement..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => onFilterChange(e.target.value)}
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

        {/* Liste des logements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProperties.map((property) => {
            const statusInfo = getStatusInfo(property.status);
            const StatusIcon = statusInfo.icon;
            
            return (
              <div key={property.id} className="relative group">
                {/* Badge de statut */}
                <div className="absolute top-3 right-3 z-10">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusInfo.label}
                  </span>
                </div>
                
                {/* PropertyCard */}
                <div className="relative">
                  <PropertyCard property={transformToPropertyCard(property)} />
                  
                  {/* Actions overlay au survol */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => router.push(`/property/${property.id}`)}
                        className="flex items-center px-3 py-2 bg-white text-purple-600 rounded-md hover:bg-purple-50 transition-colors"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </button>
                      
                      <button
                        onClick={() => router.push(`/property/${property.id}/edit`)}
                        className="flex items-center px-3 py-2 bg-white text-gray-600 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Modifier
                      </button>
                      
                      <button
                        onClick={() => {
                          // TODO: Implement delete confirmation
                          console.log("Delete property:", property.id);
                        }}
                        className="flex items-center px-3 py-2 bg-white text-red-600 rounded-md hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Revenus mensuels si disponibles */}
                {property.monthlyRevenue && (
                  <div className="absolute bottom-3 left-3 z-10">
                    <div className="bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                      +{property.monthlyRevenue}€/mois
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <Home className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun logement trouvé</h3>
            <p className="mt-1 text-sm text-gray-500">
              {selectedStatus === "all" && !searchTerm
                ? "Commencez par ajouter votre premier logement."
                : "Aucun logement ne correspond à vos critères."
              }
            </p>
            {selectedStatus === "all" && !searchTerm && (
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
        )}
      </div>
    </div>
  );
}
