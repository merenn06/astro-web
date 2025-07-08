'use client';
import Image from "next/image";
import { useEffect, useState } from 'react';

function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    typeof window !== 'undefined' && window.document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <button
      className="px-4 py-2 rounded border mt-4"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode
    </button>
  );
}

export default function Page() {
  return (
    <main className="prose dark:prose-invert mx-auto p-8">
      <h1>Astroloji App</h1>
      <ThemeToggle />
      <p>Welcome to your Next.js 14 + Tailwind + Prisma + NextAuth starter!</p>
    </main>
  );
}
