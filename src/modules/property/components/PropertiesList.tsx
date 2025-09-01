"use client";

import React, { useRef, useCallback } from "react";
import { useInfiniteProperties } from "@/modules/property/hooks/useInfiniteProperties";
import { PropertyCard } from "./PropertyCard";
import { Property, convertPropertyResponseToProperty } from "@/core/types/Property";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export const PropertiesList: React.FC = () => {
  const {
    properties,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    error
  } = useInfiniteProperties();

  const observer = useRef<IntersectionObserver>();
  const lastPropertyRef = useCallback((node: HTMLDivElement) => {
    if (isLoading) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-medium">
          Une erreur est survenue lors du chargement des logements
        </div>
        <p className="text-gray-500 mt-2">
          Veuillez réessayer plus tard
        </p>
      </div>
    );
  }

  if (properties.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">
          Aucun logement disponible pour le moment
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Grille des logements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {properties.map((propertyResponse, index) => {
          // Convertir PropertyResponse en Property
          const property = convertPropertyResponseToProperty(propertyResponse);
          
          // Ajouter la ref au dernier élément pour déclencher le chargement
          if (properties.length === index + 1) {
            return (
              <div key={property.id} ref={lastPropertyRef}>
                <PropertyCard property={property} />
              </div>
            );
          }
          
          return (
            <div key={property.id}>
              <PropertyCard property={property} />
            </div>
          );
        })}
      </div>

      {/* Loader pour le chargement de la page suivante */}
      {isFetchingNextPage && (
        <LoadingSpinner 
          size="md" 
          text="Chargement de plus de logements..." 
          className="py-8" 
        />
      )}

      {/* Loader initial */}
      {isLoading && (
        <LoadingSpinner 
          size="lg" 
          text="Chargement des logements..." 
          className="py-12" 
        />
      )}
    </div>
  );
};
