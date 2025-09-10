"use client";

import React, { useState } from "react";

export interface TravelersData {
  adults: number;
  children: number;
  babies: number;
}

interface TravelersSelectorProps {
  travelers: TravelersData;
  onTravelersChange: (travelers: TravelersData) => void;
  className?: string;
  placeholder?: string;
}

const TravelersSelector: React.FC<TravelersSelectorProps> = ({
  travelers,
  onTravelersChange,
  className = "",
  placeholder = "Ajouter des voyageurs",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAdultChange = (newCount: number) => {
    if (newCount >= 0 && newCount <= 10) {
      onTravelersChange({
        ...travelers,
        adults: newCount,
      });
    }
  };

  const handleChildrenChange = (newCount: number) => {
    if (newCount >= 0 && newCount <= 10) {
      onTravelersChange({
        ...travelers,
        children: newCount,
      });
    }
  };

  const handleBabiesChange = (newCount: number) => {
    if (newCount >= 0 && newCount <= 5) {
      onTravelersChange({
        ...travelers,
        babies: newCount,
      });
    }
  };

  const totalTravelers = travelers.adults + travelers.children + travelers.babies;

  return (
    <div className={`relative ${className}`}>
      <div
        className="flex items-center justify-between bg-gray-50 rounded-lg p-4 h-12 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-3">
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
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <div className="flex-1">
            {totalTravelers >= 1 ? (
              <div className="text-sm font-medium text-gray-700">
                {totalTravelers === 1
                  ? "1 voyageur"
                  : `${totalTravelers} voyageurs`}
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                {placeholder}
              </div>
            )}
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
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

      {/* Travelers Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-sm mx-4">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-normal text-gray-700">
                Voyageurs
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-6">
                {/* Adultes */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-normal text-gray-700">Adultes</div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleAdultChange(travelers.adults - 1)}
                      disabled={travelers.adults <= 0}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-purple-500 hover:text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                          d="M20 12H4"
                        />
                      </svg>
                    </button>
                    <span className="font-normal text-gray-700 min-w-[3rem] text-center">
                      {travelers.adults}
                    </span>
                    <button
                      onClick={() => handleAdultChange(travelers.adults + 1)}
                      disabled={travelers.adults >= 10}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-purple-500 hover:text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Enfants */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-normal text-gray-700">Enfants</div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleChildrenChange(travelers.children - 1)}
                      disabled={travelers.children <= 0}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-purple-500 hover:text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                          d="M20 12H4"
                        />
                      </svg>
                    </button>
                    <span className="font-normal text-gray-700 min-w-[3rem] text-center">
                      {travelers.children}
                    </span>
                    <button
                      onClick={() => handleChildrenChange(travelers.children + 1)}
                      disabled={travelers.children >= 10}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-purple-500 hover:text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Bébés */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-normal text-gray-700">Bébés</div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleBabiesChange(travelers.babies - 1)}
                      disabled={travelers.babies <= 0}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-purple-500 hover:text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                          d="M20 12H4"
                        />
                      </svg>
                    </button>
                    <span className="font-normal text-gray-700 min-w-[3rem] text-center">
                      {travelers.babies}
                    </span>
                    <button
                      onClick={() => handleBabiesChange(travelers.babies + 1)}
                      disabled={travelers.babies >= 5}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-purple-500 hover:text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelersSelector;
