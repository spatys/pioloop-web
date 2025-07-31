import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addDays, subDays, isBefore, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DateRangePickerProps {
  selectedDates: { from: Date | undefined; to: Date | undefined };
  onSelect: (dates: { from: Date | undefined; to: Date | undefined }) => void;
  onClose: () => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ selectedDates, onSelect, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const daysOfWeek = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const getDaysInMonth = (date: Date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const days = eachDayOfInterval({ start, end });

    // Ajouter les jours du mois précédent pour remplir la première semaine
    const firstDayOfWeek = start.getDay();
    const prevMonthDays = [];
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      prevMonthDays.push(subDays(start, i + 1));
    }

    // Ajouter les jours du mois suivant pour remplir la dernière semaine
    const lastDayOfWeek = end.getDay();
    const nextMonthDays = [];
    for (let i = 1; i <= 6 - lastDayOfWeek; i++) {
      nextMonthDays.push(addDays(end, i));
    }

    return [...prevMonthDays, ...days, ...nextMonthDays];
  };

  const handleDateClick = (date: Date) => {
    // Empêcher la sélection des dates passées
    if (isBefore(startOfDay(date), startOfDay(new Date()))) {
      return;
    }

    if (!selectedDates.from || (selectedDates.from && selectedDates.to)) {
      // Première sélection ou nouvelle sélection
      onSelect({ from: date, to: undefined });
    } else {
      // Deuxième sélection
      if (date < selectedDates.from) {
        onSelect({ from: date, to: selectedDates.from });
      } else {
        onSelect({ from: selectedDates.from, to: date });
      }
    }
  };

  const isInRange = (date: Date) => {
    if (!selectedDates.from || !selectedDates.to) return false;
    return date >= selectedDates.from && date <= selectedDates.to;
  };

  const isRangeStart = (date: Date) => {
    return selectedDates.from && isSameDay(date, selectedDates.from);
  };

  const isRangeEnd = (date: Date) => {
    return selectedDates.to && isSameDay(date, selectedDates.to);
  };

  const isCurrentMonth = (date: Date) => {
    return isSameMonth(date, currentMonth);
  };

  const isPastDate = (date: Date) => {
    const today = startOfDay(new Date());
    const checkDate = startOfDay(date);
    return isBefore(checkDate, today);
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-purple-100 p-6 w-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Sélectionner vos dates</h3>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 rounded-lg hover:bg-purple-50 text-purple-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl font-bold text-gray-900">
          {(() => {
            const label = format(currentMonth, 'MMMM yyyy', { locale: fr });
            return label.charAt(0).toUpperCase() + label.slice(1);
          })()}
        </h2>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 rounded-lg hover:bg-purple-50 text-purple-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="h-10 flex items-center justify-center text-sm font-semibold text-gray-600">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-x-0 gap-y-1 relative">
        {days.map((day, index) => {
          const isSelected = selectedDates.from && isSameDay(day, selectedDates.from);
          const isInSelectedRange = isInRange(day);
          const isStart = isRangeStart(day);
          const isEnd = isRangeEnd(day);
          const isHovered = hoveredDate && isSameDay(day, hoveredDate);
          const isCurrentDay = isToday(day);
          const isPast = isPastDate(day);

          return (
            <div key={index} className="relative flex items-center justify-center">
              {/* Bande continue avec arrondis intérieurs */}
              {isStart && !isEnd && (
                <div className="absolute left-1/2 right-0 top-1/2 -translate-y-1/2 h-10 bg-purple-100 z-0" />
              )}
              {isEnd && !isStart && (
                <div className="absolute left-0 right-1/2 top-1/2 -translate-y-1/2 h-10 bg-purple-100 z-0" />
              )}
              {isInSelectedRange && !isStart && !isEnd && (
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-10 bg-purple-100 z-0" />
              )}
              <button
                onClick={() => handleDateClick(day)}
                onMouseEnter={() => !isPast && setHoveredDate(day)}
                onMouseLeave={() => setHoveredDate(null)}
                disabled={isPast}
                className={`
                  w-10 h-10 text-sm font-medium transition-all duration-200 flex items-center justify-center relative rounded-full mx-auto
                  ${isPast
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'hover:bg-purple-50 hover:text-purple-700 cursor-pointer text-gray-900'
                  }
                  ${isCurrentDay && !isSelected && !isInSelectedRange && !isPast
                    ? 'bg-purple-50 text-purple-600 border-2 border-purple-200 z-10' 
                    : ''
                  }
                  ${isSelected 
                    ? 'bg-purple-600 text-white shadow-lg z-10' 
                    : ''
                  }
                  ${isStart 
                    ? 'bg-purple-600 text-white shadow-lg z-10' 
                    : ''
                  }
                  ${isEnd 
                    ? 'bg-purple-600 text-white shadow-lg z-10' 
                    : ''
                  }
                  ${isHovered && !isSelected && !isInSelectedRange && !isPast
                    ? 'bg-purple-50 text-purple-700 scale-110 z-10' 
                    : ''
                  }
                `}
              >
                {format(day, 'd')}
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {selectedDates.from && (
              <span>
                Du {format(selectedDates.from, 'dd/MM/yyyy')}
                {selectedDates.to && ` au ${format(selectedDates.to, 'dd/MM/yyyy')}`}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onSelect({ from: undefined, to: undefined })}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Effacer
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Valider
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker; 