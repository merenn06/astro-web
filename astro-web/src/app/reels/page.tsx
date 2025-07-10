import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { ReelGrid } from '@/components/ReelGrid';

export const metadata: Metadata = {
  title: 'Astroloji Reels - Kısa Videolar',
  description: 'Astroloji ile ilgili kısa videolar, günlük yorumlar ve ritüeller',
  openGraph: {
    title: 'Astroloji Reels - Kısa Videolar',
    description: 'Astroloji ile ilgili kısa videolar, günlük yorumlar ve ritüeller',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Astroloji Reels - Kısa Videolar',
    description: 'Astroloji ile ilgili kısa videolar, günlük yorumlar ve ritüeller',
  },
};

export default async function ReelsPage() {
  const reels = await prisma.reel.findMany({
    where: {
      isActive: true,
    },
    orderBy: [
      { order: 'asc' },
      { publishedAt: 'desc' },
    ],
    take: 12,
    select: {
      id: true,
      title: true,
      description: true,
      videoUrl: true,
      thumbnail: true,
      publishedAt: true,
      calendarUrl: true,
      isActive: true,
      order: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Astroloji Reels
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Gökyüzünün sırlarını kısa videolarla keşfedin. Günlük yorumlar, 
            ritüeller ve astroloji ipuçları.
          </p>
        </div>
        
        <ReelGrid reels={reels} />
      </div>
    </div>
  );
} 