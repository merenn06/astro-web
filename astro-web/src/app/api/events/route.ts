import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const start = searchParams.get('start');
  const end = searchParams.get('end');
  if (!start || !end) {
    return NextResponse.json({ events: [] });
  }
  const events = await prisma.event.findMany({
    where: {
      date: {
        gte: new Date(start),
        lte: new Date(end),
      },
    },
    orderBy: { date: 'asc' },
  });
  return NextResponse.json({ events });
} 