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
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Générer les données de disponibilité pour le mois sélectionné (fixe)
  const generateAvailabilityData = (month: number, year: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const firstDayOfWeek = firstDay.getDay(); // 0 = dimanche, 1 = lundi, etc.
    
    const availability = [];
    
    // Ajouter les jours vides du début du mois
    for (let i = 0; i < firstDayOfWeek; i++) {
      availability.push({
        date: null,
        fullDate: null,
        isPast: false,
        isAvailable: false,
        isBlocked: false,
        isEmpty: true
      });
    }
    
    // Ajouter les jours du mois avec disponibilité fixe
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isPast = date < new Date();
      
      // Utiliser une logique déterministe basée sur la date pour avoir des disponibilités fixes
      const dayOfWeek = date.getDay();
      const dayOfMonth = day;
      
      // Règles fixes pour la disponibilité :
      // - Les jours passés sont indisponibles
      // - Les week-ends (samedi=6, dimanche=0) sont disponibles
      // - Les jours pairs sont disponibles, les impairs sont bloqués (sauf week-ends)
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isEvenDay = dayOfMonth % 2 === 0;
      const isAvailable = !isPast && (isWeekend || isEvenDay);
      const isBlocked = !isPast && !isWeekend && !isEvenDay;
      
      availability.push({
        date: day,
        fullDate: date,
        isPast,
        isAvailable,
        isBlocked,
        isEmpty: false
      });
    }
    
    return availability;
  };

  const availabilityData = generateAvailabilityData(selectedMonth, selectedYear);
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const handleDateClick = (day: any) => {
    if (!day.isAvailable || day.isPast || day.isBlocked) return;
    
    const dateString = day.fullDate.toISOString().split('T')[0];
    
    if (!checkIn) {
      setCheckIn(dateString);
    } else if (!checkOut) {
      if (new Date(dateString) > new Date(checkIn)) {
        setCheckOut(dateString);
      } else {
        setCheckIn(dateString);
        setCheckOut('');
      }
    } else {
      setCheckIn(dateString);
      setCheckOut('');
    }
  };

  const getDayClass = (day: any) => {
    if (day.isEmpty) return 'text-transparent bg-transparent';
    if (day.isAvailable) {
      const dateString = day.fullDate.toISOString().split('T')[0];
      const isSelected = dateString === checkIn || dateString === checkOut;
      const isInRange = checkIn && checkOut && 
        new Date(dateString) > new Date(checkIn) && 
        new Date(dateString) < new Date(checkOut);
      
      if (isSelected) return 'text-white bg-purple-600 hover:bg-purple-700 cursor-pointer font-bold';
      if (isInRange) return 'text-purple-600 bg-purple-200 hover:bg-purple-300 cursor-pointer';
      return 'text-purple-700 bg-purple-100 hover:bg-purple-200 cursor-pointer';
    }
    return 'text-gray-400 bg-gray-100';
  };

  const calculateTotal = () => {
    if (!checkIn || !checkOut) return 0;
    
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
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
      const dayData = availabilityData.find(day => 
        day.fullDate && day.fullDate.toISOString().split('T')[0] === dateString
      );
      
      if (dayData && dayData.isAvailable) {
        availableNights++;
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return availableNights;
  };

  const total = calculateTotal();
  const nights = checkIn && checkOut ? 
    calculateAvailableNights(new Date(checkIn), new Date(checkOut)) : 0;

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

      {/* Sélection des dates dans le calendrier */}
      <div className="space-y-4">

        {/* Sélecteur de mois */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                if (selectedMonth === 0) {
                  setSelectedMonth(11);
                  setSelectedYear(selectedYear - 1);
                } else {
                  setSelectedMonth(selectedMonth - 1);
                }
              }}
              className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <h4 className="text-sm font-semibold text-gray-900">
              {monthNames[selectedMonth]} {selectedYear}
            </h4>
            
            <button
              onClick={() => {
                if (selectedMonth === 11) {
                  setSelectedMonth(0);
                  setSelectedYear(selectedYear + 1);
                } else {
                  setSelectedMonth(selectedMonth + 1);
                }
              }}
              className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <button
            onClick={() => {
              setSelectedMonth(new Date().getMonth());
              setSelectedYear(new Date().getFullYear());
            }}
            className="text-xs text-purple-600 hover:text-purple-700 font-medium"
          >
            Aujourd'hui
          </button>
        </div>

        {/* Calendrier */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {/* En-tête des jours de la semaine */}
          <div className="grid grid-cols-7 bg-gray-50">
            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day) => (
              <div key={day} className="p-2 text-center text-xs font-medium text-gray-700">
                {day}
              </div>
            ))}
          </div>
          
          {/* Grille du calendrier */}
          <div className="grid grid-cols-7">
            {availabilityData.map((day, index) => (
              <button
                key={index}
                onClick={() => !day.isEmpty && handleDateClick(day)}
                className={`p-2 text-center text-xs border-r border-b border-gray-200 last:border-r-0 ${getDayClass(day)}`}
                disabled={day.isEmpty || !day.isAvailable || day.isPast || day.isBlocked}
              >
                <div className="flex flex-col items-center">
                  <span className="font-medium">{day.date}</span>
                </div>
              </button>
            ))}
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
          onClick={() => {
            if (checkIn && checkOut) {
              // Logique de réservation
              console.log('Réservation:', { checkIn, checkOut, guests, total });
            }
          }}
          disabled={!checkIn || !checkOut}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            checkIn && checkOut
              ? 'bg-purple-600 text-white hover:bg-purple-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {checkIn && checkOut ? 'Réserver' : 'Sélectionnez vos dates'}
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
