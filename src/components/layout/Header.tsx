'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { useAuth } from '@/hooks/useAuth';
import { languages } from '@/core/data/languages';
import { devises } from '@/core/data/devises';
import { BoutonLink } from '@/components/ui/BoutonLink';
import { Logo } from '@/components/ui/Logo';
import type { Language } from '@/core/types/Language';
import type { Devise } from '@/core/types/Devise';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const { user, isLoading, isAuthenticated, mutate } = useUser();
  const { logout } = useAuth();
  
  // Forcer la récupération des données utilisateur au montage du composant
  React.useEffect(() => {
    mutate();
  }, [mutate]);
  
  const handleLogout = async () => {
    try {
      await logout();
      // Revalider les données utilisateur après déconnexion
      await mutate();
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };
  
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0]);
  const [selectedDevise, setSelectedDevise] = useState<Devise>(devises[0]);

  return (
    <header className={`bg-white shadow-sm border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <Logo />
            </Link>
          </div>

          {/* Navigation principale */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/properties" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Propriétés
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              À propos
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Contact
            </Link>
          </nav>

          {/* Actions côté droit */}
          <div className="flex items-center space-x-4">
            {/* Sélecteur de langue */}
            <div className="relative">
              <select
                value={selectedLanguage.code}
                onChange={(e) => {
                  const lang = languages.find(l => l.code === e.target.value);
                  if (lang) setSelectedLanguage(lang);
                }}
                className="bg-transparent border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {languages.map((language) => (
                  <option key={language.code} value={language.code}>
                    {language.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sélecteur de devise */}
            <div className="relative">
              <select
                value={selectedDevise.code}
                onChange={(e) => {
                  const devise = devises.find(d => d.code === e.target.value);
                  if (devise) setSelectedDevise(devise);
                }}
                className="bg-transparent border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {devises.map((devise) => (
                  <option key={devise.code} value={devise.code}>
                    {devise.symbol} {devise.code}
                  </option>
                ))}
              </select>
            </div>

            {/* Section utilisateur */}
            {isLoading ? (
              <div className="animate-pulse bg-gray-200 rounded-full w-8 h-8"></div>
            ) : isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white text-sm font-semibold">
                      {user.profile.firstName && user.profile.lastName 
                        ? `${user.profile.firstName.charAt(0)}${user.profile.lastName.charAt(0)}`
                        : user.profile.firstName?.charAt(0) || user.email?.charAt(0) || 'U'
                      }
                    </span>
                  </div>
                  <span className="hidden md:block text-sm font-medium">
                    {user.profile.firstName && user.profile.lastName 
                      ? `${user.profile.firstName} ${user.profile.lastName}`
                      : user.email
                    }
                  </span>
                </button>

                {/* Menu utilisateur */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Mon profil
                    </Link>
                    <Link
                      href="/reservations"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Mes réservations
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <BoutonLink href="/login" variant="outline" size="sm">
                  Se connecter
                </BoutonLink>
                <BoutonLink href="/register" variant="default" size="sm">
                  S'inscrire
                </BoutonLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}; 