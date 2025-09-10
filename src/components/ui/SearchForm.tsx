"use client";

import React, { useState } from "react";
import DateRangePicker from "./DateRangePicker";
import TravelersSelector, { TravelersData } from "./TravelersSelector";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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
  className = "",
}) => {
  const [location, setLocation] = useState("");
  const [selectedDates, setSelectedDates] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [travelers, setTravelers] = useState<TravelersData>({
    adults: 0,
    children: 0,
    babies: 0,
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleSearch = () => {
    const searchData: SearchFormData = {
      location,
      dates: selectedDates,
      travelers: travelers.adults + travelers.children + travelers.babies,
    };
    onSearch?.(searchData);
  };

  const handleTravelersChange = (newTravelers: TravelersData) => {
    setTravelers(newTravelers);
  };

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-6 shadow-sm ${className}`}
    >
      <div className="space-y-4">
        {/* Lieu */}
        <div className="relative">
          <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-4 h-12">
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
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
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
        <TravelersSelector
          travelers={travelers}
          onTravelersChange={handleTravelersChange}
        />
      </div>

      {/* Bouton de recherche */}
      <div className="mt-4">
        <button
          onClick={handleSearch}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <span>Rechercher</span>
        </button>
      </div>
    </div>
  );
};

export default SearchForm;
