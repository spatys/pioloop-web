'use client';

import React from 'react';
import { Hero } from '../components/layout/Hero';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Content Sections */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Locataires Card */}
            <div className="bg-yellow-50 rounded-lg p-8 border-t-4 border-yellow-400">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Locataires</h2>
              <p className="text-gray-600 mb-6">
                Faites un grand pas vers votre nouveau logement en découvrant l'une de nos propriétés uniques.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors duration-200"
                >
                  Démarrer mon inscription
                </Link>
                <Link
                  href="/properties"
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold rounded-lg transition-colors duration-200"
                >
                  Découvrir les propriétés
                </Link>
              </div>
            </div>

            {/* Propriétaires Card */}
            <div className="bg-blue-50 rounded-lg p-8 border-t-4 border-blue-400">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Propriétaires</h2>
              <p className="text-gray-600 mb-6">
                Louez vos propriétés rapidement et formez votre portefeuille immobilier avec des locataires de qualité.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors duration-200"
                >
                  Explorer l'espace propriétaire
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold rounded-lg transition-colors duration-200"
                >
                  Découvrir nos solutions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - OpenClassrooms Style */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simplicité. Efficacité. Confiance.</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Avec Pioloop, découvrez une nouvelle façon de gérer l'immobilier : 100% digital, 100% sécurisé, 100% transparent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Service 1: Location de Logements */}
            <div className="text-center">
              <div className="w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-16 h-16 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Location de Logements</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Trouvez votre logement idéal en quelques clics parmi des milliers de propriétés vérifiées.
              </p>
            </div>

            {/* Service 2: Solution 100% Online */}
            <div className="text-center">
              <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Solution 100% Online</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Gérez vos transactions immobilières depuis n'importe où, de la recherche à la signature de bail.
              </p>
            </div>

            {/* Service 3: Paiement Sécurisé */}
            <div className="text-center">
              <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Paiement Sécurisé</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Effectuez vos paiements en toute sérénité avec notre système sécurisé et certifié.
              </p>
            </div>

            {/* Service 4: Support 24/7 */}
            <div className="text-center">
              <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-16 h-16 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Support 24/7</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Notre équipe d'experts est disponible 24h/24 et 7j/7 pour vous accompagner.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 