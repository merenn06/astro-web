'use client';
import { useEffect, useState, ChangeEvent, FormEvent } from 'react';

type Reel = {
  id: number;
  title: string;
  thumbnail: string;
  embedUrl?: string;
  embedHtml?: string;
  videoUrl?: string;
  createdAt: string | Date;
};

const initialForm = {
  title: '',
  thumbnail: '',
  reelType: 'embed',
  urlOrHtml: '',
};

function getTypeLabel(reel: Reel) {
  if (reel.embedUrl) return 'Embed';
  if (reel.embedHtml) return 'HTML';
  if (reel.videoUrl) return 'Video';
  return '-';
}

export default function AdminReelsPage() {
  const [form, setForm] = useState(initialForm);
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function fetchReels() {
    const res = await fetch('/api/admin/reels');
    const data = await res.json();
    setReels(data);
  }

  useEffect(() => {
    fetchReels();
  }, []);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    if (!form.title || !form.thumbnail || !form.urlOrHtml) {
      setError('Tüm alanları doldurun.');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/admin/reels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setForm(initialForm);
        setSuccess('Reel eklendi!');
        fetchReels();
      } else {
        setError('Kayıt başarısız.');
      }
    } catch {
      setError('Sunucu hatası.');
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(''), 2000);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Bu reeli silmek istediğinize emin misiniz?')) return;
    const res = await fetch(`/api/admin/reels?id=${id}`, { method: 'DELETE' });
    if (res.ok) fetchReels();
    else alert('Silme işlemi başarısız oldu.');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 py-12 px-4">
      <h1 className="text-3xl font-bold text-center text-purple-800 dark:text-purple-200 mb-10">Reels Yönetimi</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 flex flex-col gap-6 border border-purple-100 dark:border-purple-900">
          <h2 className="text-xl font-bold mb-2">Yeni Reel Ekle</h2>
          {error && <div className="bg-red-100 text-red-800 p-2 rounded">{error}</div>}
          {success && <div className="bg-green-100 text-green-800 p-2 rounded">{success}</div>}
          <div>
            <label className="block mb-1 font-medium">Başlık</label>
            <input name="title" value={form.title} onChange={handleChange} className="w-full p-2 rounded border border-purple-200 dark:border-purple-700 bg-white dark:bg-gray-800" required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Kapak Görseli (URL)</label>
            <input name="thumbnail" value={form.thumbnail} onChange={handleChange} className="w-full p-2 rounded border border-purple-200 dark:border-purple-700 bg-white dark:bg-gray-800" required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Reel Tipi</label>
            <div className="flex gap-4 mt-1">
              <label className="flex items-center gap-2">
                <input type="radio" name="reelType" value="embed" checked={form.reelType === 'embed'} onChange={handleChange} />
                <span>Embed (YouTube)</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="reelType" value="html" checked={form.reelType === 'html'} onChange={handleChange} />
                <span>HTML (Instagram)</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="reelType" value="video" checked={form.reelType === 'video'} onChange={handleChange} />
                <span>Video (MP4)</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium">
              {form.reelType === 'embed' && 'Embed URL (YouTube)'}
              {form.reelType === 'html' && 'Embed HTML (Instagram iframe)'}
              {form.reelType === 'video' && 'Video URL (MP4)'}
            </label>
            <textarea name="urlOrHtml" value={form.urlOrHtml} onChange={handleChange} className="w-full p-2 rounded border border-purple-200 dark:border-purple-700 bg-white dark:bg-gray-800" rows={form.reelType === 'html' ? 4 : 2} required />
          </div>
          <button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl shadow transition-all disabled:opacity-60">
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </form>
        {/* Table/List */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 border border-purple-100 dark:border-purple-900 overflow-x-auto">
          <h2 className="text-xl font-bold mb-4">Reel Listesi</h2>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-purple-50 dark:bg-purple-950">
                <th className="p-2 border-b">Başlık</th>
                <th className="p-2 border-b">Tarih</th>
                <th className="p-2 border-b">Tip</th>
                <th className="p-2 border-b">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {reels.map((reel, i) => (
                <tr key={reel.id} className={i % 2 === 1 ? 'odd:bg-gray-50 dark:odd:bg-gray-800' : ''}>
                  <td className="p-2 border-b font-medium max-w-xs truncate">{reel.title}</td>
                  <td className="p-2 border-b">{new Date(reel.createdAt).toLocaleDateString('tr-TR')}</td>
                  <td className="p-2 border-b">{getTypeLabel(reel)}</td>
                  <td className="p-2 border-b">
                    <button onClick={() => handleDelete(reel.id)} className="text-red-600 hover:underline font-semibold">Sil</button>
                  </td>
                </tr>
              ))}
              {reels.length === 0 && (
                <tr><td colSpan={4} className="text-center text-gray-500 py-8">Hiç reel yok.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 