"use client";

import React, { useState } from 'react';
import { PropertyResponse } from '@/core/types/Property';

interface PropertyHostProps {
  property: PropertyResponse;
}

export const PropertyHost: React.FC<PropertyHostProps> = ({ property }) => {
  const [showContactForm, setShowContactForm] = useState(false);

  // Données d'exemple pour l'hôte
  const host = {
    name: 'Jean Dupont',
    avatar: '👨',
    joinDate: '2023-01-15',
    verified: true,
    responseRate: 98,
    responseTime: 'en moins d\'une heure',
    languages: ['Français', 'Anglais'],
    description: 'Passionné de voyage et d\'hospitalité, j\'aime partager ma ville avec mes invités. Je suis toujours disponible pour vous aider à découvrir les meilleures adresses locales.',
    propertiesCount: 3,
    reviewsCount: 127,
    averageRating: 4.9
  };

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
      <h3 className="text-xl font-semibold text-gray-900">Votre hôte</h3>
      
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          {/* Avatar et infos de base */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
              {host.avatar}
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="text-lg font-semibold text-gray-900">{host.name}</h4>
              {host.verified && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  ✓ Vérifié
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-1 mb-3">
              {renderStars(Math.floor(host.averageRating))}
              <span className="text-sm font-medium text-gray-900 ml-1">
                {host.averageRating.toFixed(1)}
              </span>
              <span className="text-sm text-gray-600">
                ({host.reviewsCount} avis)
              </span>
            </div>
            
            <p className="text-gray-700 mb-4">{host.description}</p>
            
            {/* Statistiques */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">{host.responseRate}%</div>
                <div className="text-sm text-gray-600">Taux de réponse</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">{host.responseTime}</div>
                <div className="text-sm text-gray-600">Temps de réponse</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">{host.propertiesCount}</div>
                <div className="text-sm text-gray-600">Logements</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {new Date(host.joinDate).getFullYear()}
                </div>
                <div className="text-sm text-gray-600">Membre depuis</div>
              </div>
            </div>
            
            {/* Langues parlées */}
            <div className="mb-4">
              <h5 className="text-sm font-medium text-gray-900 mb-2">Langues parlées</h5>
              <div className="flex flex-wrap gap-2">
                {host.languages.map((language, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Boutons d'action */}
            <div className="flex space-x-3">
              <button
                onClick={() => setShowContactForm(!showContactForm)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Contacter l'hôte
              </button>
              <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                Voir le profil
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire de contact (conditionnel) */}
      {showContactForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Contacter {host.name}</h4>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sujet
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option>Question générale</option>
                <option>Demande de modification</option>
                <option>Problème technique</option>
                <option>Autre</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Écrivez votre message ici..."
              ></textarea>
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Envoyer le message
              </button>
              <button
                type="button"
                onClick={() => setShowContactForm(false)}
                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Note de sécurité */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <div>
            <h5 className="font-medium text-yellow-900">Sécurité</h5>
            <p className="text-sm text-yellow-700 mt-1">
              Pour votre sécurité, ne communiquez jamais en dehors de la plateforme. 
              Tous les paiements et communications doivent passer par Pioloop.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
