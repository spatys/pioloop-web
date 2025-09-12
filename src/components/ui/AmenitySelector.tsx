"use client";

import React, { useState } from "react";
import { Amenity, AmenityCategory } from "@/core/types/Amenity";

interface AmenitySelectorProps {
  amenitiesByCategory: AmenityCategory[];
  selectedAmenityIds: number[];
  onAmenityChange: (amenityIds: number[]) => void;
  loading?: boolean;
  className?: string;
}

export const AmenitySelector: React.FC<AmenitySelectorProps> = ({
  amenitiesByCategory,
  selectedAmenityIds,
  onAmenityChange,
  loading = false,
  className = "",
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(amenitiesByCategory.map(cat => cat.category))
  );

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleAmenity = (amenityId: number) => {
    const newSelected = selectedAmenityIds.includes(amenityId)
      ? selectedAmenityIds.filter(id => id !== amenityId)
      : [...selectedAmenityIds, amenityId];
    
    onAmenityChange(newSelected);
  };

  const isAmenitySelected = (amenityId: number) => {
    return selectedAmenityIds.includes(amenityId);
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="mb-4">
              <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="h-10 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Équipements disponibles
        </h3>
        <span className="text-sm text-gray-500">
          {selectedAmenityIds.length} sélectionné{selectedAmenityIds.length > 1 ? 's' : ''}
        </span>
      </div>

      {amenitiesByCategory.map((category) => (
        <div key={category.category} className="space-y-3">
          {/* En-tête de catégorie */}
          <button
            onClick={() => toggleCategory(category.category)}
            className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <h4 className="text-base font-medium text-gray-900">
              {category.category}
            </h4>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${
                expandedCategories.has(category.category) ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Liste des amenities */}
          {expandedCategories.has(category.category) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-4">
              {category.amenities.map((amenity) => (
                <label
                  key={amenity.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    isAmenitySelected(amenity.id)
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isAmenitySelected(amenity.id)}
                    onChange={() => toggleAmenity(amenity.id)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-lg">{amenity.icon}</span>
                  <span className={`font-medium ${
                    isAmenitySelected(amenity.id) ? 'text-purple-800' : 'text-gray-700'
                  }`}>
                    {amenity.name}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Actions rapides */}
      <div className="flex gap-2 pt-4 border-t border-gray-200">
        <button
          onClick={() => onAmenityChange([])}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          Tout désélectionner
        </button>
        <button
          onClick={() => {
            const allIds = amenitiesByCategory.flatMap(cat => cat.amenities.map(a => a.id));
            onAmenityChange(allIds);
          }}
          className="px-4 py-2 text-sm text-purple-600 hover:text-purple-800 transition-colors"
        >
          Tout sélectionner
        </button>
      </div>
    </div>
  );
};
