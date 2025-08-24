"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Property } from "@/core/types/Property";
import { getPropertyService } from "@/core/di/container";
import { PropertyCard } from "./PropertyCard";

export const LatestProperties: React.FC = () => {
  const [latestProperties, setLatestProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestProperties = async () => {
      try {
        const propertyService = getPropertyService();
        const response = await propertyService.searchProperties({
          page: 1,
          pageSize: 5
        });
        
        // Trier par date de création (les plus récents en premier)
        const sortedProperties = response.properties.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        setLatestProperties(sortedProperties);
      } catch (error) {
        console.error("Erreur lors de la récupération des derniers logements:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestProperties();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-normal text-gray-700 mb-4">
              Derniers Logements Ajoutés
            </h2>
            <p className="text-lg text-gray-600">
              Découvrez nos nouvelles propriétés disponibles
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête de section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-normal text-gray-900 mb-4">
            Derniers Logements Ajoutés
          </h2>
          <p className="text-lg text-gray-600">
            Découvrez nos nouvelles propriétés disponibles
          </p>
        </div>

        {/* Grille des propriétés */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {latestProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {/* Bouton "Voir plus" */}
        <div className="text-center mt-12">
          <Link
            href="/properties"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
          >
            Voir Tous les Logements
            <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};
