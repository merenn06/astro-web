import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const year = searchParams.get('year');
  const month = searchParams.get('month');
  if (!year || !month) {
    return NextResponse.json({ phasedata: [] });
  }
  try {
    const usnoRes = await fetch(`https://aa.usno.navy.mil/api/moon/phases/date?date=${year}-${month.padStart(2, '0')}&nump=8`);
    const usnoData = await usnoRes.json();
    return NextResponse.json(usnoData);
  } catch (e) {
    return NextResponse.json({ phasedata: [] });
  }
} 