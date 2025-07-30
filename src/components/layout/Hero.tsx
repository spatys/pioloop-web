'use client';

import React from 'react';
import Link from 'next/link';

interface HeroProps {
  className?: string;
}

export const Hero: React.FC<HeroProps> = ({ className = '' }) => {
  return (
    <section className={`bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Des logements d'aujourd'hui qui ont de l'avenir
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Notre différence ? Une plateforme 100% en ligne et un modèle de location unique qui seront les clés de votre réussite.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Démarrer mon inscription
              </Link>
              
              <Link
                href="/properties"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold rounded-lg transition-colors duration-200"
              >
                Découvrir les propriétés
              </Link>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="relative z-10">
              <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
                <div className="space-y-6">
                  {/* Search Bar */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                          type="text"
                          placeholder="Où voulez-vous aller ?"
                          className="flex-1 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none"
                          disabled
                        />
                      </div>
                    </div>
                  </div>

                  {/* Property Cards */}
                  <div className="space-y-4">
                    <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-400">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">Appartement moderne</div>
                          <div className="text-sm text-gray-600">Paris, France</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-purple-600">€120</div>
                          <div className="text-xs text-gray-500">par nuit</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">Maison de campagne</div>
                          <div className="text-sm text-gray-600">Lyon, France</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-blue-600">€200</div>
                          <div className="text-xs text-gray-500">par nuit</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 