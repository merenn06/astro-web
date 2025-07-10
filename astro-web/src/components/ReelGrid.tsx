'use client';
import { useState } from 'react';
import { ReelCard } from './ReelCard';
import { VideoModal } from './VideoModal';

export interface Reel {
  id: string;
  title: string;
  description?: string;
  thumbnail: string;
  videoUrl: string;
  publishedAt: string | Date;
  calendarUrl?: string;
  isActive: boolean;
  order: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export function ReelGrid({ reels }: { reels: Reel[] }) {
  const [modal, setModal] = useState<Reel | null>(null);
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {reels.map((reel) => (
          <ReelCard
            key={reel.id}
            title={reel.title}
            thumbnail={reel.thumbnail}
            publishedAt={reel.publishedAt}
            calendarUrl={reel.calendarUrl}
            onClick={() => setModal(reel)}
          />
        ))}
      </div>
      <VideoModal
        isOpen={!!modal}
        onClose={() => setModal(null)}
        videoUrl={modal?.videoUrl}
        title={modal?.title}
        description={modal?.description}
        calendarUrl={modal?.calendarUrl}
      />
    </>
  );
} 