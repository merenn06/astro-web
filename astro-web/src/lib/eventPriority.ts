// Event Priority System for UX Rules
export interface EventPriority {
  type: string;
  priority: number;
  displayOrder: number;
}

// Priority order for conflicts (lower number = higher priority)
export const EVENT_PRIORITIES: Record<string, EventPriority> = {
  'eclipse': { type: 'eclipse', priority: 1, displayOrder: 1 },
  'moon_phase': { type: 'moon_phase', priority: 2, displayOrder: 2 },
  'planet_station': { type: 'planet_station', priority: 3, displayOrder: 3 },
  'meteor_shower': { type: 'meteor_shower', priority: 4, displayOrder: 4 },
  'sun_ingress': { type: 'sun_ingress', priority: 5, displayOrder: 5 },
  'sun_aspect': { type: 'sun_aspect', priority: 6, displayOrder: 6 },
  'lilith_ingress': { type: 'lilith_ingress', priority: 7, displayOrder: 7 }
};

// Get priority for event type
export function getEventPriority(eventType: string): EventPriority {
  return EVENT_PRIORITIES[eventType] || { type: eventType, priority: 999, displayOrder: 999 };
}

// Sort events by priority
export function sortEventsByPriority(events: any[]): any[] {
  return events.sort((a, b) => {
    const priorityA = getEventPriority(a.type);
    const priorityB = getEventPriority(b.type);
    
    if (priorityA.priority !== priorityB.priority) {
      return priorityA.priority - priorityB.priority;
    }
    
    // If same priority, sort by time
    return new Date(a.startUTC || a.date).getTime() - new Date(b.startUTC || b.date).getTime();
  });
}

// Group events by date and apply priority rules
export function groupEventsByDate(events: any[]): Map<string, any[]> {
  const grouped = new Map<string, any[]>();
  
  events.forEach(event => {
    const date = new Date(event.startUTC || event.date);
    const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
    
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    grouped.get(dateKey)!.push(event);
  });
  
  // Sort events within each day by priority
  grouped.forEach((dayEvents, dateKey) => {
    grouped.set(dateKey, sortEventsByPriority(dayEvents));
  });
  
  return grouped;
}

// Get primary event for a day (highest priority)
export function getPrimaryEvent(dayEvents: any[]): any | null {
  if (dayEvents.length === 0) return null;
  
  const sortedEvents = sortEventsByPriority(dayEvents);
  return sortedEvents[0];
}

// Get secondary events for a day (lower priority, shown as badges)
export function getSecondaryEvents(dayEvents: any[]): any[] {
  if (dayEvents.length <= 1) return [];
  
  const sortedEvents = sortEventsByPriority(dayEvents);
  return sortedEvents.slice(1);
}

// Format date for display (tr-TR locale)
export function formatDateForDisplay(date: Date): string {
  return date.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'short',
    timeZone: 'Europe/Istanbul'
  });
}

// Format time for display (tr-TR locale)
export function formatTimeForDisplay(date: Date): string {
  return date.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Istanbul'
  });
}

// Check if event is today
export function isToday(date: Date): boolean {
  const today = new Date();
  const todayStr = today.toLocaleDateString('tr-TR', { timeZone: 'Europe/Istanbul' });
  const eventStr = date.toLocaleDateString('tr-TR', { timeZone: 'Europe/Istanbul' });
  return todayStr === eventStr;
}

// Check if event is in the past
export function isPast(date: Date): boolean {
  const now = new Date();
  return date.getTime() < now.getTime();
}

// Check if event is in the future
export function isFuture(date: Date): boolean {
  const now = new Date();
  return date.getTime() > now.getTime();
}

// Get event display color based on type and status
export function getEventDisplayColor(event: any): string {
  const colors = {
    'eclipse': '#DC2626', // Red
    'moon_phase': {
      'new': '#374151', // Gray
      'first': '#6B7280', // Gray
      'full': '#F59E0B', // Amber
      'last': '#6B7280' // Gray
    },
    'planet_station': '#7C3AED', // Purple
    'meteor_shower': '#7C3AED', // Purple
    'sun_ingress': '#F59E0B', // Amber
    'sun_aspect': '#6B7280', // Gray
    'lilith_ingress': '#6B7280' // Gray
  };
  
  if (event.type === 'moon_phase' && colors.moon_phase[event.subType]) {
    return colors.moon_phase[event.subType];
  }
  
  return colors[event.type] || '#6B7280';
}

// Get event display icon based on type and subtype
export function getEventDisplayIcon(event: any): string {
  const icons = {
    'eclipse': '🌑',
    'moon_phase': {
      'new': '🌑',
      'first': '🌓',
      'full': '🌕',
      'last': '🌗'
    },
    'planet_station': '🔄',
    'meteor_shower': '⭐',
    'sun_ingress': '☀️',
    'sun_aspect': '☀️',
    'lilith_ingress': '🌙'
  };
  
  if (event.type === 'moon_phase' && icons.moon_phase[event.subType]) {
    return icons.moon_phase[event.subType];
  }
  
  return icons[event.type] || '✨';
}
