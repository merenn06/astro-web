import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { createEvents, EventAttributes } from 'ics';

type Event = {
  id: number;
  title: string;
  date: Date;
  type: string;
  description: string;
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const forGoogle = url.searchParams.has('google');

  const events = await prisma.event.findMany({
    where: { date: { gte: new Date() } },
    orderBy: { date: 'asc' },
    take: 100,
  });

  const icsEvents: EventAttributes[] = events.map((e: Event) => ({
    title: e.title,
    description: e.description ?? '',
    start: [
      e.date.getFullYear(),
      e.date.getMonth() + 1,
      e.date.getDate(),
      e.date.getHours(),
      e.date.getMinutes(),
    ],
    startInputType: 'local',
    duration: { hours: 1 },
    categories: [e.type],
    url: 'https://astroloji.site/takvim',
  }));

  const { error, value } = createEvents(icsEvents);
  if (error) return NextResponse.json({ error }, { status: 500 });

  if (forGoogle) {
    const googleURL =
      'https://calendar.google.com/calendar/r?cid=' +
      encodeURIComponent(`data:text/calendar;charset=utf8,${value}`);
    return NextResponse.redirect(googleURL);
  }

  return new NextResponse(value, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="gokyuzu-takvimi.ics"',
    },
  });
} 