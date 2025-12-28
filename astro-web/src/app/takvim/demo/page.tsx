import { Metadata } from 'next';
import TakvimClient from '../TakvimClient';

export const metadata: Metadata = {
  title: 'Astrolojik Takvim Demo • Dilek Alkan Kara',
  description: 'Astrolojik olayları gösteren takvim sisteminin demo sayfası',
};

export default function TakvimDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-purple-50 dark:from-black dark:via-gray-950 dark:to-purple-950">
      {/* Hero Section */}
      <section className="py-14 text-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-black">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary dark:text-primary">
            🌙 Astrolojik Takvim Demo
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg">
            Calendarific ve Moon Phase API entegrasyonu ile astrolojik olayları gösteren takvim sistemi
          </p>
          <div className="mt-6 p-4 bg-white/80 dark:bg-gray-800/80 rounded-lg max-w-2xl mx-auto">
            <h3 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">🎯 Demo Özellikleri:</h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 text-left">
              <li>• 🌕 Ay evreleri (Yeniay, Dolunay, İlk/Son Dördün)</li>
              <li>• ☀️ Astronomik olaylar (Dolunay, Retrolar, Burç geçişleri)</li>
              <li>• 💫 Hover tooltip'leri ile detaylı bilgi</li>
              <li>• 📱 Mobil uyumlu responsive tasarım</li>
              <li>• 🌙 Dark/Light mode desteği</li>
            </ul>
          </div>
        </div>
      </section>
      
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <TakvimClient />
        </div>
      </section>
      
      {/* API Bilgileri */}
      <section className="py-12 bg-white/50 dark:bg-gray-900/50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-purple-700 dark:text-purple-300 mb-8">
            🔧 Teknik Detaylar
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="font-semibold text-lg mb-3 text-purple-600 dark:text-purple-400">
                📡 API Endpoint'leri
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    GET /api/astro-events?year=2025&month=7
                  </code>
                </div>
                <div>
                  <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    Calendarific API (Astronomik olaylar)
                  </code>
                </div>
                <div>
                  <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    Moon Phase API (Ay evreleri)
                  </code>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="font-semibold text-lg mb-3 text-purple-600 dark:text-purple-400">
                🎨 UI Özellikleri
              </h3>
              <div className="space-y-2 text-sm">
                <div>• Tooltip sistemi (hover ile detay)</div>
                <div>• İkon sistemi (🌕🌑🌓🌗)</div>
                <div>• Renk kodlaması (olay türlerine göre)</div>
                <div>• Responsive grid layout</div>
                <div>• Loading states</div>
                <div>• Error handling</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 