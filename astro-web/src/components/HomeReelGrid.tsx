'use client';
import { ReelCard } from './ReelCard';

export default function HomeReelGrid({ reels }: { reels: any[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {reels.map(reel => (
        <div key={reel.id} className="animate-fadein">
          <ReelCard
            title={reel.title}
            thumbnail={reel.thumbnail}
            createdAt={reel.createdAt}
            onClick={() => {}}
          />
        </div>
      ))}
    </div>
  );
} 