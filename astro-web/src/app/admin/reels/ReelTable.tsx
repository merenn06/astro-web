'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function ReelTable({ reels: initialReels }) {
  const [reels, setReels] = useState(initialReels);

  async function handleDelete(id) {
    if (!confirm('Bu reeli silmek istediğinize emin misiniz?')) return;
    const res = await fetch(`/api/reel?id=${id}`, { method: 'DELETE' });
    if (res.ok) setReels(reels.filter(r => r.id !== id));
    else alert('Silme işlemi başarısız oldu.');
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Reels Yönetimi</h1>
      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Görsel</th>
            <th className="p-2 border">Başlık</th>
            <th className="p-2 border">Tarih</th>
            <th className="p-2 border">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {reels.map(reel => (
            <tr key={reel.id} className="border-b">
              <td className="p-2 border">
                <Image src={reel.thumbnail} alt={reel.title} width={80} height={45} className="object-cover rounded" />
              </td>
              <td className="p-2 border">{reel.title}</td>
              <td className="p-2 border">{new Date(reel.createdAt).toLocaleDateString('tr-TR')}</td>
              <td className="p-2 border">
                <button className="text-blue-600 hover:underline mr-2">Düzenle</button>
                <button className="text-red-600 hover:underline" onClick={() => handleDelete(reel.id)}>Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 