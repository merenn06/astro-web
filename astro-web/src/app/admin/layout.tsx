'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SIDEBAR_LINKS = [
  { href: '/admin/blog', label: 'Blog' },
  { href: '/admin/takvim', label: 'Takvim' },
  { href: '/admin/yorumlar', label: 'Yorumlar' },
  { href: '/admin/danismanlik', label: 'Danışmanlık' },
  { href: '/admin/notifications', label: 'Bildirimler' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const pathname = usePathname();

  // Only check password on client (never expose env var to browser in prod!)
  const checkPassword = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuthorized(true);
      setError('');
    } else {
      setError('Yanlış şifre!');
    }
  };

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
        <form
          onSubmit={e => {
            e.preventDefault();
            checkPassword();
          }}
          className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-xs space-y-4"
        >
          <h1 className="text-2xl font-bold text-center text-purple-700 dark:text-purple-200 mb-4">Admin Girişi</h1>
          <input
            type="password"
            className="w-full p-2 rounded border"
            placeholder="Şifre"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded font-semibold hover:bg-purple-700 transition-colors">Giriş Yap</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      <aside className="w-56 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col p-6 gap-4">
        <h2 className="text-xl font-bold text-purple-700 dark:text-purple-200 mb-6">Admin Panel</h2>
        <nav className="flex flex-col gap-2">
          {SIDEBAR_LINKS.map(link => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  'px-3 py-2 rounded font-medium transition-colors ' +
                  (isActive
                    ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 shadow'
                    : 'hover:bg-purple-100 dark:hover:bg-purple-900 text-gray-800 dark:text-gray-200')
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
} 