import { NextRequest, NextResponse } from 'next/server';
import { swissEphemerisService } from '@/lib/swissEphemerisService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
    const month = parseInt(searchParams.get('month') || (new Date().getMonth() + 1).toString());
    const type = searchParams.get('type') || 'all'; // all, moon_phases, stations, ingress

    // Validate parameters
    if (year < 2020 || year > 2030) {
      return NextResponse.json(
        { error: 'Geçersiz yıl. 2020-2030 arası desteklenir.' },
        { status: 400 }
      );
    }

    if (month < 1 || month > 12) {
      return NextResponse.json(
        { error: 'Geçersiz ay. 1-12 arası olmalı.' },
        { status: 400 }
      );
    }

    let events;

    switch (type) {
      case 'moon_phases':
        events = await swissEphemerisService.getMoonPhasesForMonth(year, month);
        break;
      case 'stations':
        events = await swissEphemerisService.getPlanetStationsForMonth(year, month);
        break;
      case 'ingress':
        events = await swissEphemerisService.getSunIngressForMonth(year, month);
        break;
      case 'all':
      default:
        events = await swissEphemerisService.getAllEventsForMonth(year, month);
        break;
    }

    return NextResponse.json({
      events,
      year,
      month,
      type,
      total: events.length,
      source: 'swiss_ephemeris',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Swiss Ephemeris API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Swiss Ephemeris hesaplaması başarısız';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// Cleanup on process exit
process.on('SIGINT', () => {
  swissEphemerisService.cleanup();
});

process.on('SIGTERM', () => {
  swissEphemerisService.cleanup();
});
