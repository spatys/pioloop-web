'use client';

import React, { useState, useEffect } from 'react';
import { BoutonLink } from '@/components/ui/BoutonLink';
import SearchForm, { SearchFormData } from '@/components/ui/SearchForm';

interface HeroProps {
  className?: string;
}

export const Hero: React.FC<HeroProps> = ({ className = '' }) => {
  const [currentRole, setCurrentRole] = useState(0);
  const roles = ['locataire', 'propriétaire'];

  const handleSearch = (searchData: SearchFormData) => {
    console.log('Search data:', searchData);
    // Ici vous pouvez ajouter la logique de recherche
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 3000); // Change toutes les 3 secondes

    return () => clearInterval(interval);
  }, []);

  return (
    <section className={`relative bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 overflow-hidden ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100/20 via-transparent to-blue-100/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-2 md:py-4 lg:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                <span className="inline text-gray-700">Votre expérience </span>
                <span className="inline text-purple-600 transition-all duration-500 ease-in-out">
                  {roles[currentRole]}
                </span>
                <span className="inline text-gray-700"> simplifiée</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Une plateforme 100% en ligne et un modèle de location unique qui seront les clés de votre réussite.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <BoutonLink
                href="/register"
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

          {/* Visual */}
          <div className="relative">
            <div className="relative z-10">
                             <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
                 <div className="space-y-6">
                   {/* Search Form */}
                   <SearchForm onSearch={handleSearch} />

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
                           <div className="text-sm text-gray-600">Ekounou, Yaoundé</div>
                         </div>
                         <div className="text-right">
                           <div className="font-bold text-purple-600">28000 FCFA</div>
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
                           <div className="text-sm text-gray-600">Mboamanga, Kribi</div>
                         </div>
                         <div className="text-right">
                           <div className="font-bold text-blue-600">55000 FCFA</div>
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