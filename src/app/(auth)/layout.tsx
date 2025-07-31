import React from 'react';
import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import '../globals.css';

// Configuration des polices pour les pages d'authentification
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

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
 * - Layout complètement indépendant avec ses propres balises HTML
 * 
 * Ce layout remplace le layout principal pour les pages d'auth
 * et fournit une expérience utilisateur dédiée à l'authentification.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0ea5e9" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  );
} 