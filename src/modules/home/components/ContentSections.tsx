"use client";

import React from "react";
import { BoutonLink } from "@/components/ui/BoutonLink";

export const ContentSections: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Locataires Card - Style OpenClassrooms */}
          <div className="relative bg-amber-50 rounded-2xl p-8 shadow-soft overflow-hidden">
            {/* Bande de gradient en haut - Style OpenClassrooms */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-t-2xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Locataires
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Faites un grand pas vers votre nouveau logement en découvrant
                l'un de nos logements uniques.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <BoutonLink
                  href="/register-email"
                  variant="default"
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                  Démarrer mon inscription
                </BoutonLink>
                <BoutonLink 
                  href="/properties" 
                  variant="outline" 
                  size="lg"
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Découvrir les logements
                </BoutonLink>
              </div>
            </div>
          </div>

          {/* Propriétaires Card - Style OpenClassrooms */}
          <div className="relative bg-purple-50 rounded-2xl p-8 shadow-soft overflow-hidden">
            {/* Bande de gradient en haut - Style OpenClassrooms */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-t-2xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Propriétaires
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Louez vos logements rapidement et formez votre portefeuille
                immobilier avec des locataires de qualité.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <BoutonLink
                  href="/register-email"
                  variant="default"
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                  Je proposer mon bien
                </BoutonLink>
                <BoutonLink 
                  href="/about" 
                  variant="outline" 
                  size="lg"
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Mon espace propriétaire
                </BoutonLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};