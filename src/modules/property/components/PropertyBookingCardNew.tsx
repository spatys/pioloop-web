"use client";

import React, { useState } from 'react';
import { PropertyResponse } from '@/core/types/Property';
import { TravelersSelector, TravelersData } from '@/components/ui';
import PropertyDateRangePicker from '@/components/ui/PropertyDateRangePicker';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PropertyBookingCardProps {
  property: PropertyResponse;
}

export const PropertyBookingCard: React.FC<PropertyBookingCardProps> = ({ property }) => {
  const [selectedDates, setSelectedDates] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [travelers, setTravelers] = useState<TravelersData>({
    adults: 1,
    children: 0,
    babies: 0,
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleTravelersChange = (newTravelers: TravelersData) => {
    setTravelers(newTravelers);
  };

  // Simuler des dates indisponibles (à remplacer par les vraies données de l'API)
  const unavailableDates = [
    new Date(2024, 11, 15), // 15 décembre 2024
    new Date(2024, 11, 20), // 20 décembre 2024
    new Date(2024, 11, 25), // 25 décembre 2024
  ];

  const calculateTotal = () => {
    if (!selectedDates.from || !selectedDates.to) return 0;
    
    const startDate = selectedDates.from;
    const endDate = selectedDates.to;
    const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (nights <= 0) return 0;
    
    // Vérifier que tous les jours de la sélection sont disponibles
    const availableNights = calculateAvailableNights(startDate, endDate);
    
    const basePrice = property.pricePerNight * availableNights;
    const cleaningFee = property.cleaningFee || 0;
    const serviceFee = property.serviceFee || 0;
    
    return basePrice + cleaningFee + serviceFee;
  };

  const calculateAvailableNights = (startDate: Date, endDate: Date) => {
    let availableNights = 0;
    const currentDate = new Date(startDate);
    
    while (currentDate < endDate) {
      const dateString = currentDate.toISOString().split('T')[0];
      const isUnavailable = unavailableDates.some(unavailableDate => 
        unavailableDate.toISOString().split('T')[0] === dateString
      );
      
      if (!isUnavailable) {
        availableNights++;
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return availableNights;
  };

  const total = calculateTotal();
  const nights = selectedDates.from && selectedDates.to ? 
    calculateAvailableNights(selectedDates.from, selectedDates.to) : 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-24">
      {/* Prix et note */}
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <span className="text-2xl font-semibold text-gray-900">
            {property.pricePerNight.toLocaleString()} €
          </span>
          <span className="text-gray-600 ml-1">par nuit</span>
        </div>
        {property.averageRating && (
          <div className="flex items-center space-x-1">
            <svg
              className="w-4 h-4 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-medium text-gray-900">
              {property.averageRating.toFixed(1)}
            </span>
            <span className="text-sm text-gray-500">({property.reviewCount || 0})</span>
          </div>
        )}
      </div>

      {/* Sélection des dates */}
      <div className="space-y-4">
        {/* Dates sélectionnées */}
        <div
          className="flex items-center space-x-3 bg-gray-50 rounded-lg p-4 h-12 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
          onClick={() => setIsCalendarOpen(true)}
        >
          <svg
            className="w-5 h-5 text-gray-400 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <div className="flex-1">
            {selectedDates.from ? (
              <div className="text-sm font-medium text-gray-700">
                {format(selectedDates.from, "dd/MM/yyyy", { locale: fr })}
                {selectedDates.to &&
                  ` - ${format(selectedDates.to, "dd/MM/yyyy", { locale: fr })}`}
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                Sélectionner vos dates
              </div>
            )}
          </div>
          <svg
            className="w-4 h-4 text-gray-400 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {/* Calendar Modal */}
        {isCalendarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative">
              <PropertyDateRangePicker
                selectedDates={selectedDates}
                onSelect={setSelectedDates}
                onClose={() => setIsCalendarOpen(false)}
                unavailableDates={unavailableDates}
                maxGuests={property.maxGuests}
              />
            </div>
          </div>
        )}

        {/* Voyageurs */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Voyageurs</label>
          <TravelersSelector
            travelers={travelers}
            onTravelersChange={handleTravelersChange}
            placeholder="Sélectionner les voyageurs"
            maxTotal={property.maxGuests}
          />
        </div>

        {/* Bouton de réservation */}
        <button
          onClick={() => {
            if (selectedDates.from && selectedDates.to) {
              // Logique de réservation
              const totalTravelers = travelers.adults + travelers.children + travelers.babies;
              console.log('Réservation:', { 
                checkIn: selectedDates.from.toISOString().split('T')[0], 
                checkOut: selectedDates.to.toISOString().split('T')[0], 
                travelers: totalTravelers,
                travelersDetail: travelers,
                total 
              });
            }
          }}
          disabled={!selectedDates.from || !selectedDates.to}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            selectedDates.from && selectedDates.to
              ? 'bg-purple-600 text-white hover:bg-purple-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {selectedDates.from && selectedDates.to ? 'Réserver' : 'Sélectionner des dates'}
        </button>
      </div>

      {/* Détail des prix */}
      {total > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">
                {property.pricePerNight.toLocaleString()} € × {nights} {nights === 1 ? 'nuit disponible' : 'nuits disponibles'}
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
            
            <div className="flex justify-between font-semibold text-base pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>{total.toLocaleString()} €</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
