'use client';

import { Play, Calendar } from 'lucide-react';
import Image from 'next/image';

interface ReelCardProps {
  title: string;
  thumbnail: string;
  publishedAt: string | Date;
  calendarUrl?: string;
  onClick: () => void;
}

export function ReelCard({ title, thumbnail, publishedAt, calendarUrl, onClick }: ReelCardProps) {
  return (
    <div 
      className="group relative bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[9/16] overflow-hidden">
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-colors flex items-center justify-center">
          <div className="bg-white bg-opacity-90 rounded-full p-3 group-hover:scale-110 transition-transform">
            <Play className="w-6 h-6 text-purple-600 fill-current" />
          </div>
        </div>

        {/* Calendar Badge */}
        {calendarUrl && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded-full">
            <Calendar className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
          {title}
        </h3>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>
            {new Date(publishedAt).toLocaleDateString('tr-TR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </span>
          {calendarUrl && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
              Takvim
            </span>
          )}
        </div>
      </div>
    </div>
  );
} 