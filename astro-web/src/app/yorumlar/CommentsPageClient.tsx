'use client';
import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider, useQuery, useInfiniteQuery } from '@tanstack/react-query';
import CommentForm from '@/components/CommentForm';
import CommentCard from '@/components/CommentCard';
import Pagination from '@/components/Pagination';
import InfiniteScroll from '@/components/InfiniteScroll';

const PAGE_SIZE = 12;

type Comment = {
  id: number;
  name: string;
  email: string;
  content: string;
  isApproved: boolean;
  isHighlighted: boolean;
  createdAt: string;
};

type CommentsResponse = {
  comments: Comment[];
  total: number;
};

function CommentsPageClientContent() {
  const [isMobile, setIsMobile] = useState(false);
  const [page, setPage] = useState(1);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Desktop: Regular pagination
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['comments', page],
    queryFn: async () => {
      const res = await fetch(`/api/comments?status=approved&page=${page}&limit=${PAGE_SIZE}`);
      if (!res.ok) throw new Error('Yorumlar alınamadı');
      return res.json();
    },
    select: (data): CommentsResponse => data as CommentsResponse,
    enabled: !isMobile,
  });

  // Mobile: Infinite scroll
  const {
    data: infiniteData,
    isLoading: infiniteLoading,
    error: infiniteError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['comments-infinite'],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const res = await fetch(`/api/comments?status=approved&page=${pageParam}&limit=${PAGE_SIZE}`);
      if (!res.ok) throw new Error('Yorumlar alınamadı');
      return res.json() as Promise<CommentsResponse>;
    },
    getNextPageParam: (lastPage: CommentsResponse, allPages) => {
      const totalPages = Math.ceil(lastPage.total / PAGE_SIZE);
      return allPages.length < totalPages ? allPages.length + 1 : undefined;
    },
    enabled: isMobile,
  });

  const comments = isMobile 
    ? infiniteData?.pages.flatMap(page => page.comments) || []
    : data?.comments || [];
  
  const total = isMobile 
    ? infiniteData?.pages[0]?.total || 0
    : data?.total || 0;
  
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const isLoadingData = isMobile ? infiniteLoading : isLoading;
  const errorData = isMobile ? infiniteError : error;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Danışan Yorumları</h1>
        <span className="inline-block bg-purple-100 text-purple-700 text-sm font-semibold px-3 py-1 rounded-full">{total}</span>
      </div>
      
      {/* Yorumlar Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {isLoadingData ? (
          <div className="col-span-full text-center py-10 text-gray-400">Yükleniyor...</div>
        ) : errorData ? (
          <div className="col-span-full text-center py-10 text-red-500">Hata: {errorData.message}</div>
        ) : comments.length === 0 ? (
          <div className="col-span-full text-center py-10 text-gray-400">Henüz yorum yok.</div>
        ) : (
          comments.map((comment: Comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))
        )}
      </div>

      {/* Desktop Pagination */}
      {!isMobile && totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          baseUrl="/yorumlar"
        />
      )}

      {/* Mobile Infinite Scroll */}
      {isMobile && (
        <InfiniteScroll
          hasNextPage={hasNextPage || false}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      )}

      {/* Yorum Gönderme Formu */}
      <CommentForm onSuccess={refetch} />
    </div>
  );
}

export default function CommentsPageClient() {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <CommentsPageClientContent />
    </QueryClientProvider>
  );
} 