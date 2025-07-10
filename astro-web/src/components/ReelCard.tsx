'use client';
import { Play } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface ReelCardProps {
  title: string;
  thumbnail: string;
  createdAt: string | Date;
  onClick: () => void;
}

export function ReelCard({ title, thumbnail, createdAt, onClick }: ReelCardProps) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-xl cursor-pointer group transition-transform hover:scale-105 bg-white dark:bg-gray-900 border border-purple-100 dark:border-purple-900"
      onClick={onClick}
    >
      <img
        src={thumbnail}
        alt={title}
        className="w-full h-64 object-cover group-hover:brightness-75 transition-all aspect-[2/3]"
        loading="lazy"
      />
      <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
        <div className="flex items-center gap-2 mb-2">
          <Play className="w-7 h-7 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" />
          <span className="text-white font-semibold text-lg drop-shadow-lg truncate max-w-[70%]">{title}</span>
        </div>
        <span className="text-sm text-gray-200 drop-shadow-lg">
          {format(new Date(createdAt), 'd MMMM yyyy', { locale: tr })}
        </span>
      </div>
    </div>
  );
} 