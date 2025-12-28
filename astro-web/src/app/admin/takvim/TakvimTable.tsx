'use client';
import { useState } from 'react';

export default function TakvimTable({ events: initialEvents }) {
  const [events, setEvents] = useState(initialEvents);

  async function handleDelete(id) {
    if (!confirm('Bu olayı silmek istediğinize emin misiniz?')) return;
    const res = await fetch(`/api/event?id=${id}`, { method: 'DELETE' });
    if (res.ok) setEvents(events.filter(e => e.id !== id));
    else alert('Silme işlemi başarısız oldu.');
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Takvim Olayları</h1>
      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Tür</th>
            <th className="p-2 border">Tarih</th>
            <th className="p-2 border">Açıklama</th>
            <th className="p-2 border">İşlem</th>
          </tr>
        </thead>
        <tbody>
          {events.map(event => (
            <tr key={event.id} className="border-b">
              <td className="p-2 border">{event.type}</td>
              <td className="p-2 border">{new Date(event.date).toLocaleDateString('tr-TR')}</td>
              <td className="p-2 border">{event.description}</td>
              <td className="p-2 border">
                <button className="text-red-600 hover:underline" onClick={() => handleDelete(event.id)}>Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 