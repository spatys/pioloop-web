"use client";

import React, { useState } from 'react';
import { PropertyResponse } from '@/core/types/Property';
import { useAmenities } from '@/hooks/useAmenities';
import { Amenity } from '@/core/types/Amenity';

interface PropertyAmenitiesAccordionProps {
  property: PropertyResponse;
}

export const PropertyAmenitiesAccordion: React.FC<PropertyAmenitiesAccordionProps> = ({ property }) => {
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set());
  const { amenities, loading, error } = useAmenities();

  // Utiliser directement les amenities de la propriété
  const propertyAmenities = property.amenities || [];
  const propertyAmenityIds = propertyAmenities.map(a => a.id);

  // Si pas d'équipements dans la propriété
  if (propertyAmenities.length === 0) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">Équipements</h3>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <p className="text-gray-600">Aucun équipement renseigné pour cette propriété</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">Équipements</h3>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <p className="text-gray-600">Chargement des équipements...</p>
        </div>
      </div>
    );
  }

  if (error || !amenities) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">Équipements</h3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">Erreur lors du chargement des équipements</p>
        </div>
      </div>
    );
  }

  // Grouper tous les amenities par catégorie
  const allAmenitiesByCategory = amenities
    .filter(amenity => amenity.isActive)
    .reduce((acc, amenity) => {
      const category = amenity.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(amenity);
      return acc;
    }, {} as Record<string, Amenity[]>);

  const categories = Object.keys(allAmenitiesByCategory).sort();

  const isAmenitySelected = (amenity: Amenity) => {
    return propertyAmenityIds.includes(amenity.id);
  };

  // Fonction pour toggle un accordéon
  const toggleAccordion = (category: string) => {
    const newOpenAccordions = new Set(openAccordions);
    if (newOpenAccordions.has(category)) {
      newOpenAccordions.delete(category);
    } else {
      newOpenAccordions.add(category);
    }
    setOpenAccordions(newOpenAccordions);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Équipements</h3>
        <p className="text-gray-600 text-sm">
          Voici tous les équipements disponibles. Les équipements sélectionnés pour ce logement sont mis en évidence.
        </p>
      </div>

      <div className="space-y-4">
        {/* Accordéons */}
        <div className="space-y-2">
          {categories.map((category) => {
            const isOpen = openAccordions.has(category);
            const categoryAmenities = allAmenitiesByCategory[category];
            const selectedCount = categoryAmenities.filter(amenity => isAmenitySelected(amenity)).length;
            
            return (
              <div key={category} className="border border-gray-200 rounded-lg bg-white">
                {/* En-tête de l'accordéon */}
                <button
                  onClick={() => toggleAccordion(category)}
                  className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <h4 className="text-sm font-medium text-gray-900">{category}</h4>
                    {selectedCount > 0 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {selectedCount} disponible{selectedCount > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      {categoryAmenities.length} équipement{categoryAmenities.length > 1 ? 's' : ''}
                    </span>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Contenu de l'accordéon */}
                {isOpen && (
                  <div className="border-t border-gray-200 p-4">
                    <div className="flex flex-wrap gap-2">
                      {categoryAmenities
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((amenity) => {
                          const isSelected = isAmenitySelected(amenity);
                          return (
                            <span
                              key={amenity.id}
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                isSelected
                                  ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                  : 'bg-gray-100 text-gray-600 border border-gray-200'
                              }`}
                            >
                              {amenity.name}
                            </span>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Résumé des équipements disponibles */}
        {propertyAmenityIds.length > 0 && (
          <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h4 className="text-sm font-medium text-purple-800 mb-2">
              Équipements disponibles dans ce logement ({propertyAmenityIds.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {propertyAmenityIds.map((amenityId, index) => {
                const amenity = amenities.find(a => a.id === amenityId);
                return amenity ? (
                  <span
                    key={index}
                    className="inline-flex items-center space-x-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                  >
                    <span>{amenity.name}</span>
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>

      {/* Note sur les équipements */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h5 className="font-medium text-blue-900">À propos des équipements</h5>
            <p className="text-sm text-blue-700 mt-1">
              Cette liste d'équipements est basée sur les informations fournies par l'hôte. 
              Les équipements sélectionnés sont ceux disponibles dans ce logement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
