import { prisma } from '@/lib/prisma';
import { ReelGrid } from '@/components/ReelGrid';

export default async function Page() {
  const reels = await prisma.reel.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 py-12 px-4">
      <h1 className="text-4xl font-bold text-center text-purple-800 dark:text-purple-200 mb-10">Reels</h1>
      {reels.length > 0 ? (
        <ReelGrid reels={reels} />
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400">Hiç reel bulunamadı.</div>
      )}
    </div>
  );
} 