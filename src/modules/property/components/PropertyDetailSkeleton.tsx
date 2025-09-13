"use client";

import React from 'react';
import { Skeleton, SkeletonText, SkeletonCard } from '@/components/ui/Skeleton';

export const PropertyDetailSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header avec navigation skeleton */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Skeleton className="w-5 h-5" />
              <Skeleton className="w-16 h-4" />
            </div>
            
            <div className="flex items-center space-x-4">
              <Skeleton className="w-9 h-9 rounded" />
              <Skeleton className="w-9 h-9 rounded" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Galerie d'images skeleton */}
            <div className="space-y-4">
              <Skeleton className="w-full h-96 rounded-2xl" />
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, index) => (
                  <Skeleton key={index} className="w-full h-20 rounded-lg" />
                ))}
              </div>
            </div>

            {/* Informations de base skeleton */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <Skeleton className="w-3/4 h-8" />
                  <Skeleton className="w-1/2 h-4" />
                </div>
                <Skeleton className="w-20 h-8 rounded-full" />
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Skeleton className="w-4 h-4" />
                  <Skeleton className="w-16 h-4" />
                </div>
                <div className="flex items-center space-x-1">
                  <Skeleton className="w-4 h-4" />
                  <Skeleton className="w-12 h-4" />
                </div>
                <div className="flex items-center space-x-1">
                  <Skeleton className="w-4 h-4" />
                  <Skeleton className="w-20 h-4" />
                </div>
              </div>
            </div>

            {/* Tabs skeleton */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                {['Aperçu', 'Équipements', 'Localisation', 'Avis'].map((tab, index) => (
                  <Skeleton key={index} className="w-24 h-8" />
                ))}
              </nav>
            </div>

            {/* Contenu des tabs skeleton */}
            <div className="space-y-6">
              {/* Description skeleton */}
              <div className="space-y-3">
                <Skeleton className="w-32 h-6" />
                <SkeletonText lines={4} className="space-y-2" />
              </div>

              {/* Détails de la propriété skeleton */}
              <div className="space-y-4">
                <Skeleton className="w-40 h-6" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, index) => (
                    <div key={index} className="space-y-2">
                      <Skeleton className="w-full h-4" />
                      <Skeleton className="w-2/3 h-3" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Équipements skeleton */}
              <div className="space-y-4">
                <Skeleton className="w-32 h-6" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[...Array(12)].map((_, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Skeleton className="w-4 h-4" />
                      <Skeleton className="w-24 h-4" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Localisation skeleton */}
              <div className="space-y-4">
                <Skeleton className="w-32 h-6" />
                <Skeleton className="w-full h-48 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="w-3/4 h-4" />
                  <Skeleton className="w-1/2 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar de réservation skeleton */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="space-y-4">
                  {/* Prix skeleton */}
                  <div className="flex items-baseline space-x-2">
                    <Skeleton className="w-20 h-8" />
                    <Skeleton className="w-12 h-4" />
                  </div>

                  {/* Formulaire de réservation skeleton */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <Skeleton className="w-full h-12 rounded-lg" />
                      <Skeleton className="w-full h-12 rounded-lg" />
                    </div>
                    <Skeleton className="w-full h-12 rounded-lg" />
                    <Skeleton className="w-full h-12 rounded-lg" />
                  </div>

                  {/* Bouton de réservation skeleton */}
                  <Skeleton className="w-full h-12 rounded-lg" />

                  {/* Informations supplémentaires skeleton */}
                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <div className="flex justify-between">
                      <Skeleton className="w-24 h-4" />
                      <Skeleton className="w-16 h-4" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="w-20 h-4" />
                      <Skeleton className="w-16 h-4" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="w-28 h-4" />
                      <Skeleton className="w-16 h-4" />
                    </div>
                    <div className="flex justify-between font-semibold">
                      <Skeleton className="w-16 h-5" />
                      <Skeleton className="w-20 h-5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Informations du propriétaire skeleton */}
              <div className="mt-6 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center space-x-3 mb-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="w-32 h-4" />
                    <Skeleton className="w-24 h-3" />
                  </div>
                </div>
                <SkeletonText lines={3} className="space-y-2" />
                <Skeleton className="w-full h-10 rounded-lg mt-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
