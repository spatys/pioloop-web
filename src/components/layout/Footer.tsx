'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-xl font-bold">Pioloop</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Votre plateforme de confiance pour trouver le logement de location parfait. Découvrez des propriétés incroyables, réservez en toute confiance et profitez de votre séjour.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Linkedin size={20} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/properties" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Parcourir les propriétés
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Comment ça marche
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* For Renters */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Pour les Locataires</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/search" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Trouver un logement
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Propriétés sauvegardées
                </Link>
              </li>
              <li>
                <Link href="/bookings" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Mes réservations
                </Link>
              </li>
              <li>
                <Link href="/payments" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Historique des paiements
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Centre d'aide
                </Link>
              </li>
            </ul>
          </div>

          {/* For Property Owners */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Pour les Propriétaires</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/list-property" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Lister votre propriété
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Tableau de bord propriétaire
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Analyses de propriété
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Tarification
                </Link>
              </li>
              <li>
                <Link href="/partner" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Devenir partenaire
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Mail size={20} className="text-primary-400" />
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-sm">support@pioloop.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone size={20} className="text-primary-400" />
              <div>
                <p className="text-sm text-gray-400">Téléphone</p>
                <p className="text-sm">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin size={20} className="text-primary-400" />
              <div>
                <p className="text-sm text-gray-400">Adresse</p>
                <p className="text-sm">123 Rue de Location, Ville, État 12345</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>© {currentYear} Pioloop. Tous droits réservés. Fait avec ❤️ pour les locataires et propriétaires.</span>
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-primary-400 transition-colors">
                Politique de confidentialité
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-primary-400 transition-colors">
                Conditions d'utilisation
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-primary-400 transition-colors">
                Politique des cookies
              </Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-primary-400 transition-colors">
                Plan du site
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 