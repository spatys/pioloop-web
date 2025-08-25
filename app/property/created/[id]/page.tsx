"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle, Camera, Calendar, Settings, Users, Star } from "lucide-react";
import { PropertyResponse } from "@/core/types/Property";
import { getPropertyService } from "@/core/di/container";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";

export default function PropertyCreatedPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<PropertyResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      if (params.id) {
        try {
          const propertyService = getPropertyService();
          const propertyData = await propertyService.getPropertyById(params.id as string);
          setProperty(propertyData);
        } catch (error) {
          console.error("Erreur lors de la récupération de la propriété:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProperty();
  }, [params.id]);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement de votre logement...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!property) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Propriété non trouvée</h1>
            <p className="text-gray-600 mb-4">La propriété que vous recherchez n'existe pas.</p>
            <button
              onClick={() => router.push("/property/add")}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Ajouter un nouveu logement
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* En-tête de succès */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Félicitations ! Votre logement a été créée
            </h1>
            <p className="text-lg text-gray-600">
              Votre logement "{property.title}" est maintenant en ligne
            </p>
          </div>

          {/* Carte de la propriété */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                  {property.imageUrls && property.imageUrls.length > 0 ? (
                    <img
                      src={property.imageUrls[0]}
                      alt={property.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Camera className="w-8 h-8 text-gray-400" />
                  )}
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {property.title}
                </h2>
                <p className="text-gray-600 mb-3">{property.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {property.maxGuests} voyageurs
                  </span>
                  <span className="flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    {property.bedrooms} chambres
                  </span>
                  <span className="text-purple-600 font-semibold">
                    {property.pricePerNight?.toLocaleString()} FCFA/nuit
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions recommandées */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Camera className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Améliorer les photos</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Ajoutez plus de photos de qualité pour attirer plus de voyageurs
              </p>
              <button
                onClick={() => router.push(`/property/edit/${property.id}`)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Modifier les photos
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Définir la disponibilité</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Configurez vos dates disponibles et vos tarifs
              </p>
              <button
                onClick={() => router.push(`/property/availability/${property.id}`)}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Gérer la disponibilité
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <Settings className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Paramètres avancés</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Personnalisez les règles, équipements et conditions
              </p>
              <button
                onClick={() => router.push(`/property/settings/${property.id}`)}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Configurer
              </button>
            </div>
          </div>

          {/* Actions principales */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/dashboard")}
              className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
            >
              Voir mon tableau de bord
            </button>
            <button
              onClick={() => router.push("/property/add")}
              className="px-8 py-3 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 font-medium"
            >
              Ajouter une autre propriété
            </button>
            <button
              onClick={() => router.push("/")}
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Retour à l'accueil
            </button>
          </div>

          {/* Informations importantes */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              Prochaines étapes importantes
            </h3>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Votre propriété sera visible dans les résultats de recherche sous 24h</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Configurez vos méthodes de paiement pour recevoir les réservations</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Activez les notifications pour être informé des nouvelles demandes</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
