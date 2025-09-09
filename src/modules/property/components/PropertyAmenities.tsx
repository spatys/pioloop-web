"use client";

import React from 'react';
import { PropertyResponse } from '@/core/types/Property';

interface PropertyAmenitiesProps {
  property: PropertyResponse;
}

export const PropertyAmenities: React.FC<PropertyAmenitiesProps> = ({ property }) => {
  // Liste des équipements basée sur les données de la propriété
  const amenities = [
    {
      category: 'Essentiels',
      items: [
        { name: 'Wi-Fi', available: true, icon: '📶' },
        { name: 'Cuisine équipée', available: true, icon: '🍳' },
        { name: 'Lave-linge', available: true, icon: '🧺' },
        { name: 'Chauffage', available: true, icon: '🔥' },
        { name: 'Climatisation', available: true, icon: '❄️' },
      ]
    },
    {
      category: 'Sécurité',
      items: [
        { name: 'Détecteur de fumée', available: true, icon: '🚨' },
        { name: 'Détecteur de monoxyde de carbone', available: true, icon: '⚠️' },
        { name: 'Sécurité 24h/24', available: false, icon: '🔒' },
        { name: 'Caméras de surveillance', available: false, icon: '📹' },
      ]
    },
    {
      category: 'Extérieur',
      items: [
        { name: 'Parking gratuit', available: true, icon: '🅿️' },
        { name: 'Jardin', available: false, icon: '🌳' },
        { name: 'Piscine', available: false, icon: '🏊' },
        { name: 'Terrasse', available: true, icon: '🪑' },
        { name: 'Barbecue', available: false, icon: '🔥' },
      ]
    },
    {
      category: 'Famille',
      items: [
        { name: 'Équipements bébé', available: false, icon: '👶' },
        { name: 'Jeux pour enfants', available: false, icon: '🧸' },
        { name: 'Chaise haute', available: false, icon: '🪑' },
        { name: 'Lit bébé', available: false, icon: '🛏️' },
      ]
    },
    {
      category: 'Accessibilité',
      items: [
        { name: 'Accès fauteuil roulant', available: false, icon: '♿' },
        { name: 'Ascenseur', available: false, icon: '🛗' },
        { name: 'Rampes d\'accès', available: false, icon: '🛤️' },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Équipements</h3>
      
      {amenities.map((category, categoryIndex) => (
        <div key={categoryIndex} className="space-y-3">
          <h4 className="text-lg font-medium text-gray-900">{category.category}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {category.items.map((amenity, itemIndex) => (
              <div
                key={itemIndex}
                className={`flex items-center space-x-3 p-3 rounded-lg ${
                  amenity.available 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <span className="text-xl">{amenity.icon}</span>
                <span className={`font-medium ${
                  amenity.available ? 'text-green-800' : 'text-gray-500'
                }`}>
                  {amenity.name}
                </span>
                {amenity.available && (
                  <svg className="w-4 h-4 text-green-600 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

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
