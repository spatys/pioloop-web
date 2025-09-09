"use client";

import React, { useState, useEffect } from "react";
import { 
  PropertyAvailability, 
  AvailabilityPeriod, 
  BulkUpdateAvailabilityRequest,
  DateRange 
} from "@/core/types/Availability";
import { AvailabilityCalendar } from "./AvailabilityCalendar";
import { 
  Calendar, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  DollarSign,
  Lock,
  Unlock,
  AlertCircle
} from "lucide-react";

interface AvailabilityManagerProps {
  propertyId: string;
  basePrice: number;
  onAvailabilityChange?: (availabilities: PropertyAvailability[]) => void;
  className?: string;
}

export const AvailabilityManager: React.FC<AvailabilityManagerProps> = ({
  propertyId,
  basePrice,
  onAvailabilityChange,
  className = ""
}) => {
  const [availabilities, setAvailabilities] = useState<PropertyAvailability[]>([]);
  const [selectedRange, setSelectedRange] = useState<DateRange>({ startDate: null, endDate: null });
  const [isEditing, setIsEditing] = useState(false);
  const [editingAvailability, setEditingAvailability] = useState<PropertyAvailability | null>(null);
  const [showBulkEditor, setShowBulkEditor] = useState(false);
  const [bulkPeriods, setBulkPeriods] = useState<AvailabilityPeriod[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock calendar data - replace with actual API call
  const mockCalendar = {
    propertyId,
    calendar: generateMockCalendar(),
    basePrice,
    currency: "XAF"
  };

  function generateMockCalendar() {
    const calendar = [];
    const today = new Date();
    
    for (let i = 0; i < 90; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      calendar.push({
        date,
        isAvailable: Math.random() > 0.3, // 70% available
        price: basePrice + (Math.random() > 0.8 ? Math.random() * 10000 : 0),
        isToday: date.toDateString() === today.toDateString(),
        isPast: date < today,
        isSpecialPrice: Math.random() > 0.8
      });
    }
    
    return calendar;
  }

  const handleRangeSelect = (range: DateRange) => {
    setSelectedRange(range);
    if (range.startDate && range.endDate) {
      setShowBulkEditor(true);
    }
  };

  const handleBulkUpdate = async () => {
    setLoading(true);
    
    const request: BulkUpdateAvailabilityRequest = {
      propertyId,
      periods: bulkPeriods
    };

    // TODO: Replace with actual API call
    console.log('Bulk update request:', request);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setLoading(false);
    setShowBulkEditor(false);
    setBulkPeriods([]);
    setSelectedRange({ startDate: null, endDate: null });
    
    // Refresh availabilities
    // await loadAvailabilities();
  };

  const handleEditAvailability = (availability: PropertyAvailability) => {
    setEditingAvailability(availability);
    setIsEditing(true);
  };

  const handleDeleteAvailability = async (id: string) => {
    setLoading(true);
    
    // TODO: Replace with actual API call
    console.log('Delete availability:', id);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setAvailabilities(prev => prev.filter(a => a.id !== id));
    setLoading(false);
  };

  const addBulkPeriod = () => {
    if (selectedRange.startDate && selectedRange.endDate) {
      const newPeriod: AvailabilityPeriod = {
        startDate: selectedRange.startDate,
        endDate: selectedRange.endDate,
        isAvailable: true,
        specialPrice: undefined,
        notes: ""
      };
      
      setBulkPeriods(prev => [...prev, newPeriod]);
    }
  };

  const removeBulkPeriod = (index: number) => {
    setBulkPeriods(prev => prev.filter((_, i) => i !== index));
  };

  const updateBulkPeriod = (index: number, field: keyof AvailabilityPeriod, value: any) => {
    setBulkPeriods(prev => prev.map((period, i) => 
      i === index ? { ...period, [field]: value } : period
    ));
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Calendar className="h-6 w-6 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">Gestion de la disponibilité</h2>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowBulkEditor(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Ajouter des périodes</span>
          </button>
        </div>
      </div>

      {/* Calendar */}
      <AvailabilityCalendar
        calendar={mockCalendar}
        onDateRangeSelect={handleRangeSelect}
        selectionMode="range"
        options={{
          allowPastSelection: false,
          monthsToShow: 2
        }}
      />

      {/* Bulk Editor Modal */}
      {showBulkEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Gestion des périodes</h3>
                <button
                  onClick={() => setShowBulkEditor(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Selected Range */}
              {selectedRange.startDate && selectedRange.endDate && (
                <div className="mb-6 p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-900">Période sélectionnée</span>
                  </div>
                  <p className="text-sm text-purple-700">
                    {selectedRange.startDate.toLocaleDateString('fr-FR')} - {selectedRange.endDate.toLocaleDateString('fr-FR')}
                  </p>
                </div>
              )}

              {/* Add Period Button */}
              <button
                onClick={addBulkPeriod}
                className="w-full mb-4 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors flex items-center justify-center space-x-2"
              >
                <Plus className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Ajouter cette période</span>
              </button>

              {/* Periods List */}
              {bulkPeriods.length > 0 && (
                <div className="space-y-3 mb-6">
                  {bulkPeriods.map((period, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">
                            {period.startDate.toLocaleDateString('fr-FR')} - {period.endDate.toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <button
                          onClick={() => removeBulkPeriod(index)}
                          className="p-1 hover:bg-red-100 rounded transition-colors"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Availability Toggle */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateBulkPeriod(index, 'isAvailable', !period.isAvailable)}
                            className={`p-2 rounded-lg transition-colors ${
                              period.isAvailable 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {period.isAvailable ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                          </button>
                          <span className="text-sm text-gray-600">
                            {period.isAvailable ? 'Disponible' : 'Indisponible'}
                          </span>
                        </div>

                        {/* Special Price */}
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Prix spécial</label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                              type="number"
                              value={period.specialPrice || ''}
                              onChange={(e) => updateBulkPeriod(index, 'specialPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                              placeholder={basePrice.toString()}
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        {/* Notes */}
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Notes</label>
                          <input
                            type="text"
                            value={period.notes || ''}
                            onChange={(e) => updateBulkPeriod(index, 'notes', e.target.value)}
                            placeholder="Notes optionnelles"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowBulkEditor(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleBulkUpdate}
                  disabled={loading || bulkPeriods.length === 0}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>Sauvegarder</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Existing Availabilities */}
      {availabilities.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Périodes configurées</h3>
          
          <div className="space-y-3">
            {availabilities.map((availability) => (
              <div key={availability.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${
                    availability.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {availability.isAvailable ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {availability.checkInDate.toLocaleDateString('fr-FR')} - {availability.checkOutDate.toLocaleDateString('fr-FR')}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{availability.isAvailable ? 'Disponible' : 'Indisponible'}</span>
                      {availability.specialPrice && (
                        <span className="text-yellow-600">
                          Prix spécial: {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(availability.specialPrice)}
                        </span>
                      )}
                      {availability.notes && (
                        <span className="text-gray-400">"{availability.notes}"</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditAvailability(availability)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit3 className="h-4 w-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => handleDeleteAvailability(availability.id)}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">Conseils pour gérer votre disponibilité :</p>
          <ul className="space-y-1 text-blue-700">
            <li>• Sélectionnez des périodes sur le calendrier pour les configurer rapidement</li>
            <li>• Utilisez les prix spéciaux pour les périodes de haute saison</li>
            <li>• Marquez les dates indisponibles pour la maintenance ou les réservations personnelles</li>
            <li>• Les notes vous aident à vous rappeler pourquoi une période est configurée</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
