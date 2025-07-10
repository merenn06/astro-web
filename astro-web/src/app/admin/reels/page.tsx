'use client';

import { useState, useEffect } from 'react';
import { Plus, Upload, X, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

interface Reel {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnail: string;
  publishedAt: string;
  calendarUrl?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminReelsPage() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    calendarUrl: '',
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  useEffect(() => {
    fetchReels();
  }, []);

  async function fetchReels() {
    try {
      const response = await fetch('/api/admin/reels');
      if (response.ok) {
        const data = await response.json();
        setReels(data.items);
      }
    } catch (error) {
      console.error('Error fetching reels:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!videoFile || !formData.title) return;

    setUploading(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('calendarUrl', formData.calendarUrl);
    data.append('video', videoFile);
    if (thumbnailFile) {
      data.append('thumbnail', thumbnailFile);
    }

    try {
      const response = await fetch('/api/admin/reels', {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        setShowForm(false);
        setFormData({ title: '', description: '', calendarUrl: '' });
        setVideoFile(null);
        setThumbnailFile(null);
        fetchReels();
      } else {
        const error = await response.json();
        alert(error.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function handleToggleActive(id: string, isActive: boolean) {
    try {
      const response = await fetch(`/api/admin/reels/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        fetchReels();
      }
    } catch (error) {
      console.error('Error updating reel:', error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu reel\'i silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch(`/api/admin/reels/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchReels();
      }
    } catch (error) {
      console.error('Error deleting reel:', error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-32 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reels Yönetimi</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Yeni Reel
          </button>
        </div>

        {/* Upload Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Yeni Reel Yükle</h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Başlık *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Açıklama
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Video Dosyası * (MP4, max 30MB)
                    </label>
                    <input
                      type="file"
                      required
                      accept="video/mp4"
                      onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thumbnail (Opsiyonel)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Takvim URL (Opsiyonel)
                    </label>
                    <input
                      type="url"
                      value={formData.calendarUrl}
                      onChange={(e) => setFormData({ ...formData, calendarUrl: e.target.value })}
                      placeholder="https://calendar.google.com/..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={uploading}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Yükleniyor...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          Yükle
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      İptal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Reels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {reels.map((reel) => (
            <div key={reel.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <img
                  src={reel.thumbnail}
                  alt={reel.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    onClick={() => handleToggleActive(reel.id, reel.isActive)}
                    className={`p-1 rounded-full ${
                      reel.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                    }`}
                  >
                    {reel.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDelete(reel.id)}
                    className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {reel.title}
                </h3>
                {reel.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {reel.description}
                  </p>
                )}
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>
                    {new Date(reel.publishedAt).toLocaleDateString('tr-TR')}
                  </span>
                  {reel.calendarUrl && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Takvim
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {reels.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Upload className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Henüz reel yok
            </h3>
            <p className="text-gray-500 mb-4">
              İlk reel'inizi yükleyerek başlayın
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
            >
              İlk Reel'i Yükle
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 