"use client";

import React from "react";

interface PageLoaderProps {
  message?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({
  message = "Chargement en cours..."
}) => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        {/* Logo animé */}
        <div className="mb-8">
          <div className="relative">
            {/* Cercle principal avec animation de rotation */}
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>

            {/* Cercle intérieur avec animation inverse */}
            <div className="absolute inset-2 w-12 h-12 border-4 border-purple-100 border-b-purple-500 rounded-full animate-spin-reverse mx-auto"></div>

            {/* Point central */}
            <div className="absolute inset-4 w-8 h-8 bg-purple-600 rounded-full mx-auto animate-pulse"></div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-900">
            {message}
          </h3>
          <p className="text-sm text-gray-600 max-w-sm">
            Veuillez patienter pendant que nous traitons votre demande...
          </p>
        </div>

        {/* Barre de progression animée */}
        <div className="mt-8 w-64 mx-auto">
          <div className="bg-gray-200 rounded-full h-1 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-1 rounded-full animate-progress"></div>
          </div>
        </div>

        {/* Points de chargement */}
        <div className="mt-6 flex justify-center space-x-1">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};
