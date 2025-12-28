'use client';

export default function DanismanlikTable({ forms }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Danışmanlık Başvuruları</h1>
      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">İsim</th>
            <th className="p-2 border">E-posta</th>
            <th className="p-2 border">Mesaj</th>
            <th className="p-2 border">Gönderim Tarihi</th>
          </tr>
        </thead>
        <tbody>
          {forms.map(form => (
            <tr key={form.id} className="border-b">
              <td className="p-2 border">{form.name}</td>
              <td className="p-2 border">{form.email}</td>
              <td className="p-2 border">{form.question}</td>
              <td className="p-2 border">{new Date(form.createdAt).toLocaleString('tr-TR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 