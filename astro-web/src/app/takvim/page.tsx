import { Metadata } from 'next';
import TakvimClient from './TakvimClient';

export const metadata: Metadata = {
  title: 'Gökyüzü Takvimi • Dilek Alkan Kara',
  description: 'Önümüzdeki Yeniay, Dolunay, Retrolar ve tutulmaları tek sayfada görün, kendi takviminize ekleyin.',
};

export default function TakvimPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-purple-50 dark:from-black dark:via-gray-950 dark:to-purple-950">
      {/* Hero Section */}
      <section className="py-14 text-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-black">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary dark:text-primary">
            Gökyüzü Takvimi
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400 text-lg">
            Önümüzdeki gök olaylarını keşfedin
          </p>
        </div>
      </section>
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <TakvimClient />
        </div>
      </section>
    </div>
  );
} 