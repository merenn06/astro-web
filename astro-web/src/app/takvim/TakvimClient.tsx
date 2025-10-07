'use client';
import React, { useState, useEffect } from 'react';
import AstroCalendar, { AstroEvent } from '@/components/AstroCalendar';
import { AstroApiEvent } from '@/lib/astroApis';

// API'den gelen olayları AstroEvent formatına dönüştür
function convertApiEventsToAstroEvents(apiEvents: AstroApiEvent[]): AstroEvent[] {
  return apiEvents.map(event => ({
    id: parseInt(event.id.replace(/\D/g, '') || '0'),
    title: event.title,
    date: event.date,
    type: event.type,
    description: event.description,
    icon: event.icon,
    color: event.color,
  }));
}

export default function TakvimClient() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1); // 1-12
  const [events, setEvents] = useState<AstroEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Astrolojik API'den veri çek
        const astroResponse = await fetch(`/api/astro-events?year=${year}&month=${month}`);
        
        if (!astroResponse.ok) {
          throw new Error('Astrolojik olaylar alınamadı');
        }
        
        const astroData = await astroResponse.json();
        const astroEvents = convertApiEventsToAstroEvents(astroData.events || []);

        // Mevcut yerel olayları da çek (varsa)
        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
        
        try {
          const localResponse = await fetch(`/api/events?start=${startOfMonth.toISOString()}&end=${endOfMonth.toISOString()}`);
          const localData = await localResponse.json();
          const localEvents = localData.events || [];
          
          // Tüm olayları birleştir
          setEvents([...localEvents, ...astroEvents]);
        } catch (localError) {
          // Yerel olaylar yoksa sadece astrolojik olayları kullan
          setEvents(astroEvents);
        }

      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [year, month]);

  // Yıl/ay değişikliklerini handle et
  const handleYearChange = (newYear: number) => {
    setYear(newYear);
  };

  const handleMonthChange = (newMonth: number) => {
    setMonth(newMonth);
  };

  return (
    <div>
      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Astrolojik olaylar yükleniyor...</p>
        </div>
      )}
      
      {error && (
        <div className="text-center py-4">
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded">
            <p>⚠️ {error}</p>
            <p className="text-sm mt-1">Sabit veri dosyalarını kontrol edin</p>
          </div>
        </div>
      )}

      <AstroCalendar
        events={events}
        year={year}
        month={month}
        onYearChange={handleYearChange}
        onMonthChange={handleMonthChange}
      />
    </div>
  );
} 