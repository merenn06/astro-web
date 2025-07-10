'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  category: 'MONTHLY' | 'RETRO' | 'TIP';
  createdAt: string;
  updatedAt: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        ...(searchQuery && { query: searchQuery }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(categoryFilter !== 'all' && { category: categoryFilter }),
      });

      const response = await fetch(`/api/admin/posts?${params}`);
      if (!response.ok) throw new Error('Yazılar alınamadı');
      
      const data = await response.json();
      setPosts(data.posts);
      setTotal(data.total);
    } catch (error) {
      toast.error('Yazılar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page, searchQuery, statusFilter, categoryFilter]);

  const handlePublishToggle = async (postId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !currentStatus }),
      });

      if (!response.ok) throw new Error('Güncelleme başarısız');
      
      toast.success(currentStatus ? 'Yazı taslağa alındı' : 'Yazı yayınlandı');
      fetchPosts();
    } catch (error) {
      toast.error('Güncelleme sırasında hata oluştu');
    }
  };

  const handleDelete = async (postId: string, title: string) => {
    if (!confirm(`"${title}" yazısını silmek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Silme başarısız');
      
      toast.success('Yazı silindi');
      fetchPosts();
    } catch (error) {
      toast.error('Silme sırasında hata oluştu');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryDisplay = (category: string) => {
    switch (category) {
      case 'MONTHLY':
        return { label: 'Aylık Yorum', color: 'bg-blue-100 text-blue-800' };
      case 'RETRO':
        return { label: 'Retro Rehberi', color: 'bg-purple-100 text-purple-800' };
      case 'TIP':
        return { label: 'Ritüel / İpucu', color: 'bg-green-100 text-green-800' };
      default:
        return { label: category, color: 'bg-gray-100 text-gray-800' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog Yönetimi</h1>
        <Link
          href="/admin/blog/new"
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Yeni Yazı
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Yazı ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">Tümü</option>
            <option value="published">Yayında</option>
            <option value="draft">Taslak</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">Tüm Kategoriler</option>
            <option value="MONTHLY">Aylık Yorum</option>
            <option value="RETRO">Retro Rehberi</option>
            <option value="TIP">Ritüel / İpucu</option>
          </select>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Yükleniyor...</div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Henüz yazı yok</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Başlık
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {post.title}
                        </div>
                        {post.excerpt && (
                          <div className="text-sm text-gray-500 line-clamp-2">
                            {post.excerpt}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryDisplay(post.category).color}`}
                      >
                        {getCategoryDisplay(post.category).label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          post.isPublished
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {post.isPublished ? 'Yayında' : 'Taslak'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {post.isPublished && post.publishedAt
                        ? formatDate(post.publishedAt)
                        : formatDate(post.updatedAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/blog/${post.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Düzenle"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handlePublishToggle(post.id, post.isPublished)}
                          className={`${
                            post.isPublished
                              ? 'text-yellow-600 hover:text-yellow-900'
                              : 'text-green-600 hover:text-green-900'
                          }`}
                          title={post.isPublished ? 'Taslağa al' : 'Yayınla'}
                        >
                          {post.isPublished ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(post.id, post.title)}
                          className="text-red-600 hover:text-red-900"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {total > 10 && (
        <div className="mt-6 flex justify-center">
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Önceki
            </button>
            <span className="px-3 py-2 text-gray-700">
              Sayfa {page} / {Math.ceil(total / 10)}
            </span>
            <button
              onClick={() => setPage(p => Math.min(Math.ceil(total / 10), p + 1))}
              disabled={page >= Math.ceil(total / 10)}
              className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Sonraki
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 