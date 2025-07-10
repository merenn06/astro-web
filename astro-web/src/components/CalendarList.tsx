'use client';
import { useState } from 'react';
import { Moon, Sun, RefreshCw, Eclipse, Star, Calendar, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EventCard from './EventCard';
import EventModal from './EventModal';

type Event = {
  id: number;
  title: string;
  date: string;
  type: string;
  description: string;
};

type CalendarListProps = {
  events: { [key: string]: Event[] };
};

const EVENT_TYPES = [
  { key: 'yeniay', label: 'Yeniay', icon: Sun, color: 'text-yellow-500' },
  { key: 'dolunay', label: 'Dolunay', icon: Moon, color: 'text-primary' },
  { key: 'retro', label: 'Retro', icon: RefreshCw, color: 'text-blue-500' },
  { key: 'tutulma', label: 'Tutulma', icon: Eclipse, color: 'text-gray-600 dark:text-gray-300' },
];

export default function CalendarList({ events }: CalendarListProps) {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);

  const toggleFilter = (filterKey: string) => {
    setActiveFilters(prev => 
      prev.includes(filterKey) 
        ? prev.filter(f => f !== filterKey)
        : [...prev, filterKey]
    );
  };

  const filteredEvents = Object.entries(events).reduce((acc, [month, monthEvents]) => {
    const filtered = monthEvents.filter(event => 
      activeFilters.length === 0 || activeFilters.includes(event.type.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[month] = filtered;
    }
    return acc;
  }, {} as { [key: string]: Event[] });

  const hasEvents = Object.keys(filteredEvents).length > 0;

  return (
    <div className="space-y-8">
      {/* Filter Chips */}
      <div className="flex flex-wrap gap-3 justify-center">
        {EVENT_TYPES.map(({ key, label, icon: Icon, color }) => (
          <button
            key={key}
            onClick={() => toggleFilter(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-200 font-medium ${
              activeFilters.includes(key)
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary/50 hover:text-primary'
            }`}
          >
            <Icon className={`w-4 h-4 ${color}`} />
            {label}
          </button>
        ))}
      </div>

      {/* Events List */}
      {hasEvents ? (
        <div className="space-y-12">
          {Object.entries(filteredEvents).map(([month, monthEvents]) => (
            <div key={month} className="animate-fadein">
              <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-8 text-center">
                {month}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {monthEvents.map((event, idx) => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onClick={() => setActiveEvent(event)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* No Events State */
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4 py-20 text-primary"
        >
          <Search className="w-16 h-16" />
          <p className="text-xl font-medium">Yakında yeni etkinlikler eklenecek ✨</p>
        </motion.div>
      )}

      {/* Event Modal */}
      <AnimatePresence>
        {activeEvent && (
          <EventModal 
            event={activeEvent} 
            onClose={() => setActiveEvent(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
} 