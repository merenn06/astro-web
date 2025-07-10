'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, ExternalLink } from 'lucide-react';
import ReactPlayer from 'react-player';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  title?: string;
  description?: string;
  calendarUrl?: string;
}

export function VideoModal({ isOpen, onClose, videoUrl, title, description, calendarUrl }: VideoModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black bg-opacity-80"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-2xl aspect-video bg-black rounded-2xl overflow-hidden flex flex-col shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-2 right-2 z-10 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="w-full h-full flex flex-col">
              {/* Header */}
              <div className="p-4 bg-gradient-to-r from-purple-900 to-blue-900 text-white">
                {title && <h2 className="text-xl font-semibold mb-2">{title}</h2>}
                {description && <p className="text-sm text-gray-200 mb-3">{description}</p>}
                {calendarUrl && (
                  <a
                    href={calendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-1 rounded-full text-sm transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    Takvime Ekle
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              
              {/* Video Player */}
              <div className="flex-1 bg-black">
                {videoUrl ? (
                  <video
                    src={videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full"
                    style={{ background: 'black' }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    Video bulunamadı.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 