'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Eye, Upload, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import TipTapEditor from '@/components/TipTapEditor';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: any;
  coverImage: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function EditBlogPostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [post, setPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: { type: 'doc', content: [] },
    coverImage: '',
    isPublished: false,
  });
  const [hasChanges, setHasChanges] = useState(false);
  const autosaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/admin/posts/${params.id}`);
        if (!response.ok) {
          if (response.status === 404) {
            toast.error('Yazı bulunamadı');
            router.push('/admin/blog');
            return;
          }
          throw new Error('Yazı yüklenemedi');
        }

        const postData = await response.json();
        setPost(postData);
        setFormData({
          title: postData.title,
          excerpt: postData.excerpt || '',
          content: postData.content,
          coverImage: postData.coverImage || '',
          isPublished: postData.isPublished,
        });
      } catch (error) {
        toast.error('Yazı yüklenirken hata oluştu');
        router.push('/admin/blog');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.id, router]);

  // Autosave functionality
  const autosave = useCallback(async () => {
    if (!hasChanges || !formData.title.trim()) return;

    try {
      const response = await fetch(`/api/admin/posts/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Otomatik kaydetme başarısız');
      }

      const updatedPost = await response.json();
      setPost(updatedPost);
      setHasChanges(false);
      console.log('✅ Autosaved at', new Date().toLocaleTimeString());
    } catch (error) {
      console.error('❌ Autosave failed:', error);
    }
  }, [formData, params.id, hasChanges]);

  // Setup autosave timer
  useEffect(() => {
    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }

    if (hasChanges) {
      autosaveTimeoutRef.current = setTimeout(autosave, 2000); // 2 seconds
    }

    return () => {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }
    };
  }, [formData, autosave, hasChanges]);

  // Track changes
  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  const handleSave = useCallback(async (isPublish = false) => {
    if (!formData.title.trim()) {
      toast.error('Başlık zorunludur');
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`/api/admin/posts/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          isPublished: isPublish,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Yazı güncellenemedi');
      }

      const updatedPost = await response.json();
      setPost(updatedPost);
      setHasChanges(false);
      toast.success(isPublish ? 'Yazı yayınlandı!' : 'Yazı kaydedildi!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Bir hata oluştu');
    } finally {
      setSaving(false);
    }
  }, [formData, params.id]);

  const handleDelete = async () => {
    if (!post || !confirm(`"${post.title}" yazısını silmek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`/api/admin/posts/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Silme başarısız');

      toast.success('Yazı silindi');
      router.push('/admin/blog');
    } catch (error) {
      toast.error('Silme sırasında hata oluştu');
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Dosya boyutu 2MB\'dan küçük olmalıdır');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Sadece resim dosyaları yüklenebilir');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Yükleme başarısız');

      const { url } = await response.json();
      updateFormData({ coverImage: url });
      toast.success('Resim yüklendi');
    } catch (error) {
      toast.error('Resim yüklenirken hata oluştu');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">Yükleniyor...</div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/blog"
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Geri
          </Link>
          <h1 className="text-3xl font-bold">Yazı Düzenle</h1>
          {hasChanges && (
            <span className="text-sm text-orange-600 bg-orange-100 px-2 py-1 rounded">
              Kaydedilmemiş değişiklikler
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            disabled={saving}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Sil
          </button>
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Kaydet
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            {post.isPublished ? 'Güncelle' : 'Yayınla'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Başlık *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => updateFormData({ title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Yazı başlığı..."
            />
          </div>

          {/* Slug (readonly) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL (otomatik)
            </label>
            <input
              type="text"
              value={post.slug}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Özet (maksimum 200 karakter)
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => updateFormData({ excerpt: e.target.value })}
              maxLength={200}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Yazının kısa özeti..."
            />
            <div className="text-sm text-gray-500 mt-1">
              {formData.excerpt.length}/200 karakter
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kapak Görseli
            </label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Resim Yükle
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              {formData.coverImage && (
                <div className="relative">
                  <img
                    src={formData.coverImage}
                    alt="Kapak görseli"
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => updateFormData({ coverImage: '' })}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Content Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              İçerik *
            </label>
            <TipTapEditor
              content={formData.content}
              onChange={(content) => updateFormData({ content })}
              placeholder="Yazınızı buraya yazın..."
            />
          </div>

          {/* Status Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">
              <p><strong>Durum:</strong> {post.isPublished ? 'Yayında' : 'Taslak'}</p>
              <p><strong>Oluşturulma:</strong> {new Date(post.createdAt).toLocaleDateString('tr-TR')}</p>
              <p><strong>Son Güncelleme:</strong> {new Date(post.updatedAt).toLocaleDateString('tr-TR')}</p>
              {post.isPublished && post.publishedAt && (
                <p><strong>Yayın Tarihi:</strong> {new Date(post.publishedAt).toLocaleDateString('tr-TR')}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 