'use client';

import React from 'react';
import { Hero } from '../components/layout/Hero';
import Link from 'next/link';

export default function HomePage() {
  const features = [
    {
      icon: '🏠',
      title: 'Propriétés uniques',
      description: 'Découvrez des logements exceptionnels sélectionnés avec soin pour vous offrir une expérience inoubliable.'
    },
    {
      icon: '🔒',
      title: 'Réservations sécurisées',
      description: 'Paiements sécurisés et système de réservation fiable pour une tranquillité d\'esprit totale.'
    },
    {
      icon: '⭐',
      title: 'Avis vérifiés',
      description: 'Profitez de commentaires authentiques de voyageurs pour faire les meilleurs choix.'
    },
    {
      icon: '📱',
      title: 'Application mobile',
      description: 'Gérez vos réservations et découvrez de nouvelles propriétés depuis votre smartphone.'
    }
  ];

  const testimonials = [
    {
      name: 'Marie Dubois',
      role: 'Voyageuse',
      content: 'Pioloop m\'a permis de trouver un appartement parfait pour mes vacances à Paris. L\'expérience était fluide et le logement était exactement comme décrit.',
      avatar: 'M'
    },
    {
      name: 'Thomas Martin',
      role: 'Propriétaire',
      content: 'En tant que propriétaire, Pioloop m\'a aidé à louer ma propriété facilement. Le support client est excellent et les paiements sont sécurisés.',
      avatar: 'T'
    },
    {
      name: 'Sophie Laurent',
      role: 'Locataire régulière',
      content: 'J\'utilise Pioloop depuis plus d\'un an et je n\'ai jamais été déçue. Les propriétés sont de qualité et les prix sont justes.',
      avatar: 'S'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-secondary-900 mb-4">
              Pourquoi choisir Pioloop ?
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Une plateforme moderne qui simplifie la location immobilière pour tous
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-secondary-50 rounded-2xl p-8 text-center hover:shadow-medium transition-all duration-200 transform hover:-translate-y-1"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-secondary-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-2">500+</div>
              <div className="text-primary-100">Propriétés</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">10k+</div>
              <div className="text-primary-100">Utilisateurs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">98%</div>
              <div className="text-primary-100">Satisfaction</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-primary-100">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-secondary-900 mb-4">
              Ce que disent nos utilisateurs
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Découvrez les expériences de nos utilisateurs satisfaits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-medium transition-all duration-200"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-secondary-900">{testimonial.name}</div>
                    <div className="text-sm text-secondary-600">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-secondary-700 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex text-accent-500 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-secondary-900 to-secondary-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-6">
            Prêt à commencer votre aventure ?
          </h2>
          <p className="text-xl text-secondary-300 mb-8">
            Rejoignez des milliers d'utilisateurs qui font confiance à Pioloop pour leurs locations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-soft hover:shadow-medium transition-all duration-200 transform hover:-translate-y-1"
            >
              Commencer maintenant
            </Link>
            <Link
              href="/properties"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-secondary-900 font-semibold rounded-xl transition-all duration-200"
            >
              Explorer les propriétés
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 