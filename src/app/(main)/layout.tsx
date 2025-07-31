import React from 'react';
import MainLayout from '../../layouts/MainLayout';

/**
 * LAYOUT PRINCIPAL DE L'APPLICATION
 * 
 * Ce layout est utilisé pour TOUTES les pages principales de l'application :
 * - /main (page d'accueil)
 * - /properties (logements)
 * - /about (à propos)
 * - /profile (profil utilisateur)
 * - Et toutes les autres pages de l'application
 * 
 * CARACTÉRISTIQUES :
 * - AVEC header (navigation complète)
 * - AVEC footer
 * - Layout complet avec navigation
 * - Expérience utilisateur complète
 * 
 * Ce layout utilise le composant MainLayout qui inclut :
 * - Header avec navigation, logo, menu utilisateur
 * - Footer avec liens et informations
 * - Structure complète de l'application
 */
export default function MainLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainLayout>
      {children}
    </MainLayout>
  );
} 