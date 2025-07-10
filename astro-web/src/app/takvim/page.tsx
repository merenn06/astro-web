import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import CalendarList from '@/components/CalendarList';

export const metadata: Metadata = {
  title: 'Gökyüzü Takvimi • Dilek Alkan Kara',
  description: 'Önümüzdeki Yeniay, Dolunay, Retrolar ve tutulmaları tek sayfada görün, kendi takviminize ekleyin.',
};

// Group events by month
function groupByMonth(events: any[]) {
  const grouped: { [key: string]: any[] } = {};
  
  events.forEach(event => {
    const date = new Date(event.date);
    const monthKey = date.toLocaleDateString('tr-TR', { 
      year: 'numeric', 
      month: 'long' 
    });
    
    if (!grouped[monthKey]) {
      grouped[monthKey] = [];
    }
    grouped[monthKey].push(event);
  });
  
  return grouped;
}

export default async function TakvimPage() {
  const today = new Date();
  const events = await prisma.event.findMany({
    where: {
      date: {
        gte: today
      }
    },
    orderBy: {
      date: 'asc'
    }
  });

  const groupedEvents = groupByMonth(events);

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
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="/api/ical" 
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 focus:ring-4 focus:ring-primary/30"
            >
              iCal Export
            </a>
            <a 
              href="webcal://192.168.1.101:3001/api/ical"
              className="btn-outline"
            >
              Google Takvim
            </a>
          </div>
        </div>
      </section>

      {/* Calendar List */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <CalendarList events={groupedEvents} />
        </div>
      </section>
    </div>
  );
} 