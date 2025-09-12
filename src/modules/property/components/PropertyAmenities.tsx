"use client";

import React, { useState } from 'react';
import { PropertyResponse } from '@/core/types/Property';

interface PropertyAmenitiesProps {
  property: PropertyResponse;
}

export const PropertyAmenities: React.FC<PropertyAmenitiesProps> = ({ property }) => {
  const [activeTab, setActiveTab] = useState<string>('');

  // Utiliser directement les amenities de la propriété
  const propertyAmenities = property.amenities || [];

  // Grouper les amenities par catégorie
  const amenitiesByCategory = propertyAmenities.reduce((acc, amenity) => {
    const category = amenity.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(amenity);
    return acc;
  }, {} as Record<string, typeof propertyAmenities>);

  const categories = Object.keys(amenitiesByCategory).sort();
  
  // Définir la première catégorie comme active par défaut
  if (!activeTab && categories.length > 0) {
    setActiveTab(categories[0]);
  }

  // Si pas d'équipements
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

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Équipements</h3>
      
      {/* Onglets */}
      <div className="bg-white rounded-t-lg border border-gray-200 border-b-0">
        <nav className="-mb-px grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-0">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-all duration-200 text-center ${
                activeTab === category
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-green-600 hover:border-green-300'
              }`}
            >
              {category}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenu des onglets */}
      <div className="bg-white rounded-b-lg border border-gray-200 border-t-0">
        {activeTab && amenitiesByCategory[activeTab] && (
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {amenitiesByCategory[activeTab]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((amenity) => (
                  <div
                    key={amenity.id}
                    className="flex items-center p-4 rounded-lg border border-green-200 bg-green-50 shadow-sm"
                  >
                    {/* Icône de disponibilité */}
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>

                    {/* Nom de l'amenity */}
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-green-900">
                        {amenity.name}
                      </span>
                    </div>
                  </div>
                ))}
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
              Certains équipements peuvent ne pas être disponibles ou fonctionner différemment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};