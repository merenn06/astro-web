'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  embedUrl?: string;
  embedHtml?: string;
  title?: string;
}

export function VideoModal({ isOpen, onClose, videoUrl, embedUrl, embedHtml, title }: VideoModalProps) {
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
            <div className="w-full h-full flex flex-col items-center justify-center">
              {title && <div className="text-white text-lg font-semibold mb-2 text-center px-2 truncate w-full">{title}</div>}
              {embedHtml ? (
                <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: embedHtml }} />
              ) : embedUrl ? (
                <iframe
                  src={embedUrl}
                  className="w-full h-full min-h-[200px] rounded"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title={title || 'Reel'}
                />
              ) : videoUrl ? (
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full min-h-[200px] rounded"
                  style={{ background: 'black' }}
                />
              ) : (
                <div className="text-white">Video bulunamadı.</div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 