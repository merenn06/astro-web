'use client';
import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { BadgeCheck, BadgeX, Star, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import debounce from 'lodash.debounce';

// Helper: format date as dd.MM.yyyy HH:mm
function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'Hepsi' },
  { value: 'approved', label: 'Onaylı' },
  { value: 'unapproved', label: 'Onaysız' },
];

export default function AdminCommentsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState(searchParams.get('q') || '');
  const [status, setStatus] = useState(searchParams.get('status') || 'all');
  const [page, setPage] = useState(Number(searchParams.get('page') || 1));
  const [deleteId, setDeleteId] = useState<number|null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch comments
  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ q, status, page: String(page) });
      const res = await fetch(`/api/comments?${params}`);
      if (!res.ok) throw new Error('Yorumlar alınamadı');
      const data = await res.json();
      setComments(data.comments);
      setTotal(data.total);
    } catch (e: any) {
      toast.error(e.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }, [q, status, page]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  // Update URL query string
  useEffect(() => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (status !== 'all') params.set('status', status);
    if (page !== 1) params.set('page', String(page));
    router.replace(`?${params.toString()}`);
  }, [q, status, page, router]);

  // Debounced search
  const onSearch = debounce((val: string) => { setPage(1); setQ(val); }, 300);

  // Server actions
  const toggleApprove = async (id: number, isApproved: boolean) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/comments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: !isApproved }),
      });
      if (!res.ok) throw new Error('Onay güncellenemedi');
      fetchComments();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };
  const toggleHighlight = async (id: number, isHighlighted: boolean) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/comments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isHighlighted: !isHighlighted }),
      });
      if (!res.ok) throw new Error('Öne çıkarma güncellenemedi');
      fetchComments();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };
  const confirmDelete = (id: number) => { setDeleteId(id); setModalOpen(true); };
  const deleteComment = async () => {
    if (!deleteId) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/comments/${deleteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Silinemedi');
      setModalOpen(false);
      setDeleteId(null);
      fetchComments();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Pagination
  const totalPages = Math.ceil(total / 10);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Yorumlar</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="Ara (isim veya e-posta)"
          className="input input-bordered w-full md:w-64"
          defaultValue={q}
          onChange={e => onSearch(e.target.value)}
        />
        <select
          className="select select-bordered w-full md:w-40"
          value={status}
          onChange={e => { setPage(1); setStatus(e.target.value); }}
        >
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-0 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="p-3 text-left">Ad-Soyad</th>
              <th className="p-3 text-left">E-posta</th>
              <th className="p-3 text-left">Önizleme</th>
              <th className="p-3 text-left">Durum</th>
              <th className="p-3 text-center">Öne Çıkar</th>
              <th className="p-3 text-center">Tarih</th>
              <th className="p-3 text-center">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-10"><Loader2 className="animate-spin mx-auto" /></td></tr>
            ) : comments.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center text-gray-400 dark:text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <svg width="80" height="80" fill="none" viewBox="0 0 80 80"><circle cx="40" cy="40" r="38" stroke="#a78bfa" strokeWidth="4" fill="#f3f4f6" /><text x="50%" y="54%" textAnchor="middle" fill="#a78bfa" fontSize="32" fontWeight="bold" dy=".3em">💬</text></svg>
                    <div className="text-lg font-medium">Henüz yorum yok</div>
                  </div>
                </td>
              </tr>
            ) : comments.map((c) => (
              <tr key={c.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-purple-50/30 dark:hover:bg-purple-900/10 transition">
                <td className="p-3 font-semibold">{c.name}</td>
                <td className="p-3">{c.email}</td>
                <td className="p-3">{c.content.slice(0, 80)}{c.content.length > 80 ? '…' : ''}</td>
                <td className="p-3">
                  {c.isApproved ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold"><BadgeCheck className="w-4 h-4" /> Onaylı</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-200 text-gray-600 text-xs font-semibold"><BadgeX className="w-4 h-4" /> Onaysız</span>
                  )}
                </td>
                <td className="p-3 text-center">
                  <button
                    className={
                      'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ' +
                      (c.isHighlighted ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-200 text-gray-600')
                    }
                    onClick={() => toggleHighlight(c.id, c.isHighlighted)}
                  >
                    <Star className={c.isHighlighted ? 'w-4 h-4 fill-yellow-400' : 'w-4 h-4'} />
                    {c.isHighlighted ? 'Öne Çıkarıldı' : 'Çıkar'}
                  </button>
                </td>
                <td className="p-3 text-center">{formatDate(c.createdAt)}</td>
                <td className="p-3 text-center flex gap-2 justify-center">
                  <button
                    className={
                      'px-2 py-1 rounded text-xs font-semibold ' +
                      (c.isApproved ? 'bg-gray-200 text-gray-600' : 'bg-green-100 text-green-700')
                    }
                    onClick={() => toggleApprove(c.id, c.isApproved)}
                  >
                    {c.isApproved ? 'Onayı Kaldır' : 'Onayla'}
                  </button>
                  <button
                    className="px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-700"
                    onClick={() => confirmDelete(c.id)}
                  >
                    <Trash2 className="w-4 h-4 inline" /> Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i+1}
              className={
                'px-3 py-1 rounded ' +
                (page === i+1 ? 'bg-purple-600 text-white font-bold' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900')
              }
              onClick={() => setPage(i+1)}
            >
              {i+1}
            </button>
          ))}
        </div>
      )}
      {/* Delete Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 w-11/12 max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">Yorumu silmek istediğinize emin misiniz?</h3>
            <div className="flex gap-4 justify-end">
              <button className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800" onClick={() => setModalOpen(false)}>Vazgeç</button>
              <button className="px-4 py-2 rounded bg-red-600 text-white font-semibold" onClick={deleteComment}>Evet, Sil</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 