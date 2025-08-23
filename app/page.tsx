'use client';

import React from 'react';
import { BoutonLink } from '@/components/ui/BoutonLink';
import { Hero } from '@/components/layout/Hero';

export default function HomePage() {
  const services = [
    {
      title: "Propriétaire Vérifié",
      description: "Louez en toute confiance avec des propriétaires vérifiés et des logements certifiés de qualité.",
      image: "/images/services/owner.png",
      borderColor: "border-yellow-100"
    },
    {
      title: "Solution 100% Online",
      description: "Gérez vos transactions immobilières depuis n'importe où, de la recherche à la signature de bail.",
      image: "/images/services/online.png",
      borderColor: "border-blue-100"
    },
    {
      title: "Paiement Sécurisé",
      description: "Effectuez vos paiements en toute sérénité avec notre système sécurisé et certifié.",
      image: "/images/services/secure_payment.png",
      borderColor: "border-green-100"
    },
    {
      title: "Support Client",
      description: "Notre équipe dédiée est disponible 24h/24 et 7j/7 pour vous accompagner dans toutes vos démarches.",
      image: "/images/services/support.png",
      borderColor: "border-purple-100"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Content Sections */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Locataires Card */}
            <div className="relative bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-xl md:text-3xl font-light mb-4">Locataires</h2>
                <p className="text-gray-700 leading-relaxed text-light mb-6">
                  Faites un grand pas vers votre nouveau logement en découvrant l'un de nos logements uniques.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <BoutonLink
                    href="/register-email"
                    variant="default"
                    size="lg"
                  >
                    Démarrer mon inscription
                  </BoutonLink>
                  <BoutonLink
                    href="/properties"
                    variant="outline"
                    size="lg"
                  >
                    Découvrir les logements
                  </BoutonLink>
                </div>
              </div>
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full opacity-20 transform translate-x-16 -translate-y-16"></div>
            </div>
            
            {/* Propriétaires Card */}
            <div className="relative bg-gradient-to-r from-white to-purple-50 rounded-2xl p-8 overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-xl md:text-3xl font-light mb-4">Propriétaires</h2>
                <p className="text-gray-700 leading-relaxed text-light mb-6">
                  Louez vos logements rapidement et formez votre portefeuille immobilier avec des locataires de qualité.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <BoutonLink
                    href="/register-email"
                    variant="default"
                    size="lg"
                  >
                    Je proposer mon bien
                  </BoutonLink>
                  <BoutonLink
                    href="/about"
                    variant="outline"
                    size="lg"
                  >
                    Mon espace propriétaire
                  </BoutonLink>
                </div>
              </div>
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full opacity-20 transform translate-x-16 -translate-y-16"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-xl md:text-3xl font-light mb-4">
              Location. Confiance. Simplicité.
            </h3>
            <p className="text-gray-700 leading-relaxed text-light max-w-3xl mx-auto mb-8">
              Avec Pioloop, découvrez une nouvelle façon de louer : 100% digital, 100% sécurisé, 100% transparent.
            </p>
          </div>

          <div className="flex flex-row items-start justify-center gap-8" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', width: '100%' }}>
            {services.map((service, index) => (
              <div key={index} className="text-center flex-shrink-0" style={{ width: '280px' }}>
                <div className={`w-48 h-48 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg border-8 ${service.borderColor} overflow-hidden`}>
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-32 h-32 object-cover rounded-full"
                  />
                </div>
                <h3 className="text-xl md:text-2xl font-light mb-4">{service.title}</h3>
                <p className="text-gray-700 leading-relaxed text-light">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 