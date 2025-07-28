'use client';

import React from 'react';
import Header from '../components/layout/Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Pioloop</h3>
              <p className="text-gray-400">
                Making real estate rental simple, secure, and enjoyable for everyone.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">For Tenants</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/properties" className="hover:text-white">Browse Properties</a></li>
                <li><a href="/how-it-works" className="hover:text-white">How It Works</a></li>
                <li><a href="/support" className="hover:text-white">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">For Owners</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/list-property" className="hover:text-white">List Your Property</a></li>
                <li><a href="/dashboard" className="hover:text-white">Dashboard</a></li>
                <li><a href="/pricing" className="hover:text-white">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/about" className="hover:text-white">About Us</a></li>
                <li><a href="/careers" className="hover:text-white">Careers</a></li>
                <li><a href="/contact" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Pioloop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 