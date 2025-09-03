"use client";

import React from "react";
import { PropertyCard } from "./PropertyCard";
import { usePopularProperties } from "@/hooks/usePopularProperties";
import { PropertySkeleton } from "./PropertySkeleton";
import { BoutonLink } from "@/components/ui/BoutonLink";

export const PopularProperties: React.FC = () => {
  const { popularProperties, isLoading, error } = usePopularProperties(5);

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-normal text-gray-700 mb-4">
              Erreur de chargement
            </h2>
            <p className="text-lg text-gray-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-normal text-gray-700 mb-4">
              Logements Populaires
            </h2>
            <p className="text-lg text-gray-600">
              Découvrez nos logements les plus recherchés
            </p>
          </div>

          <PropertySkeleton count={5} />
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 bg-gray-50">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12">
        {/* En-tête de section */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-normal text-gray-900 mb-4">
            Logements Populaires & Coups de Cœur
          </h2>
                      <p className="text-lg text-gray-600">
              Découvrez nos logements les plus recherchés et appréciés par nos voyageurs
            </p>
        </div>

        {/* Grille des propriétés */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
          {popularProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {/* Bouton "Voir plus" */}
        <div className="text-center mt-12">
          <BoutonLink href="/properties" variant="default" size="md">
            Voir Tous les Logements
            <svg
              className="ml-2 -mr-1 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </BoutonLink>
        </div>
      </div>
    </section>
  );
};
