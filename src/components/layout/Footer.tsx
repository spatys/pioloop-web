'use client';

import React from 'react';
import Link from 'next/link';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`bg-white border-t border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-6">
              <span className="text-2xl font-bold text-purple-600">PIOLOOP</span>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
            Une plateforme 100% en ligne et un modèle de location unique, conçus pour être vos Une plateforme 100% en ligne et un modèle de location unique, conçus pour être votre tremplin locatif.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Produit</h3>
            <ul className="space-y-3">
              <li><Link href="/properties" className="text-gray-600 hover:text-purple-600 transition-colors duration-200">Propriétés</Link></li>
              <li><Link href="/reservations" className="text-gray-600 hover:text-purple-600 transition-colors duration-200">Réservations</Link></li>
              <li><Link href="/pricing" className="text-gray-600 hover:text-purple-600 transition-colors duration-200">Tarifs</Link></li>
              <li><Link href="/features" className="text-gray-600 hover:text-purple-600 transition-colors duration-200">Fonctionnalités</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link href="/help" className="text-gray-600 hover:text-purple-600 transition-colors duration-200">Centre d'aide</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-purple-600 transition-colors duration-200">Contact</Link></li>
              <li><Link href="/faq" className="text-gray-600 hover:text-purple-600 transition-colors duration-200">FAQ</Link></li>
              <li><Link href="/status" className="text-gray-600 hover:text-purple-600 transition-colors duration-200">Statut</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {currentYear} Pioloop. Tous droits réservés.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-500 hover:text-purple-600 text-sm transition-colors duration-200">
                Confidentialité
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-purple-600 text-sm transition-colors duration-200">
                Conditions d'utilisation
              </Link>
              <Link href="/cookies" className="text-gray-500 hover:text-purple-600 text-sm transition-colors duration-200">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}; 