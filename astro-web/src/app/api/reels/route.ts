import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;

    const [reels, total] = await Promise.all([
      prisma.reel.findMany({
        where: {
          isActive: true,
        },
        orderBy: [
          { order: 'asc' },
          { publishedAt: 'desc' },
        ],
        skip: offset,
        take: limit,
        select: {
          id: true,
          title: true,
          description: true,
          videoUrl: true,
          thumbnail: true,
          publishedAt: true,
          calendarUrl: true,
        },
      }),
      prisma.reel.count({
        where: {
          isActive: true,
        },
      }),
    ]);

    const response = NextResponse.json({
      items: reels,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });

    // Cache for 60 seconds
    response.headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate');
    
    return response;
  } catch (error) {
    console.error('Error fetching reels:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 