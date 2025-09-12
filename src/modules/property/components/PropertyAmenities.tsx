"use client";

import React, { useState } from 'react';
import { PropertyResponse } from '@/core/types/Property';
import { useAmenities } from '@/hooks/useAmenities';
import { Amenity } from '@/core/types/Amenity';

interface PropertyAmenitiesProps {
  property: PropertyResponse;
}

export const PropertyAmenities: React.FC<PropertyAmenitiesProps> = ({ property }) => {
  const { amenities, loading, error } = useAmenities();
  const [activeTab, setActiveTab] = useState<string>('');

  if (loading) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">Équipements</h3>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <div className="h-5 bg-gray-200 rounded w-1/4 mb-3"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">Équipements</h3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Erreur lors du chargement des équipements</p>
        </div>
      </div>
    );
  }

  // Grouper les amenities par catégorie
  const amenitiesByCategory = amenities.reduce((acc, amenity) => {
    const category = amenity.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(amenity);
    return acc;
  }, {} as Record<string, Amenity[]>);

  const categories = Object.keys(amenitiesByCategory).sort();
  
  // Définir la première catégorie comme active par défaut
  if (!activeTab && categories.length > 0) {
    setActiveTab(categories[0]);
  }

  // Utiliser les noms des amenities de la propriété pour la correspondance
  const propertyAmenityNames = property.amenities?.map(amenity => amenity.name) || [];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Équipements</h3>
      
      {/* Onglets */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === category
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenu des onglets */}
      <div className="min-h-[300px]">
        {activeTab && amenitiesByCategory[activeTab] && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {amenitiesByCategory[activeTab]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((amenity) => {
                const isAvailable = propertyAmenityNames.includes(amenity.name);
                return (
                  <div
                    key={amenity.id}
                    className={`flex flex-col items-center space-y-2 p-4 rounded-lg border-2 transition-all duration-200 ${
                      isAvailable
                        ? 'border-green-500 bg-green-50 shadow-md'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <span className="text-3xl">{amenity.icon}</span>
                    <span className={`text-sm font-medium text-center ${
                      isAvailable ? 'text-green-800' : 'text-gray-500'
                    }`}>
                      {amenity.name}
                    </span>
                    {isAvailable && (
                      <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}
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
