"use client";

import React from 'react';
import { PropertyResponse } from '@/core/types/Property';

interface PropertyLocationProps {
  property: PropertyResponse;
}

export const PropertyLocation: React.FC<PropertyLocationProps> = ({ property }) => {
  const nearbyPlaces = [
    { name: 'Centre-ville', distance: '2 km', icon: '🏙️' },
    { name: 'Aéroport', distance: '15 km', icon: '✈️' },
    { name: 'Gare', distance: '3 km', icon: '🚉' },
    { name: 'Hôpital', distance: '1.5 km', icon: '🏥' },
    { name: 'Supermarché', distance: '500 m', icon: '🛒' },
    { name: 'Restaurant', distance: '200 m', icon: '🍽️' },
    { name: 'Pharmacie', distance: '300 m', icon: '💊' },
    { name: 'Banque', distance: '400 m', icon: '🏦' },
  ];

  const transportOptions = [
    { name: 'Bus', description: 'Arrêt à 100m', icon: '🚌' },
    { name: 'Taxi', description: 'Disponible 24h/24', icon: '🚕' },
    { name: 'Vélo', description: 'Piste cyclable à proximité', icon: '🚴' },
    { name: 'Voiture', description: 'Parking gratuit sur place', icon: '🚗' },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-normal text-gray-900">Localisation</h3>
      
      {/* Adresse complète */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2">Adresse exacte</h4>
        <p className="text-gray-700">{property.address}</p>
        <p className="text-gray-700">{property.postalCode} {property.city}, {property.country}</p>
      </div>

      {/* Carte (placeholder) */}
      <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-4xl mb-2">🗺️</div>
          <p className="text-gray-500">Carte interactive</p>
          <p className="text-sm text-gray-400">Coordonnées: {property.latitude}, {property.longitude}</p>
        </div>
      </div>

      {/* Lieux à proximité */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">Lieux à proximité</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {nearbyPlaces.map((place, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg">
              <span className="text-xl">{place.icon}</span>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{place.name}</p>
                <p className="text-sm text-gray-600">{place.distance}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Options de transport */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">Comment s'y rendre</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {transportOptions.map((transport, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg">
              <span className="text-xl">{transport.icon}</span>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{transport.name}</p>
                <p className="text-sm text-gray-600">{transport.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Informations sur le quartier */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">À propos du quartier</h4>
        <p className="text-sm text-blue-700">
          Ce logement est situé dans le quartier de {property.city}, une zone résidentielle 
          calme et bien desservie par les transports en commun. Vous trouverez tous les 
          commerces et services essentiels à proximité.
        </p>
      </div>

      {/* Conseils de voyage */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <h5 className="font-medium text-yellow-900">Conseils de voyage</h5>
            <ul className="text-sm text-yellow-700 mt-1 space-y-1">
              <li>• Vérifiez les horaires de transport avant votre départ</li>
              <li>• Gardez l'adresse exacte à portée de main</li>
              <li>• Contactez l'hôte en cas de difficulté pour trouver le logement</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
