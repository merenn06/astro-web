import { NextRequest, NextResponse } from 'next/server';
import { astroComService } from '@/lib/astroComService';

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
        events = await astroComService.getMoonPhasesForMonth(year, month);
        break;
      case 'stations':
        events = await astroComService.getPlanetStationsForMonth(year, month);
        break;
      case 'ingress':
        events = await astroComService.getSunIngressForMonth(year, month);
        break;
      case 'all':
      default:
        events = await astroComService.getAllEventsForMonth(year, month);
        break;
    }

    return NextResponse.json({
      events,
      year,
      month,
      type,
      total: events.length,
      source: 'astro_com',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Astro.com API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Astro.com hesaplaması başarısız';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
