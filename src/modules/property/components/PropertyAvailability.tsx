"use client";

import React, { useState } from 'react';
import { PropertyResponse } from '@/core/types/Property';

interface PropertyAvailabilityProps {
  property: PropertyResponse;
}

export const PropertyAvailability: React.FC<PropertyAvailabilityProps> = ({ property }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Générer les données de disponibilité pour le mois sélectionné
  const generateAvailabilityData = (month: number, year: number) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const availability = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isPast = date < new Date();
      const isAvailable = Math.random() > 0.3; // 70% de chance d'être disponible
      const isBlocked = Math.random() > 0.9; // 10% de chance d'être bloqué
      
      availability.push({
        date: day,
        isPast,
        isAvailable: !isPast && isAvailable && !isBlocked,
        isBlocked: !isPast && isBlocked,
        price: isAvailable ? property.pricePerNight + Math.floor(Math.random() * 50) : null
      });
    }
    
    return availability;
  };

  const availabilityData = generateAvailabilityData(selectedMonth, selectedYear);
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const getDayClass = (day: any) => {
    if (day.isPast) return 'text-gray-300 bg-gray-100';
    if (day.isBlocked) return 'text-gray-400 bg-red-100';
    if (day.isAvailable) return 'text-gray-900 bg-green-100 hover:bg-green-200 cursor-pointer';
    return 'text-gray-400 bg-gray-100';
  };

  const getDayPrice = (day: any) => {
    if (!day.isAvailable || day.isPast || day.isBlocked) return null;
    return day.price;
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Disponibilité et tarifs</h3>
      
      {/* Sélecteur de mois */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              if (selectedMonth === 0) {
                setSelectedMonth(11);
                setSelectedYear(selectedYear - 1);
              } else {
                setSelectedMonth(selectedMonth - 1);
              }
            }}
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <h4 className="text-lg font-semibold text-gray-900">
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
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <button
          onClick={() => {
            setSelectedMonth(new Date().getMonth());
            setSelectedYear(new Date().getFullYear());
          }}
          className="text-purple-600 hover:text-purple-700 font-medium"
        >
          Aujourd'hui
        </button>
      </div>

      {/* Calendrier */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* En-tête des jours de la semaine */}
        <div className="grid grid-cols-7 bg-gray-50">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-700">
              {day}
            </div>
          ))}
        </div>
        
        {/* Grille du calendrier */}
        <div className="grid grid-cols-7">
          {availabilityData.map((day, index) => (
            <div
              key={index}
              className={`p-3 text-center text-sm border-r border-b border-gray-200 last:border-r-0 ${getDayClass(day)}`}
            >
              <div className="flex flex-col items-center space-y-1">
                <span className="font-medium">{day.date}</span>
                {getDayPrice(day) && (
                  <span className="text-xs font-semibold">
                    {getDayPrice(day)}€
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Légende */}
      <div className="flex flex-wrap items-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
          <span className="text-gray-700">Disponible</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
          <span className="text-gray-700">Bloqué</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded"></div>
          <span className="text-gray-700">Indisponible</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
          <span className="text-gray-700">Passé</span>
        </div>
      </div>

      {/* Informations sur les tarifs */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">À propos des tarifs</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Les prix affichés sont par nuit pour 2 voyageurs</li>
          <li>• Des frais de service peuvent s'ajouter au total</li>
          <li>• Les tarifs peuvent varier selon la saison et la demande</li>
          <li>• Contactez l'hôte pour des séjours de plus de 28 nuits</li>
        </ul>
      </div>

      {/* Règles d'annulation */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2">Règles d'annulation</h4>
        <div className="text-sm text-gray-700 space-y-2">
          <p><strong>Annulation gratuite</strong> jusqu'à 48h avant l'arrivée</p>
          <p><strong>Remboursement de 50%</strong> si annulation entre 48h et 24h avant l'arrivée</p>
          <p><strong>Aucun remboursement</strong> si annulation moins de 24h avant l'arrivée</p>
        </div>
      </div>
    </div>
  );
};
