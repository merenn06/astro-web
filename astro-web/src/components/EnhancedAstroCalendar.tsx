'use client';
import React, { useState, useEffect } from 'react';
import { 
  groupEventsByDate, 
  getPrimaryEvent, 
  getSecondaryEvents,
  formatDateForDisplay,
  formatTimeForDisplay,
  isToday,
  isPast,
  isFuture,
  getEventDisplayColor,
  getEventDisplayIcon
} from '@/lib/eventPriority';

interface EnhancedAstroEvent {
  id: string;
  type: string;
  subType: string;
  startUTC: string;
  endUTC?: string;
  labelTR: string;
  source: string;
  meta?: any;
}

interface EnhancedAstroCalendarProps {
  year: number;
  month: number;
  events: EnhancedAstroEvent[];
  onDateClick?: (date: Date, events: EnhancedAstroEvent[]) => void;
  onYearChange?: (year: number) => void;
  onMonthChange?: (month: number) => void;
}

export default function EnhancedAstroCalendar({ 
  year, 
  month, 
  events, 
  onDateClick,
  onYearChange,
  onMonthChange
}: EnhancedAstroCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Group events by date
  const groupedEvents = groupEventsByDate(events);
  
  // Generate calendar days
  const generateCalendarDays = () => {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday
    
    const days = [];
    const currentDate = new Date(startDate);
    
    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      const dateKey = currentDate.toISOString().split('T')[0];
      const dayEvents = groupedEvents.get(dateKey) || [];
      const primaryEvent = getPrimaryEvent(dayEvents);
      const secondaryEvents = getSecondaryEvents(dayEvents);
      
      days.push({
        date: new Date(currentDate),
        dateKey,
        dayEvents,
        primaryEvent,
        secondaryEvents,
        isCurrentMonth: currentDate.getMonth() === month - 1,
        isToday: isToday(currentDate),
        isPast: isPast(currentDate),
        isFuture: isFuture(currentDate)
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };
  
  const calendarDays = generateCalendarDays();
  
  const handleDateClick = (day: any) => {
    setSelectedDate(day.date);
    if (onDateClick) {
      onDateClick(day.date, day.dayEvents);
    }
  };
  
  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];
  
  const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header with Navigation */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => {
              if (month === 1) {
                onYearChange?.(year - 1);
                onMonthChange?.(12);
              } else {
                onMonthChange?.(month - 1);
              }
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <h2 className="text-2xl font-bold text-gray-800">
            {monthNames[month - 1]} {year}
          </h2>
          
          <button
            onClick={() => {
              if (month === 12) {
                onYearChange?.(year + 1);
                onMonthChange?.(1);
              } else {
                onMonthChange?.(month + 1);
              }
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <p className="text-sm text-gray-600">
          Gökyüzü Takvimi - Swiss Ephemeris & NASA Verileri
        </p>
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {/* Day headers */}
        {dayNames.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`
              relative min-h-[80px] p-2 border border-gray-200 cursor-pointer
              transition-all duration-200 hover:bg-gray-50
              ${!day.isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''}
              ${day.isToday ? 'bg-blue-50 border-blue-300' : ''}
              ${selectedDate && day.dateKey === selectedDate.toISOString().split('T')[0] ? 'bg-blue-100 border-blue-400' : ''}
            `}
            onClick={() => handleDateClick(day)}
          >
            {/* Date number */}
            <div className={`
              text-sm font-medium mb-1
              ${day.isToday ? 'text-blue-600' : ''}
              ${!day.isCurrentMonth ? 'text-gray-400' : ''}
            `}>
              {day.date.getDate()}
            </div>
            
            {/* Primary event */}
            {day.primaryEvent && (
              <div className="mb-1">
                <div className="flex items-center space-x-1">
                  <span className="text-xs">
                    {getEventDisplayIcon(day.primaryEvent)}
                  </span>
                  <span className={`
                    text-xs font-medium truncate
                    ${getEventDisplayColor(day.primaryEvent) === '#F59E0B' ? 'text-amber-600' : ''}
                    ${getEventDisplayColor(day.primaryEvent) === '#7C3AED' ? 'text-purple-600' : ''}
                    ${getEventDisplayColor(day.primaryEvent) === '#DC2626' ? 'text-red-600' : ''}
                    ${getEventDisplayColor(day.primaryEvent) === '#6B7280' ? 'text-gray-600' : ''}
                  `}>
                    {day.primaryEvent.labelTR}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {formatTimeForDisplay(new Date(day.primaryEvent.startUTC))}
                </div>
              </div>
            )}
            
            {/* Secondary events (badges) */}
            {day.secondaryEvents.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {day.secondaryEvents.slice(0, 2).map((event, eventIndex) => (
                  <div
                    key={eventIndex}
                    className="text-xs bg-gray-100 text-gray-600 px-1 py-0.5 rounded"
                    title={event.labelTR}
                  >
                    {getEventDisplayIcon(event)}
                  </div>
                ))}
                {day.secondaryEvents.length > 2 && (
                  <div className="text-xs bg-gray-100 text-gray-600 px-1 py-0.5 rounded">
                    +{day.secondaryEvents.length - 2}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Event Details Panel */}
      {selectedDate && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            {formatDateForDisplay(selectedDate)} - Olaylar
          </h3>
          
          {groupedEvents.get(selectedDate.toISOString().split('T')[0])?.length > 0 ? (
            <div className="space-y-3">
              {groupedEvents.get(selectedDate.toISOString().split('T')[0])?.map((event, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                  <span className="text-lg">
                    {getEventDisplayIcon(event)}
                  </span>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">
                      {event.labelTR}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatTimeForDisplay(new Date(event.startUTC))}
                      {event.endUTC && (
                        <span> - {formatTimeForDisplay(new Date(event.endUTC))}</span>
                      )}
                    </div>
                    {event.meta && (
                      <div className="text-xs text-gray-500 mt-1">
                        {event.meta.notes && <span>{event.meta.notes}</span>}
                        {event.meta.zhr && <span> • ZHR: {event.meta.zhr}</span>}
                        {event.meta.visibility && <span> • {event.meta.visibility}</span>}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">
                    {event.source}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Bu tarihte herhangi bir gökyüzü olayı bulunmuyor.</p>
          )}
        </div>
      )}
      
      {/* Legend */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Olay Türleri</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <span>🌑</span>
            <span>Tutulma</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>🌕</span>
            <span>Ay Fazları</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>🔄</span>
            <span>Gezegen Retroları</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>⭐</span>
            <span>Meteor Yağmurları</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>☀️</span>
            <span>Güneş Geçişleri</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>🌙</span>
            <span>Lilith Geçişleri</span>
          </div>
        </div>
      </div>
    </div>
  );
}
