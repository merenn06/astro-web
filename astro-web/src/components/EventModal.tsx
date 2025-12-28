'use client';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

type Event = {
  id: number;
  title: string;
  date: string;
  type: string;
  description: string;
};

type EventModalProps = {
  event: Event;
  onClose: () => void;
};

export default function EventModal({ event, onClose }: EventModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        className="bg-white dark:bg-gray-900 rounded-2xl p-8 w-11/12 max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="ml-auto mb-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors" 
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          {event.title}
        </h3>
        <p className="text-sm text-primary mb-4">
          {new Date(event.date).toLocaleDateString('tr-TR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </p>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {event.description}
        </p>
      </motion.div>
    </motion.div>
  );
} 