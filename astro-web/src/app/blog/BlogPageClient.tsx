'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Calendar, Clock } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: string;
  createdAt: string;
}

export default function BlogPageClient() {
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async (pageNum: number, append = false) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/posts?page=${pageNum}&limit=10`);
      if (!response.ok) throw new Error('Yazılar alınamadı');
      
      const data = await response.json();
      const totalCount = parseInt(response.headers.get('X-Total-Count') || '0');
      
      if (append) {
        setPosts(prev => [...prev, ...data.posts]);
      } else {
        setPosts(data.posts);
      }
      
      setTotal(totalCount);
      setHasMore(pageNum * 10 < totalCount);
    } catch (error) {
      console.error('Blog posts fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    setPage(currentPage);
    fetchPosts(currentPage);
  }, [searchParams]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage, true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading && posts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Astroloji ve kişisel gelişim yazıları. Burç yorumları, astroloji rehberleri ve daha fazlası.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Henüz yazı yok</p>
        </div>
      ) : (
        <>
          {/* Desktop Grid */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-8 mb-8">
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                {post.coverImage && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(post.publishedAt)}
                  </div>
                  <h2 className="text-xl font-semibold mb-3 line-clamp-2">
                    <Link href={`/blog/${post.slug}`} className="hover:text-purple-600 transition-colors">
                      {post.title}
                    </Link>
                  </h2>
                  {post.excerpt && (
                    <p className="text-gray-600 line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                  )}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Devamını Oku →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Tablet Grid */}
          <div className="hidden md:grid lg:hidden md:grid-cols-2 gap-6 mb-8">
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                {post.coverImage && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(post.publishedAt)}
                  </div>
                  <h2 className="text-xl font-semibold mb-3 line-clamp-2">
                    <Link href={`/blog/${post.slug}`} className="hover:text-purple-600 transition-colors">
                      {post.title}
                    </Link>
                  </h2>
                  {post.excerpt && (
                    <p className="text-gray-600 line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                  )}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Devamını Oku →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Mobile List */}
          <div className="md:hidden space-y-6 mb-8">
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                {post.coverImage && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(post.publishedAt)}
                  </div>
                  <h2 className="text-lg font-semibold mb-2">
                    <Link href={`/blog/${post.slug}`} className="hover:text-purple-600 transition-colors">
                      {post.title}
                    </Link>
                  </h2>
                  {post.excerpt && (
                    <p className="text-gray-600 line-clamp-3 mb-3 text-sm">
                      {post.excerpt}
                    </p>
                  )}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                  >
                    Devamını Oku →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center">
            {total > 10 && (
              <div className="flex gap-2">
                <Link
                  href={`/blog?page=${Math.max(1, page - 1)}`}
                  className={`px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 ${
                    page === 1 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Önceki
                </Link>
                <span className="px-4 py-2 text-gray-700">
                  Sayfa {page} / {Math.ceil(total / 10)}
                </span>
                <Link
                  href={`/blog?page=${Math.min(Math.ceil(total / 10), page + 1)}`}
                  className={`px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 ${
                    page >= Math.ceil(total / 10) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Sonraki
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Infinite Scroll */}
          <div className="md:hidden mt-8">
            {hasMore && (
              <button
                onClick={loadMore}
                disabled={loading}
                className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {loading ? 'Yükleniyor...' : 'Daha Fazla Yükle'}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
} 