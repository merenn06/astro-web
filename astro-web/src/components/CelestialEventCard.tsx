'use client';

import React, { useState } from 'react';
import { CelestialEvent, getEventIcon, getEventColor, EVENT_PRIORITY } from '../lib/celestialEvents';

interface CelestialEventCardProps {
  event: CelestialEvent;
  isPrimary?: boolean;
  showTooltip?: boolean;
  compact?: boolean;
}

export default function CelestialEventCard({ 
  event, 
  isPrimary = false, 
  showTooltip = true,
  compact = false 
}: CelestialEventCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  const icon = getEventIcon(event);
  const color = getEventColor(event);
  const priority = EVENT_PRIORITY.indexOf(event.type);
  
  // Format date for display
  const formatDate = (utcDate: string) => {
    const date = new Date(utcDate);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Istanbul'
    });
  };
  
  // Get reliability indicator
  const getReliabilityIndicator = () => {
    switch (event.reliability) {
      case 'high': return '🟢';
      case 'medium': return '🟡';
      case 'low': return '🔴';
      default: return '⚪';
    }
  };
  
  // Get source indicator
  const getSourceIndicator = () => {
    switch (event.source) {
      case 'nasa': return '🚀';
      case 'imo': return '⭐';
      case 'ephemeris': return '📐';
      case 'calculated': return '🧮';
      default: return '📅';
    }
  };
  
  // Generate tooltip content
  const getTooltipContent = () => {
    let content = `${event.labelTR}\n`;
    content += `📅 ${formatDate(event.startUTC)}\n`;
    content += `🎯 Kaynak: ${event.source.toUpperCase()}\n`;
    content += `📊 Güvenilirlik: ${event.reliability}\n`;
    
    // Add type-specific information
    switch (event.type) {
      case 'eclipse':
        if (event.meta.visibility) {
          const visibility = event.meta.visibility.turkey ? 'Evet' : 'Hayır';
          content += `👁️ TR'den görülebilir: ${visibility}\n`;
        }
        break;
        
      case 'meteor_shower':
        if (event.meta.zhr) {
          content += `⭐ Saatlik meteor sayısı: ${event.meta.zhr}\n`;
        }
        if (event.meta.peakWindow) {
          content += `⏰ Zirve: ${event.meta.peakWindow}\n`;
        }
        break;
        
      case 'planet_station':
        if (event.meta.planet && event.meta.stationType) {
          const direction = event.meta.stationType === 'retrograde_start' ? 'geriye' : 'ileriye';
          content += `🔄 Hareket: ${direction}\n`;
        }
        break;
    }
    
    return content;
  };
  
  if (compact) {
    return (
      <div 
        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${isPrimary ? 'bg-opacity-20' : 'bg-opacity-10'}`}
        style={{ backgroundColor: color }}
        title={showTooltip ? getTooltipContent() : undefined}
      >
        <span>{icon}</span>
        <span className="truncate max-w-20">{event.labelTR}</span>
      </div>
    );
  }
  
  return (
    <div 
      className={`relative p-3 rounded-lg border-l-4 transition-all duration-200 hover:shadow-md ${
        isPrimary ? 'bg-white shadow-sm' : 'bg-gray-50'
      }`}
      style={{ borderLeftColor: color }}
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <div>
            <h3 className={`font-medium ${isPrimary ? 'text-gray-900' : 'text-gray-700'}`}>
              {event.labelTR}
            </h3>
            <p className="text-sm text-gray-500">
              {formatDate(event.startUTC)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          {getSourceIndicator()}
          {getReliabilityIndicator()}
        </div>
      </div>
      
      {showDetails && (
        <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-600">
          <div className="whitespace-pre-line">
            {getTooltipContent()}
          </div>
        </div>
      )}
    </div>
  );
}

// Component for handling multiple events on same day
interface MultipleEventsCardProps {
  events: CelestialEvent[];
  date: Date;
}

export function MultipleEventsCard({ events, date }: MultipleEventsCardProps) {
  // Sort events by priority
  const sortedEvents = [...events].sort((a, b) => {
    const aPriority = EVENT_PRIORITY.indexOf(a.type);
    const bPriority = EVENT_PRIORITY.indexOf(b.type);
    return aPriority - bPriority;
  });
  
  const primaryEvent = sortedEvents[0];
  const secondaryEvents = sortedEvents.slice(1);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };
  
  return (
    <div className="space-y-2">
      {/* Primary Event */}
      <CelestialEventCard 
        event={primaryEvent} 
        isPrimary={true}
        showTooltip={true}
      />
      
      {/* Secondary Events */}
      {secondaryEvents.length > 0 && (
        <div className="ml-4 space-y-1">
          <div className="text-xs text-gray-500 font-medium">
            Diğer olaylar:
          </div>
          {secondaryEvents.map((event) => (
            <CelestialEventCard 
              key={event.id}
              event={event} 
              isPrimary={false}
              showTooltip={true}
              compact={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
