"use client";

import React from "react";
import { PropertiesList } from "@/modules/property/components/PropertiesList";

export default function PropertiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tous les Logements</h1>
          <p className="mt-2 text-gray-600">
            Découvrez notre sélection de logements disponibles
          </p>
        </div>
        
        <PropertiesList />
      </div>
    </div>
  );
}
