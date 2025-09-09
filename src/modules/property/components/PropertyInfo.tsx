"use client";

import React, { useState } from 'react';
import { PropertyResponse, getPropertyStatusLabel, getPropertyStatusColor } from '@/core/types/Property';

interface PropertyInfoProps {
  property: PropertyResponse;
}

export const PropertyInfo: React.FC<PropertyInfoProps> = ({ property }) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const statusColor = getPropertyStatusColor(property.status);
  const statusLabel = getPropertyStatusLabel(property.status);

  const getStatusBadgeColor = () => {
    switch (statusColor) {
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec titre et statut */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">{property.title}</h1>
          <div className="flex items-center space-x-4 text-gray-600">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm">{property.city}, {property.country}</span>
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">Ajouté le {new Date(property.createdAt).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor()}`}>
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Type de propriété et note */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
            {property.propertyType}
          </span>
          {property.averageRating && (
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-medium text-gray-900">{property.averageRating.toFixed(1)}</span>
              <span className="text-sm text-gray-500">({property.reviewCount || 0} avis)</span>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
        <div className="text-gray-700 leading-relaxed">
          {isDescriptionExpanded ? (
            <p>{property.description}</p>
          ) : (
            <p>
              {property.description.length > 200 
                ? `${property.description.substring(0, 200)}...` 
                : property.description
              }
            </p>
          )}
          {property.description.length > 200 && (
            <button
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="text-purple-600 hover:text-purple-700 font-medium mt-2 transition-colors"
            >
              {isDescriptionExpanded ? 'Voir moins' : 'Voir plus'}
            </button>
          )}
        </div>
      </div>

      {/* Caractéristiques principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-semibold text-gray-900">{property.maxGuests}</div>
          <div className="text-sm text-gray-600">Voyageurs max</div>
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

      {/* Adresse complète */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2">Adresse complète</h4>
        <p className="text-gray-700">{property.address}</p>
        <p className="text-gray-700">{property.postalCode} {property.city}, {property.country}</p>
      </div>
    </div>
  );
};
