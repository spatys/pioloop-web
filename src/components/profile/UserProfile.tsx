'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface UserProfileProps {
  className?: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'Profil', icon: '👤' },
    { id: 'reservations', name: 'Réservations', icon: '📅' },
    { id: 'properties', name: 'Mes Propriétés', icon: '🏠' },
    { id: 'settings', name: 'Paramètres', icon: '⚙️' },
  ];

  if (!user) {
    return (
      <div className={`flex items-center justify-center min-h-96 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-secondary-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
                     <h3 className="text-2xl font-bold text-secondary-900 mb-2">Profil non trouvé</h3>
          <p className="text-secondary-600">Veuillez vous connecter pour voir votre profil</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white mb-8">
        <div className="flex items-center space-x-6">
          <div className="relative">
                         <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
               {user.profile?.firstName?.charAt(0) || user.email?.charAt(0) || 'U'}
             </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success-500 rounded-full border-2 border-white flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div className="flex-1">
                         <h1 className="text-3xl font-display font-bold mb-2">
              {user.profile?.firstName && user.profile?.lastName 
                ? `${user.profile.firstName} ${user.profile.lastName}` 
                : user.email
              }
            </h1>
            <p className="text-primary-100 text-lg">{user.email}</p>
            <div className="flex items-center space-x-4 mt-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-sm font-medium">
                <span className="w-2 h-2 bg-success-400 rounded-full mr-2"></span>
                Membre actif
              </span>
              <span className="text-primary-100 text-sm">
                Membre depuis {new Date(user.createdAt || Date.now()).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-medium transition-colors duration-200"
          >
            {isEditing ? 'Annuler' : 'Modifier'}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
             <div className="bg-white rounded-2xl shadow-soft border border-secondary-200 p-8 mb-8">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-500'
                  : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-soft border border-secondary-200 p-8">
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-secondary-900 mb-6">Informations personnelles</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Prénom</label>
                <input
                  type="text"
                  defaultValue={user.profile?.firstName || ''}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-secondary-50 disabled:text-secondary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Nom</label>
                <input
                  type="text"
                  defaultValue={user.profile?.lastName || ''}
                  disabled={!isEditing}
                                     className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-secondary-50 disabled:text-secondary-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary-700 mb-2">Email</label>
                <input
                  type="email"
                  defaultValue={user.email || ''}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-secondary-50 disabled:text-secondary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Téléphone</label>
                <input
                  type="tel"
                  defaultValue={user.profile?.phoneNumber || ''}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-secondary-50 disabled:text-secondary-500"
                />
              </div>
              
                             <div>
                 <label className="block text-sm font-medium text-secondary-700 mb-2">Date de naissance</label>
                <input
                  type="date"
                  defaultValue={user.profile?.dateOfBirth ? new Date(user.profile.dateOfBirth).toISOString().split('T')[0] : ''}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-secondary-50 disabled:text-secondary-500"
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-4 pt-6 border-t border-secondary-200">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 border border-secondary-300 text-secondary-700 rounded-xl font-medium hover:bg-secondary-50 transition-colors duration-200"
                >
                  Annuler
                </button>
                <button className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors duration-200">
                  Sauvegarder
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reservations' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-secondary-900 mb-6">Mes réservations</h3>
            
            <div className="bg-secondary-50 rounded-xl p-6 text-center">
              <svg className="w-12 h-12 text-secondary-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h4 className="text-lg font-semibold text-secondary-900 mb-2">Aucune réservation</h4>
              <p className="text-secondary-600 mb-4">Vous n'avez pas encore de réservations</p>
              <button className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors duration-200">
                Explorer les propriétés
              </button>
            </div>
          </div>
        )}

        {activeTab === 'properties' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-secondary-900 mb-6">Mes propriétés</h3>
            
            <div className="bg-secondary-50 rounded-xl p-6 text-center">
              <svg className="w-12 h-12 text-secondary-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h4 className="text-lg font-semibold text-secondary-900 mb-2">Aucune propriété</h4>
              <p className="text-secondary-600 mb-4">Vous n'avez pas encore ajouté de propriétés</p>
              <button className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors duration-200">
                Ajouter une propriété
              </button>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-secondary-900 mb-6">Paramètres</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-secondary-200 rounded-xl">
                <div>
                  <h4 className="font-semibold text-secondary-900">Notifications email</h4>
                  <p className="text-sm text-secondary-600">Recevoir les notifications par email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-secondary-200 rounded-xl">
                <div>
                  <h4 className="font-semibold text-secondary-900">Notifications push</h4>
                  <p className="text-sm text-secondary-600">Recevoir les notifications push</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-secondary-200 rounded-xl">
                <div>
                  <h4 className="font-semibold text-secondary-900">Mode sombre</h4>
                  <p className="text-sm text-secondary-600">Activer le mode sombre</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 