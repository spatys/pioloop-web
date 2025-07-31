'use client';

import React from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * COMPOSANT MAIN LAYOUT
 * 
 * Ce composant définit la structure complète de l'application
 * avec header et footer. Il est utilisé par le layout (main).
 * 
 * STRUCTURE :
 * ┌─────────────────────────────────────┐
 * │              HEADER                │ ← Navigation, logo, menu utilisateur
 * ├─────────────────────────────────────┤
 * │                                   │
 * │              CONTENU               │ ← Contenu de la page (children)
 * │                                   │
 * ├─────────────────────────────────────┤
 * │              FOOTER                │ ← Liens, informations, copyright
 * └─────────────────────────────────────┘
 * 
 * UTILISATION :
 * - Importé par src/app/(main)/layout.tsx
 * - Utilisé pour toutes les pages principales
 * - Fournit une expérience utilisateur complète
 */
export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec navigation complète */}
      <Header />
      
      {/* Contenu principal de la page */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer avec liens et informations */}
      <Footer />
    </div>
  );
} 