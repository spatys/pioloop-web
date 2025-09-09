"use client";

import React, { useState } from 'react';
import { PropertyResponse } from '@/core/types/Property';

interface PropertyBookingCardProps {
  property: PropertyResponse;
}

export const PropertyBookingCard: React.FC<PropertyBookingCardProps> = ({ property }) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  const calculateTotal = () => {
    if (!checkIn || !checkOut) return 0;
    
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (nights <= 0) return 0;
    
    const basePrice = property.pricePerNight * nights;
    const cleaningFee = property.cleaningFee || 0;
    const serviceFee = property.serviceFee || 0;
    
    return basePrice + cleaningFee + serviceFee;
  };

  const total = calculateTotal();
  const nights = checkIn && checkOut ? 
    Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-24">
      {/* Prix et note */}
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <span className="text-2xl font-semibold text-gray-900">
            {property.pricePerNight.toLocaleString()} €
          </span>
          <span className="text-gray-600 ml-1">/ nuit</span>
        </div>
        {property.averageRating && (
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-medium text-gray-900">{property.averageRating.toFixed(1)}</span>
            <span className="text-sm text-gray-500">({property.reviewCount || 0})</span>
          </div>
        )}
      </div>

      {/* Formulaire de réservation */}
      <form className="space-y-4">
        {/* Dates */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Arrivée</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Départ</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Voyageurs */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Voyageurs</label>
          <select
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {Array.from({ length: property.maxGuests }, (_, i) => i + 1).map(num => (
              <option key={num} value={num}>{num} {num === 1 ? 'voyageur' : 'voyageurs'}</option>
            ))}
          </select>
        </div>

        {/* Bouton de réservation */}
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors"
        >
          Réserver
        </button>
      </form>

      {/* Détail des prix */}
      {total > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">
                {property.pricePerNight.toLocaleString()} € × {nights} {nights === 1 ? 'nuit' : 'nuits'}
              </span>
              <span className="text-gray-900">
                {(property.pricePerNight * nights).toLocaleString()} €
              </span>
            </div>
            
            {property.cleaningFee && property.cleaningFee > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Frais de ménage</span>
                <span className="text-gray-900">{property.cleaningFee.toLocaleString()} €</span>
              </div>
            )}
            
            {property.serviceFee && property.serviceFee > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Frais de service</span>
                <span className="text-gray-900">{property.serviceFee.toLocaleString()} €</span>
              </div>
            )}
            
            <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>{total.toLocaleString()} €</span>
            </div>
          </div>
        </div>
      )}

      {/* Informations supplémentaires */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Vous ne serez pas encore débité
        </p>
      </div>
    </div>
  );
};
