'use client';

import React from 'react';
import Link from 'next/link';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showBackToHome?: boolean;
}

export default function AuthLayout({ 
  children, 
  title, 
  subtitle, 
  showBackToHome = true 
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-primary-600">Pioloop</h1>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">{title}</h2>
          {subtitle && (
            <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
          )}
        </div>

        {/* Form Container */}
        <div className="bg-white py-8 px-6 shadow-xl rounded-lg">
          {children}
        </div>

        {/* Footer */}
        {showBackToHome && (
          <div className="text-center">
            <Link 
              href="/" 
              className="text-sm text-primary-600 hover:text-primary-500 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 