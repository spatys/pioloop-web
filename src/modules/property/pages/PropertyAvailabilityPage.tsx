"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AvailabilityManager } from "@/components/ui/AvailabilityManager";
import { useAvailability } from "@/hooks/useAvailability";
import { ArrowLeft, Calendar, Settings, BarChart3 } from "lucide-react";

export default function PropertyAvailabilityPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;
  
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const {
    availabilities,
    calendar,
    loading: availabilityLoading,
    error: availabilityError,
    refresh
  } = useAvailability({
    propertyId,
    autoLoad: true
  });

  useEffect(() => {
    // TODO: Load property details
    // This would typically come from a property service
    const mockProperty = {
      id: propertyId,
      title: "Villa moderne avec piscine",
      basePrice: 45000,
      city: "Douala",
      neighborhood: "Bonanjo"
    };
    
    setProperty(mockProperty);
    setLoading(false);
  }, [propertyId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la propriété...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Propriété non trouvée</h1>
          <p className="text-gray-600 mb-4">La propriété que vous recherchez n'existe pas.</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Gestion de la disponibilité
                </h1>
                <p className="text-gray-600 mt-1">
                  {property.title} • {property.neighborhood}, {property.city}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push(`/property/${propertyId}/settings`)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings className="h-4 w-4" />
                <span>Paramètres</span>
              </button>
              
              <button
                onClick={() => router.push(`/property/${propertyId}/analytics`)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Analyses</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Property Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{property.title}</h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <span>📍 {property.neighborhood}, {property.city}</span>
                  <span>💰 {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(property.basePrice)}/nuit</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-gray-500">Périodes configurées</div>
              <div className="text-2xl font-semibold text-gray-900">{availabilities.length}</div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {availabilityError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-red-800">Erreur de chargement</h3>
                <p className="text-sm text-red-700 mt-1">{availabilityError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Availability Manager */}
        <AvailabilityManager
          propertyId={propertyId}
          basePrice={property.basePrice}
          onAvailabilityChange={(availabilities) => {
            console.log('Availability changed:', availabilities);
            // Handle availability changes
          }}
        />

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Disponibilité</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Marquez les dates disponibles pour les réservations. Par défaut, toutes les dates futures sont disponibles.
            </p>
            <button
              onClick={() => {
                // TODO: Implement quick availability toggle
                console.log('Toggle availability');
              }}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Marquer comme disponible
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Prix spéciaux</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Définissez des tarifs spéciaux pour les périodes de haute saison ou les événements spéciaux.
            </p>
            <button
              onClick={() => {
                // TODO: Implement special pricing
                console.log('Set special pricing');
              }}
              className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Définir prix spéciaux
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Maintenance</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Bloquez des dates pour la maintenance, les réparations ou vos propres réservations.
            </p>
            <button
              onClick={() => {
                // TODO: Implement maintenance blocking
                console.log('Block for maintenance');
              }}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Bloquer pour maintenance
            </button>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Conseils pour optimiser votre disponibilité</h3>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Planifiez vos prix spéciaux à l'avance pour les périodes de haute saison</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Bloquez les dates de maintenance au moins 48h à l'avance</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Utilisez les notes pour vous rappeler pourquoi certaines dates sont configurées</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Révisiez régulièrement votre calendrier pour maximiser vos revenus</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
