'use client';

import React, { useState } from 'react';
import DateRangePicker from './DateRangePicker';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export interface SearchFormData {
  location: string;
  dates: { from: Date | undefined; to: Date | undefined };
  travelers: number;
}

interface SearchFormProps {
  onSearch?: (data: SearchFormData) => void;
  className?: string;
}

const SearchForm: React.FC<SearchFormProps> = ({ 
  onSearch, 
  className = ''
}) => {
  const [location, setLocation] = useState('');
  const [selectedDates, setSelectedDates] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [travelers, setTravelers] = useState(1);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isTravelersOpen, setIsTravelersOpen] = useState(false);

  const handleSearch = () => {
    const searchData: SearchFormData = {
      location,
      dates: selectedDates,
      travelers
    };
    onSearch?.(searchData);
  };

  const handleTravelerChange = (newCount: number) => {
    if (newCount >= 1 && newCount <= 10) {
      setTravelers(newCount);
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 shadow-sm ${className}`}>
      <div className="space-y-4">
        {/* Lieu */}
        <div className="relative">
          <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-4 h-12">
            <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <input
              type="text"
              placeholder="Où voulez-vous aller ?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none text-sm font-medium h-full"
            />
          </div>
        </div>

        {/* Date Range */}
        <div className="relative">
          <div 
            className="flex items-center space-x-3 bg-gray-50 rounded-lg p-4 h-12 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setIsCalendarOpen(true)}
          >
            <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div className="flex-1">
              {selectedDates.from ? (
                <div className="text-sm font-medium text-gray-700">
                  {format(selectedDates.from, 'dd/MM/yyyy', { locale: fr })}
                  {selectedDates.to && ` - ${format(selectedDates.to, 'dd/MM/yyyy', { locale: fr })}`}
                </div>
              ) : (
                <div className="text-sm text-gray-500">Sélectionner vos dates</div>
              )}
            </div>
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {/* Calendar Modal */}
          {isCalendarOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="relative">
                <DateRangePicker
                  selectedDates={selectedDates}
                  onSelect={setSelectedDates}
                  onClose={() => setIsCalendarOpen(false)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Nombre de voyageurs */}
        <div className="relative">
          <div 
            className="flex items-center justify-between bg-gray-50 rounded-lg p-4 h-12 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setIsTravelersOpen(!isTravelersOpen)}
          >
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <div>
                <div className="text-sm font-medium text-gray-700">Voyageurs</div>
                <div className="text-xs text-gray-500">
                  {travelers === 1 ? '1 voyageur' : `${travelers} voyageurs`}
                </div>
              </div>
            </div>
            <svg className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${isTravelersOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Travelers Dropdown */}
          {isTravelersOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-40">
              <div className="px-4 py-2">
                <div className="text-sm font-medium text-gray-700 mb-3">Nombre de voyageurs</div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleTravelerChange(travelers - 1)}
                    disabled={travelers <= 1}
                    className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-purple-500 hover:text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="text-lg font-semibold text-gray-900 min-w-[2rem] text-center">
                    {travelers}
                  </span>
                  <button
                    onClick={() => handleTravelerChange(travelers + 1)}
                    disabled={travelers >= 10}
                    className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-purple-500 hover:text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bouton de recherche */}
      <div className="mt-4">
        <button 
          onClick={handleSearch}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span>Rechercher</span>
        </button>
      </div>

      
    </div>
  );
};

export default SearchForm; 