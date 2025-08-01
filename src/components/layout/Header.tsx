'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  const { user, logout, isLoading } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);
  const [currentCurrency, setCurrentCurrency] = useState<Devise>(devises[0]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.user-menu-container') && !target.closest('.language-menu-container') && !target.closest('.currency-menu-container')) {
        setIsUserMenuOpen(false);
        setIsLanguageMenuOpen(false);
        setIsCurrencyMenuOpen(false);
      }
    };

    if (isUserMenuOpen || isLanguageMenuOpen || isCurrencyMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen, isLanguageMenuOpen, isCurrencyMenuOpen]);

  return (
    <header className={`bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40 backdrop-blur-sm bg-white/95 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Logo />

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/about" className="text-gray-700 hover:text-purple-600 transition-all duration-200 font-medium relative group">
              À propos
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link href="/properties" className="text-gray-700 hover:text-purple-600 transition-all duration-200 font-medium relative group">
              Logements
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Right side menu */}
          <div className="flex items-center space-x-1">
            {/* Currency and Language Selectors */}
            <div className="flex items-center space-x-1">
              <div className="relative currency-menu-container">
                <button
                  onClick={() => {
                    setIsCurrencyMenuOpen(!isCurrencyMenuOpen);
                    setIsLanguageMenuOpen(false);
                  }}
                  className="p-2 text-gray-600 hover:text-purple-600 transition-all duration-200 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200"
                >
                  <span className="text-gray-700 text-sm font-semibold">{currentCurrency.code}</span>
                </button>

                {/* Currency Dropdown Menu */}
                {isCurrencyMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    {devises.map((devise) => (
                      <button
                        key={devise.code}
                        onClick={() => {
                          setCurrentCurrency(devise);
                          setIsCurrencyMenuOpen(false);
                        }}
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-900 hover:bg-gray-50 transition-colors duration-200 w-full text-left"
                      >
                        <span className="font-medium">{devise.code} - {devise.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative language-menu-container">
                <button
                  onClick={() => {
                    setIsLanguageMenuOpen(!isLanguageMenuOpen);
                    setIsCurrencyMenuOpen(false);
                  }}
                  className="p-2 text-gray-600 hover:text-purple-600 transition-all duration-200 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200"
                >
                  <img 
                    src={currentLanguage.flag} 
                    alt={currentLanguage.label}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                </button>

                {/* Language Dropdown Menu */}
                {isLanguageMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => {
                          setCurrentLanguage(language);
                          setIsLanguageMenuOpen(false);
                        }}
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-900 hover:bg-gray-50 transition-colors duration-200 w-full text-left"
                      >
                        <img 
                          src={language.flag} 
                          alt={language.label}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="font-medium">{language.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Je propose mon bien button */}
            <BoutonLink
              href="/propose-property"
              variant="default"
              size="md"
              className="hidden sm:inline-flex"
            >
              Je propose mon bien
            </BoutonLink>

            {/* User Profile */}
            <div className="relative user-menu-container">
              {user ? (
                // Authenticated user - Airbnb/Booking style
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-all duration-200 border border-gray-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white text-sm font-semibold">
                      {user.profile?.firstName?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-gray-900">
                      {user.profile?.firstName || 'Utilisateur'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user.email}
                    </div>
                  </div>
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              ) : (
                // Non-authenticated user - Airbnb style
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-700 transition-all duration-200"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-sm font-medium">Connexion</span>
                  <svg 
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50">
                  {user ? (
                    // Authenticated user - Full menu
                    <>
                      {/* User Information - Airbnb style */}
                      <div className="flex items-center space-x-3 px-4 pb-4 border-b border-gray-100">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {user?.profile?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-gray-900">
                            {user?.profile?.firstName && user?.profile?.lastName
                              ? `${user.profile.firstName} ${user.profile.lastName}`
                              : user?.email || 'Utilisateur'
                            }
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {user?.email}
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="px-0 py-2">
                        <Link
                          href="/profile"
                          className="flex items-center space-x-3 py-3 px-4 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 w-full"
                        >
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="font-medium">Mon profil</span>
                        </Link>

                        <Link
                          href="/favorites"
                          className="flex items-center justify-between py-3 px-4 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 w-full"
                        >
                          <div className="flex items-center space-x-3">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span className="font-medium">Mes favoris</span>
                          </div>
                          <div className="bg-purple-100 text-purple-600 text-xs font-medium px-2 py-1 rounded-full">
                            3
                          </div>
                        </Link>

                        <Link
                          href="/reservations"
                          className="flex items-center justify-between py-3 px-4 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 w-full"
                        >
                          <div className="flex items-center space-x-3">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="font-medium">Mes réservations</span>
                          </div>
                          <div className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded-full">
                            2
                          </div>
                        </Link>

                        <Link
                          href="/my-properties"
                          className="flex items-center justify-between py-3 px-4 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 w-full"
                        >
                          <div className="flex items-center space-x-3">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span className="font-medium">Mes logements</span>
                          </div>
                          <div className="bg-green-100 text-green-600 text-xs font-medium px-2 py-1 rounded-full">
                            5
                          </div>
                        </Link>

                        <Link
                          href="/settings"
                          className="flex items-center space-x-3 py-3 px-4 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 w-full"
                        >
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="font-medium">Mes paramètres</span>
                        </Link>
                      </div>

                      {/* Help */}
                      <div className="px-0 py-2 border-t border-gray-100">
                        <Link
                          href="/help"
                          className="flex items-center space-x-3 py-3 px-4 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 w-full"
                        >
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-medium">Centre d'aide</span>
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className="px-0 py-2 border-t border-gray-100">
                        <button
                          onClick={logout}
                          className="flex items-center space-x-3 py-3 px-4 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 w-full text-left"
                        >
                          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span className="font-medium">Se déconnecter</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    // Non-authenticated user - Simple menu
                    <>
                      {/* Create Account */}
                      <div className="px-0 py-2">
                        <Link
                          href="/registration-email"
                          className="flex items-center space-x-3 py-3 px-4 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 w-full"
                        >
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          </svg>
                          <span className="font-medium">Créer mon compte</span>
                        </Link>
                      </div>

                      {/* Login */}
                      <div className="px-0 py-2 border-t border-gray-100">
                        <Link
                          href="/login"
                          className="flex items-center space-x-3 py-3 px-4 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 w-full"
                        >
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                          </svg>
                          <span className="font-medium">Se connecter</span>
                        </Link>
                      </div>

                      {/* Help */}
                      <div className="px-0 py-2 border-t border-gray-100">
                        <Link
                          href="/help"
                          className="flex items-center space-x-3 py-3 px-4 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 w-full"
                        >
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-medium">Centre d'aide</span>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}; 