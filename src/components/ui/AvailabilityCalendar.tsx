"use client";

import React, { useState, useEffect } from "react";
import { 
  PropertyAvailabilityCalendar, 
  AvailabilityDay, 
  CalendarOptions,
  DateRange 
} from "@/core/types/Availability";
import { ChevronLeft, ChevronRight, Calendar, DollarSign, Lock, Unlock } from "lucide-react";

interface AvailabilityCalendarProps {
  calendar: PropertyAvailabilityCalendar;
  onDateClick?: (date: Date, day: AvailabilityDay) => void;
  onDateRangeSelect?: (range: DateRange) => void;
  selectionMode?: 'single' | 'range' | 'multiple';
  options?: Partial<CalendarOptions>;
  className?: string;
}

export const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  calendar,
  onDateClick,
  onDateRangeSelect,
  selectionMode = 'single',
  options = {},
  className = ""
}) => {
  const defaultOptions: CalendarOptions = {
    showPastDates: true,
    showToday: true,
    allowPastSelection: false,
    monthsToShow: 2,
    startDayOfWeek: 1, // Monday
    ...options
  };

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState<DateRange>({ startDate: null, endDate: null });
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit' 
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getDayClass = (day: AvailabilityDay) => {
    const baseClass = "w-10 h-10 flex items-center justify-center text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer relative";
    
    if (day.isPast && !defaultOptions.allowPastSelection) {
      return `${baseClass} text-gray-300 cursor-not-allowed bg-gray-50`;
    }
    
    if (day.isToday) {
      return `${baseClass} bg-purple-100 text-purple-700 border-2 border-purple-300`;
    }
    
    if (!day.isAvailable) {
      return `${baseClass} bg-red-100 text-red-600 cursor-not-allowed`;
    }
    
    if (day.isSpecialPrice) {
      return `${baseClass} bg-yellow-100 text-yellow-700 hover:bg-yellow-200`;
    }
    
    return `${baseClass} bg-white text-gray-700 hover:bg-purple-50 hover:text-purple-700 border border-gray-200`;
  };

  const handleDateClick = (day: AvailabilityDay) => {
    if (day.isPast && !defaultOptions.allowPastSelection) return;
    if (!day.isAvailable) return;

    if (selectionMode === 'single') {
      setSelectedDates([day.date]);
      onDateClick?.(day.date, day);
    } else if (selectionMode === 'range') {
      if (!selectedRange.startDate || (selectedRange.startDate && selectedRange.endDate)) {
        setSelectedRange({ startDate: day.date, endDate: null });
      } else if (selectedRange.startDate && !selectedRange.endDate) {
        const start = selectedRange.startDate;
        const end = day.date;
        const finalRange = start <= end ? { startDate: start, endDate: end } : { startDate: end, endDate: start };
        setSelectedRange(finalRange);
        onDateRangeSelect?.(finalRange);
      }
    } else if (selectionMode === 'multiple') {
      const isSelected = selectedDates.some(d => d.getTime() === day.date.getTime());
      if (isSelected) {
        setSelectedDates(selectedDates.filter(d => d.getTime() !== day.date.getTime()));
      } else {
        setSelectedDates([...selectedDates, day.date]);
      }
    }
  };

  const isDateInRange = (date: Date) => {
    if (!selectedRange.startDate || !selectedRange.endDate) return false;
    return date >= selectedRange.startDate && date <= selectedRange.endDate;
  };

  const isDateSelected = (date: Date) => {
    return selectedDates.some(d => d.getTime() === date.getTime());
  };

  const generateCalendarDays = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - ((firstDay.getDay() + 7 - defaultOptions.startDayOfWeek) % 7));
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const dayData = calendar.calendar.find(d => 
        d.date.getFullYear() === current.getFullYear() &&
        d.date.getMonth() === current.getMonth() &&
        d.date.getDate() === current.getDate()
      );
      
      days.push({
        date: new Date(current),
        dayData: dayData || {
          date: new Date(current),
          isAvailable: true,
          price: calendar.basePrice,
          isToday: current.toDateString() === new Date().toDateString(),
          isPast: current < new Date(),
          isSpecialPrice: false
        }
      });
      
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Calendar className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Disponibilité</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <span className="text-sm font-medium text-gray-700 min-w-[120px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-white border border-gray-200 rounded"></div>
          <span className="text-xs text-gray-600">Disponible</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-100 rounded"></div>
          <span className="text-xs text-gray-600">Prix spécial</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-100 rounded"></div>
          <span className="text-xs text-gray-600">Indisponible</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-purple-100 border-2 border-purple-300 rounded"></div>
          <span className="text-xs text-gray-600">Aujourd'hui</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {dayNames.map(day => (
          <div key={day} className="p-2 text-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {generateCalendarDays(currentDate.getFullYear(), currentDate.getMonth()).map(({ date, dayData }, index) => {
          const isInRange = isDateInRange(date);
          const isSelected = isDateSelected(date);
          
          return (
            <div
              key={index}
              className={`${getDayClass(dayData)} ${
                isInRange ? 'bg-purple-200 text-purple-800' : ''
              } ${isSelected ? 'bg-purple-600 text-white' : ''}`}
              onClick={() => handleDateClick(dayData)}
            >
              <span>{date.getDate()}</span>
              
              {/* Price indicator */}
              {dayData.isSpecialPrice && (
                <div className="absolute -top-1 -right-1">
                  <DollarSign className="h-3 w-3 text-yellow-600" />
                </div>
              )}
              
              {/* Availability indicator */}
              {!dayData.isAvailable && (
                <div className="absolute -bottom-1 -right-1">
                  <Lock className="h-3 w-3 text-red-500" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Price Summary */}
      {selectedRange.startDate && selectedRange.endDate && (
        <div className="mt-6 p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-900">
                {formatDate(selectedRange.startDate)} - {formatDate(selectedRange.endDate)}
              </p>
              <p className="text-xs text-purple-600">
                {Math.ceil((selectedRange.endDate.getTime() - selectedRange.startDate.getTime()) / (1000 * 60 * 60 * 24))} nuit(s)
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-purple-900">
                {formatPrice(calendar.basePrice * Math.ceil((selectedRange.endDate.getTime() - selectedRange.startDate.getTime()) / (1000 * 60 * 60 * 24)))}
              </p>
              <p className="text-xs text-purple-600">Total estimé</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
