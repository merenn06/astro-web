'use client';
import { motion } from 'framer-motion';
import { Moon, Sun, RefreshCw, Eclipse, Star, Calendar } from 'lucide-react';

type Event = {
  id: number;
  title: string;
  date: string;
  type: string;
  description: string;
};

type EventCardProps = {
  event: Event;
  onClick?: () => void;
};

const EVENT_TYPES = [
  { key: 'yeniay', label: 'Yeniay', icon: Sun, color: 'text-yellow-500' },
  { key: 'dolunay', label: 'Dolunay', icon: Moon, color: 'text-primary' },
  { key: 'retro', label: 'Retro', icon: RefreshCw, color: 'text-blue-500' },
  { key: 'tutulma', label: 'Tutulma', icon: Eclipse, color: 'text-gray-600 dark:text-gray-300' },
];

const EVENT_ICONS: Record<string, any> = {
  dolunay: Moon,
  yeniay: Sun,
  retro: RefreshCw,
  tutulma: Eclipse,
  ritual: Star,
  default: Calendar,
};

function getEventIcon(type: string) {
  const IconComponent = EVENT_ICONS[type.toLowerCase()] || EVENT_ICONS.default;
  return <IconComponent className="w-6 h-6" />;
}

function getEventColor(type: string) {
  const eventType = EVENT_TYPES.find(t => t.key === type.toLowerCase());
  return eventType?.color || 'text-gray-500';
}

export default function EventCard({ event, onClick }: EventCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300 }}
      onClick={onClick}
      className="cursor-pointer select-none animate-fadein"
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg ring-1 ring-primary/20 dark:ring-primary/30 p-6 hover:shadow-xl transition-all duration-300 group">
        {/* Event Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className={`p-3 rounded-xl bg-primary/10 ${getEventColor(event.type)}`}>
            {getEventIcon(event.type)}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
              {event.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(event.date).toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                weekday: 'long'
              })}
            </p>
          </div>
        </div>

        {/* Event Description */}
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          {event.description}
        </p>

        {/* Event Type Badge */}
        <div className="flex justify-between items-center">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 ${getEventColor(event.type)}`}>
            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
          </span>
        </div>
      </div>
    </motion.div>
  );
} 