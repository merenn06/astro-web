'use client';
import React from 'react';
import AstroCalendar, { AstroEvent } from '@/components/AstroCalendar';

const MOON_PHASE_ICONS: Record<string, string> = {
  'New Moon': '🌑',
  'First Quarter': '🌓',
  'Full Moon': '🌕',
  'Last Quarter': '🌗',
};

function parseUSNOMoonPhases(phases: any[], year: number, month: number): AstroEvent[] {
  return phases.map((p, i) => {
    const date = new Date(`${year}-${month.toString().padStart(2, '0')}-${p.day}`);
    return {
      id: 100000 + i,
      title: p.phase,
      date: date.toISOString(),
      type: 'moon',
      description: p.phase + ' fazı',
      icon: MOON_PHASE_ICONS[p.phase] || '🌙',
      color: '#f3e8ff',
    };
  });
}

export default function TakvimClient() {
  const [year, setYear] = React.useState(new Date().getFullYear());
  const [month, setMonth] = React.useState(new Date().getMonth() + 1); // 1-12
  const [events, setEvents] = React.useState<AstroEvent[]>([]);

  React.useEffect(() => {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
    // Fetch local events
    fetch(`/api/events?start=${startOfMonth.toISOString()}&end=${endOfMonth.toISOString()}`)
      .then(res => res.json())
      .then(async data => {
        let allEvents = data.events || [];
        // Fetch moon phases from local API (proxy)
        try {
          const moonRes = await fetch(`/api/moonphases?year=${year}&month=${month}`);
          const moonData = await moonRes.json();
          if (moonData.phasedata) {
            const moonEvents = parseUSNOMoonPhases(moonData.phasedata, year, month);
            allEvents = [...allEvents, ...moonEvents];
          }
        } catch (e) {
          // ignore moon phase errors
        }
        setEvents(allEvents);
      });
  }, [year, month]);

  return (
    <AstroCalendar
      events={events}
      year={year}
      month={month}
    />
  );
} 