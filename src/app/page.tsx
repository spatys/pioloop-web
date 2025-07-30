'use client';

import React from 'react';
import { Hero } from '../components/layout/Hero';
import { BoutonLink } from '@/components/ui/BoutonLink';

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
              <h2 className="text-2xl font-bold text-gray-700 mb-4">Locataires</h2>
              <p className="text-gray-600 mb-6">
                Faites un grand pas vers votre nouveau logement en découvrant l'un de nos logements uniques.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <BoutonLink
                  href="/register"
                  variant="default"
                  size="md"
                >
                  Démarrer mon inscription
                </BoutonLink>
                <BoutonLink
                  href="/properties"
                  variant="outline"
                  size="md"
                >
                  Découvrir les logements
                </BoutonLink>
              </div>
            </div>
            
            {/* Propriétaires Card */}
            <div className="bg-blue-50 rounded-lg p-8 border-t-4 border-blue-400">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">Propriétaires</h2>
              <p className="text-gray-600 mb-6">
                Louez vos logements rapidement et formez votre portefeuille immobilier avec des locataires de qualité.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <BoutonLink
                  href="/register"
                  variant="default"
                  size="md"
                >
                  Je proposer mon bien
                </BoutonLink>
                <BoutonLink
                  href="/about"
                  variant="outline"
                  size="md"
                >
                  Mon espace propriétaire
                </BoutonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - OpenClassrooms Style */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-700 mb-4">Simplicité. Efficacité. Confiance.</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Avec Pioloop, découvrez une nouvelle façon de gérer l'immobilier : 100% digital, 100% sécurisé, 100% transparent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Service 1: Location de Logements */}
            <div className="text-center">
              <div className="w-40 h-40 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 overflow-hidden">
                <img 
                  src="/images/services/online.png" 
                  alt="Location de Logements" 
                  className="w-28 h-28 object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-4">Location de Logements</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Trouvez votre logement idéal en quelques clics parmi des milliers de logements vérifiées.
              </p>
            </div>

            {/* Service 2: Solution 100% Online */}
            <div className="text-center">
              <div className="w-40 h-40 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 overflow-hidden">
                <img 
                  src="/images/services/online.png" 
                  alt="Solution 100% Online" 
                  className="w-28 h-28 object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-4">Solution 100% Online</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Gérez vos transactions immobilières depuis n'importe où, de la recherche à la signature de bail.
              </p>
            </div>

            {/* Service 3: Paiement Sécurisé */}
            <div className="text-center">
              <div className="w-40 h-40 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 overflow-hidden">
                <img 
                  src="/images/services/secure_payment.png" 
                  alt="Paiement Sécurisé" 
                  className="w-28 h-28 object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-4">Paiement Sécurisé</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Effectuez vos paiements en toute sérénité avec notre système sécurisé et certifié.
              </p>
            </div>

            {/* Service 4: Support 24/7 */}
            <div className="text-center">
              <div className="w-40 h-40 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 overflow-hidden">
                <img 
                  src="/images/services/support.png" 
                  alt="Support 24/7" 
                  className="w-28 h-28 object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-4">Support 24/7</h3>
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