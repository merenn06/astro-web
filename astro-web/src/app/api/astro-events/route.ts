import { NextRequest, NextResponse } from 'next/server';
import { fetchAllAstroEvents } from '@/lib/astroApis';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
    const month = parseInt(searchParams.get('month') || (new Date().getMonth() + 1).toString());

    // Geçerli tarih aralığını kontrol et
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

    const events = await fetchAllAstroEvents(year, month);

    return NextResponse.json({
      events,
      year,
      month,
      total: events.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Astro events API error:', error);
    
    // Hata mesajını daha detaylı hale getir
    const errorMessage = error instanceof Error ? error.message : 'Astrolojik olaylar alınamadı';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 