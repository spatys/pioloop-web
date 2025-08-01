import React from 'react';
import type { Metadata } from 'next';

// Métadonnées spécifiques aux pages d'authentification
export const metadata: Metadata = {
  title: 'Pioloop - Authentification',
  description: 'Connectez-vous ou créez votre compte Pioloop',
};

/**
 * LAYOUT D'AUTHENTIFICATION
 * 
 * Ce layout est utilisé UNIQUEMENT pour les pages d'authentification :
 * - /login
 * - /register
 * 
 * CARACTÉRISTIQUES :
 * - PAS de header (navigation)
 * - PAS de footer
 * - Design minimaliste et épuré
 * - Focus sur le formulaire d'authentification
 * - Structure simple sans navigation
 * 
 * Ce layout utilise le layout principal pour les balises HTML
 * mais fournit une expérience utilisateur dédiée à l'authentification.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {children}
    </div>
  );
} 