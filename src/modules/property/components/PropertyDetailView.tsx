"use client";

import React, { useState } from 'react';
import { PropertyResponse } from '@/core/types/Property';
import { PropertyImageGallery } from './PropertyImageGallery';
import { PropertyInfo } from './PropertyInfo';
import { PropertyAmenitiesAccordion } from './PropertyAmenitiesAccordion';
import { PropertyLocation } from './PropertyLocation';
import { PropertyBookingCard } from './PropertyBookingCard';
import { PropertyReviews } from './PropertyReviews';
import { PropertyHost } from './PropertyHost';

interface PropertyDetailViewProps {
  property: PropertyResponse;
}

export const PropertyDetailView: React.FC<PropertyDetailViewProps> = ({ property }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'amenities' | 'location' | 'reviews'>('overview');

  return (
    <div className="min-h-screen bg-white">
      {/* Header avec navigation */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => window.history.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Retour</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* Galerie d'images */}
            <PropertyImageGallery images={property.images || []} title={property.title} />

            {/* Informations principales */}
            <PropertyInfo property={property} />

            {/* Navigation par onglets */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'overview', label: 'Aperçu', icon: '🏠' },
                  { id: 'amenities', label: 'Équipements', icon: '✨' },
                  { id: 'location', label: 'Localisation', icon: '📍' },
                  { id: 'reviews', label: 'Avis', icon: '⭐' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Contenu des onglets */}
            <div className="py-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">À propos de ce logement</h3>
                    <p className="text-gray-700 leading-relaxed">{property.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-semibold text-gray-900">{property.maxGuests}</div>
                      <div className="text-sm text-gray-600">Voyageurs</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-semibold text-gray-900">{property.bedrooms}</div>
                      <div className="text-sm text-gray-600">Chambres</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-semibold text-gray-900">{property.bathrooms}</div>
                      <div className="text-sm text-gray-600">Salles de bain</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-semibold text-gray-900">{property.squareMeters}m²</div>
                      <div className="text-sm text-gray-600">Surface</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'amenities' && <PropertyAmenitiesAccordion property={property} />}
              {activeTab === 'location' && <PropertyLocation property={property} />}
              {activeTab === 'reviews' && <PropertyReviews property={property} />}
            </div>
          </div>

          {/* Colonne latérale - Carte de réservation avec calendrier */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <PropertyBookingCard property={property} />
            </div>
          </div>
        </div>

        {/* Section hôte */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <PropertyHost property={property} />
        </div>
      </div>
    </div>
  );
};
