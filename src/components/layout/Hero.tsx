'use client';

import React from 'react';
import Link from 'next/link';

interface HeroProps {
  className?: string;
}

export const Hero: React.FC<HeroProps> = ({ className = '' }) => {
  return (
    <section className={`relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 overflow-hidden ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-accent-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-secondary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium">
                <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                Plateforme de location immobilière
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-display font-bold text-secondary-900 leading-tight">
                Trouvez votre
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800"> logement idéal</span>
              </h1>
              
              <p className="text-xl text-secondary-600 leading-relaxed max-w-2xl">
                Découvrez des propriétés uniques et réservez votre séjour en toute simplicité. 
                Une expérience de location immobilière moderne et sécurisée.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/properties"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-soft hover:shadow-medium transition-all duration-200 transform hover:-translate-y-1"
              >
                Explorer les propriétés
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-secondary-300 text-secondary-700 hover:border-primary-300 hover:text-primary-700 font-semibold rounded-xl transition-all duration-200"
              >
                Commencer maintenant
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-secondary-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary-900">500+</div>
                <div className="text-sm text-secondary-600">Propriétés</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary-900">10k+</div>
                <div className="text-sm text-secondary-600">Utilisateurs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary-900">98%</div>
                <div className="text-sm text-secondary-600">Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative animate-slide-up">
            <div className="relative z-10">
              <div className="bg-white rounded-2xl shadow-large p-8 border border-secondary-200">
                <div className="space-y-6">
                  {/* Search Bar */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-accent-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-secondary-400 rounded-full"></div>
                    </div>
                    
                    <div className="bg-secondary-50 rounded-xl p-4">
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                          type="text"
                          placeholder="Où voulez-vous aller ?"
                          className="flex-1 bg-transparent text-secondary-700 placeholder-secondary-400 focus:outline-none"
                          disabled
                        />
                      </div>
                    </div>
                  </div>

                  {/* Property Cards */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-4 border border-primary-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-secondary-900">Appartement moderne</div>
                          <div className="text-sm text-secondary-600">Paris, France</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-primary-600">€120</div>
                          <div className="text-xs text-secondary-500">par nuit</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-accent-50 to-accent-100 rounded-xl p-4 border border-accent-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-secondary-900">Maison de campagne</div>
                          <div className="text-sm text-secondary-600">Lyon, France</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-accent-600">€200</div>
                          <div className="text-xs text-secondary-500">par nuit</div>
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