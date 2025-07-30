'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { languages } from '@/core/data/languages';
import { devises } from '@/core/data/devises';
import type { Language } from '@/core/types/Language';
import type { Devise } from '@/core/types/Devise';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const { user, logout } = useAuth();
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

  // const navigation = [
  //   { name: 'Logement', href: '/logements' },
  //   { name: 'Réservations', href: '/reservations' },
  //   { name: 'À propos', href: '/about' },
  //   { name: 'Contact', href: '/contact' },
  // ];

  return (
    <header className={`bg-white shadow-sm border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">P</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Pioloop</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/properties" className="text-gray-700 hover:text-purple-600 transition-colors duration-200">
              Logements
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-purple-600 transition-colors duration-200">
              À propos
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-purple-600 transition-colors duration-200">
              Contact
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <Link
              href="/propose-property"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Je propose mon bien
            </Link>

            {/* Language and Currency Selectors */}
            <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-1">
              <div className="relative language-menu-container">
                <button
                  onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                  className="flex items-center justify-center w-8 h-8 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors duration-200 shadow-sm"
                >
                  <img 
                    src={currentLanguage.flag} 
                    alt={currentLanguage.label}
                    className="w-6 h-6 rounded-full"
                  />
                </button>

                {/* Language Dropdown Menu */}
                {isLanguageMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => {
                          setCurrentLanguage(language);
                          setIsLanguageMenuOpen(false);
                        }}
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-900 hover:bg-gray-50 transition-colors duration-200 w-full text-left"
                      >
                        <img 
                          src={language.flag} 
                          alt={language.label}
                          className="w-5 h-5 rounded-full"
                        />
                        <span>{language.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative currency-menu-container">
                <button
                  onClick={() => setIsCurrencyMenuOpen(!isCurrencyMenuOpen)}
                  className="flex items-center justify-center w-8 h-8 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors duration-200 shadow-sm"
                >
                  <span className="text-gray-700 text-sm font-medium">{currentCurrency.code}</span>
                </button>

                {/* Currency Dropdown Menu */}
                {isCurrencyMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {devises.map((devise) => (
                      <button
                        key={devise.code}
                        onClick={() => {
                          setCurrentCurrency(devise);
                          setIsCurrencyMenuOpen(false);
                        }}
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-900 hover:bg-gray-50 transition-colors duration-200 w-full text-left"
                      >
                        <span>{devise.code} - {devise.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Help Icon */}
            <Link href="/help" className="p-2 text-gray-600 hover:text-purple-600 transition-colors duration-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Link>

            {user ? (
              <div className="relative user-menu-container">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 text-sm font-medium">
                      {user.profile?.firstName?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu for authenticated users */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-4 z-50">
                    {/* User Information */}
                    <div className="flex items-center space-x-3 px-4 pb-3 border-b border-gray-200">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user?.profile?.firstName?.charAt(0) || user?.email?.charAt(0) || 'AC'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-900">
                          {user?.profile?.firstName && user?.profile?.lastName 
                            ? `${user.profile.firstName} ${user.profile.lastName}`
                            : user?.email || 'Alain Christian Tsafack Nanyim'
                          }
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="px-0 py-2">
                      <Link 
                        href="/profile" 
                        className="flex items-center space-x-3 py-3 text-sm text-gray-900 hover:bg-gray-100 rounded transition-colors duration-200 w-full"
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Mon profil</span>
                      </Link>
                      
                      <Link href="/favorites" className="flex items-center space-x-3 py-3 text-sm text-gray-900 hover:bg-gray-50 rounded transition-colors duration-200 w-full">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>Mes favoris</span>
                      </Link>
                      
                      <Link href="/reservations" className="flex items-center space-x-3 py-3 text-sm text-gray-900 hover:bg-gray-50 rounded transition-colors duration-200 w-full">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Mes réservations</span>
                      </Link>
                      
                      <Link href="/properties" className="flex items-center space-x-3 py-3 text-sm text-gray-900 hover:bg-gray-50 rounded transition-colors duration-200 w-full">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span>Mes logements</span>
                      </Link>
                      
                      <Link href="/settings" className="flex items-center space-x-3 py-3 text-sm text-gray-900 hover:bg-gray-50 rounded transition-colors duration-200 w-full">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Mes paramètres</span>
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="px-4 py-2 border-t border-gray-200">
                      <button
                        onClick={logout}
                        className="flex items-center space-x-3 py-3 text-sm text-red-600 hover:bg-red-50 rounded transition-colors duration-200 w-full text-left"
                      >
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Se déconnecter</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* User Dropdown for non-authenticated users */}
                <div className="relative user-menu-container">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-700 hover:border-purple-500 transition-colors duration-200"
                  >
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu for non-authenticated users */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-4 z-50">
                      {/* User Information */}
                      <div className="flex items-center space-x-3 px-4 pb-3 border-b border-gray-200">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">AC</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-gray-900">Alain Christian Tsafack Nanyim</div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="px-0 py-2">
                        <Link href="/profile" className="flex items-center space-x-3 py-3 px-4 text-sm text-gray-900 hover:bg-gray-50 rounded transition-colors duration-200 w-full">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>Mon profil</span>
                        </Link>
                        
                        <Link href="/favorites" className="flex items-center space-x-3 py-3 px-4 text-sm text-gray-900 hover:bg-gray-50 rounded transition-colors duration-200 w-full">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span>Mes favoris</span>
                        </Link>
                        
                        <Link href="/reservations" className="flex items-center space-x-3 py-3 px-4 text-sm text-gray-900 hover:bg-gray-50 rounded transition-colors duration-200 w-full">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>Mes réservations</span>
                        </Link>
                        
                        <Link href="/properties" className="flex items-center space-x-3 py-3 px-4 text-sm text-gray-900 hover:bg-gray-50 rounded transition-colors duration-200 w-full">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span>Mes logements</span>
                        </Link>
                        
                        <Link href="/settings" className="flex items-center space-x-3 py-3 px-4 text-sm text-gray-900 hover:bg-gray-50 rounded transition-colors duration-200 w-full">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>Mes paramètres</span>
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className="px-0 py-2 border-t border-gray-200">
                        <Link href="/login" className="flex items-center space-x-3 py-3 px-4 text-sm text-red-600 hover:bg-red-50 rounded transition-colors duration-200 w-full">
                          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>Se déconnecter</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isUserMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
    </header>
  );
}; 