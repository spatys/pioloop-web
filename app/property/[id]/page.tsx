"use client";

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useProperty } from '@/hooks/useProperty';
import { PropertyDetailView } from '@/modules/property/components/PropertyDetailView';

export default function PropertyPage() {
  const params = useParams();
  const propertyId = params.id as string;
  
  const { property, loading, error } = useProperty(propertyId);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la propriété...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Erreur</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">🏠</div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Propriété non trouvée</h1>
          <p className="text-gray-600 mb-4">Cette propriété n'existe pas ou a été supprimée.</p>
          <button 
            onClick={() => window.history.back()} 
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return <PropertyDetailView property={property} />;
}
