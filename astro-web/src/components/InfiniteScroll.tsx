'use client';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface InfiniteScrollProps {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export default function InfiniteScroll({ 
  hasNextPage, 
  isFetchingNextPage, 
  fetchNextPage 
}: InfiniteScrollProps) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: '100px',
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (!hasNextPage) return null;

  return (
    <div ref={ref} className="flex justify-center py-8">
      {isFetchingNextPage ? (
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Yükleniyor...</span>
        </div>
      ) : (
        <div className="h-8" /> // Invisible trigger element
      )}
    </div>
  );
} 