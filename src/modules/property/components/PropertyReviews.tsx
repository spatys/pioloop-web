"use client";

import React from 'react';
import { PropertyResponse } from '@/core/types/Property';

interface PropertyReviewsProps {
  property: PropertyResponse;
}

export const PropertyReviews: React.FC<PropertyReviewsProps> = ({ property }) => {
  // Pas de données d'exemple - utiliser les vraies données de la propriété
  const reviews: any[] = []; // TODO: Récupérer les vrais avis depuis l'API
  const averageRating = property.averageRating || 0;
  const reviewCount = property.reviewCount || 0;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="space-y-6">
      {/* En-tête des avis */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-normal text-gray-900">Avis</h3>
          {reviewCount > 0 ? (
            <div className="flex items-center space-x-2 mt-1">
              <div className="flex items-center">
                {renderStars(Math.floor(averageRating))}
              </div>
              <span className="text-lg font-normal text-gray-900">{averageRating.toFixed(1)}</span>
              <span className="text-gray-600">({reviewCount} avis)</span>
            </div>
          ) : (
            <div className="mt-1">
              <span className="text-gray-600">Aucun avis pour le moment</span>
            </div>
          )}
        </div>
      </div>

      {/* Répartition des notes - masquée s'il n'y a pas d'avis */}
      {reviewCount > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Répartition des notes</h4>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              // TODO: Récupérer les vraies données de répartition depuis l'API
              const count = 0;
              const percentage = 0;
              
              return (
                <div key={rating} className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700 w-8">{rating}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Liste des avis */}
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg">
                  {review.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-900">{review.author}</span>
                    {review.verified && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        ✓ Vérifié
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-gray-600">
                      {new Date(review.date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-400 text-6xl mb-4">💬</div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">Aucun avis pour le moment</h4>
          <p className="text-gray-600">
            Soyez le premier à laisser un avis sur ce logement après votre séjour !
          </p>
        </div>
      )}

      {/* Bouton pour voir plus d'avis - masqué s'il n'y a pas d'avis */}
      {reviews.length > 3 && (
        <div className="text-center">
          <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            Voir tous les avis
          </button>
        </div>
      )}

      {/* Note sur les avis */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h5 className="font-medium text-blue-900">À propos des avis</h5>
            <p className="text-sm text-blue-700 mt-1">
              Tous les avis sont vérifiés et proviennent de voyageurs ayant séjourné dans ce logement. 
              Les avis sont modérés pour maintenir la qualité de la communauté.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
