"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Property, getPropertyStatusLabel, getPropertyStatusColor } from "@/core/types/Property";

interface PropertyCardProps {
  property: Property;
  showFavorite?: boolean; // Par défaut true, false pour le dashboard
  showActions?: boolean; // Par défaut false, true pour le dashboard
  showStatus?: boolean; // Par défaut false, true pour afficher le statut à la place du favori
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, showFavorite = true, showActions = false, showStatus = false }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    console.log("Toggle favoris pour:", property.id);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const getImageUrl = () => {
    if (imageError || !property.images?.length) {
      return "/images/placeholder-property.jpg";
    }
    // Chercher l'image principale (isMainImage: true)
    const mainImage = property.images.find(img => img.isMainImage);
    const imageToUse = mainImage || property.images[0]; // Fallback sur la première si pas d'image principale

    // Retourner les données base64 directement (data:image/webp;base64,...)
    return imageToUse.imageData;
  };
  return (
    <Link
      href={`/property/${property.id}`}
      className="group bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 w-full max-w-[240px]"
    >
      {/* Image de la propriété */}
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        <img
          src={getImageUrl()}
          alt={property.title}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
        <div className="absolute top-3 left-3">
          <span className="bg-purple-600 text-white text-xs font-normal px-2 py-1 rounded-full">
            {property.propertyType}
          </span>
        </div>
        {showFavorite && !showStatus && (
          <div className="absolute top-3 right-3">
            <button
              className={`p-2 rounded-full transition-all duration-200 group/fav ${
                isFavorite
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white"
              }`}
              onClick={toggleFavorite}
            >
              <svg
                className={`w-4 h-4 transition-colors duration-200 ${
                  isFavorite
                    ? "text-white"
                    : "text-gray-600 group-hover/fav:text-red-500"
                }`}
                fill={isFavorite ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>
        )}
        
        {showStatus && (
          <div className="absolute top-3 right-3">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              getPropertyStatusColor(property.status) === "warning" 
                ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                : getPropertyStatusColor(property.status) === "success"
                ? "bg-green-100 text-green-800 border border-green-200"
                : getPropertyStatusColor(property.status) === "info"
                ? "bg-blue-100 text-blue-800 border border-blue-200"
                : "bg-gray-100 text-gray-800 border border-gray-200"
            }`}>
              {getPropertyStatusLabel(property.status)}
            </span>
          </div>
        )}
      </div>

      {/* Informations de la propriété */}
      <div className="p-4 bg-white">
        <h3 className="font-normal text-gray-700 mb-2 truncate transition-colors duration-200">
          {property.title}
        </h3>

        <div className="flex items-center text-sm text-gray-600 mb-2">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="line-clamp-1">{property.city}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 5v4m4-4v4m4-4v4M8 13v4m4-4v4m4-4v4"
              />
            </svg>
            <span>{property.bedrooms} ch.</span>
          </div>
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
            <span>{property.squareMeters} m²</span>
          </div>
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span>{property.maxGuests} pers.</span>
          </div>
        </div>

        {/* Prix et Actions */}
        <div className="flex items-center justify-between">
          <div className="font-semibold text-purple-600">
            {property.pricePerNight.toLocaleString("fr-FR")} fcfa
            <span className="text-xs text-gray-500 ml-1">/nuit</span>
          </div>
          
          {/* Boutons d'action */}
          {showActions && (
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  // TODO: Implémenter la modification
                  console.log('Modifier propriété:', property.id);
                }}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                title="Modifier"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              
              <button
                onClick={(e) => {
                  e.preventDefault();
                  // TODO: Implémenter la suppression
                  console.log('Supprimer propriété:', property.id);
                }}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                title="Supprimer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
