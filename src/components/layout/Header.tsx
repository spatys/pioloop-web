'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const { user, logout, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navigation = [
    { name: 'Propriétés', href: '/properties' },
    { name: 'Réservations', href: '/reservations' },
    { name: 'À propos', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  // Afficher un loader pendant le chargement
  if (loading) {
    return (
      <header className={`bg-white border-b border-gray-200 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-purple-600">PIOLOOP</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-purple-600">PIOLOOP</span>
            </Link>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                className="text-gray-700 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  {item.name}
                </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Icon */}
            <button className="p-2 text-gray-600 hover:text-purple-600 transition-colors duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {user ? (
              <div className="relative">
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

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <Link
                    href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                      Mon Profil
                  </Link>
                  <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                      Tableau de bord
                  </Link>
                    <hr className="my-2 border-gray-200" />
                  <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                      Se déconnecter
                  </button>
                </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Se connecter
                </Link>
                <Link
                  href="/register"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Nous contacter
                </Link>
              </>
            )}

          {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}; 