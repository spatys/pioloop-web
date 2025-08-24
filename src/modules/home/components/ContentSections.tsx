"use client";

import React from "react";
import { BoutonLink } from "@/components/ui/BoutonLink";

export const ContentSections: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Locataires Card */}
          <div className="relative bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-xl md:text-3xl font-light mb-4">
                Locataires
              </h2>
              <p className="text-gray-700 leading-relaxed text-light mb-6">
                Faites un grand pas vers votre nouveau logement en découvrant
                l'un de nos logements uniques.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <BoutonLink
                  href="/register-email"
                  variant="default"
                  size="lg"
                >
                  Démarrer mon inscription
                </BoutonLink>
                <BoutonLink href="/properties" variant="outline" size="lg">
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
              <h2 className="text-xl md:text-3xl font-light mb-4">
                Propriétaires
              </h2>
              <p className="text-gray-700 leading-relaxed text-light mb-6">
                Louez vos logements rapidement et formez votre portefeuille
                immobilier avec des locataires de qualité.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <BoutonLink
                  href="/register-email"
                  variant="default"
                  size="lg"
                >
                  Je proposer mon bien
                </BoutonLink>
                <BoutonLink href="/about" variant="outline" size="lg">
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
  );
};
