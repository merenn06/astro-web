import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET /api/posts?page=1&limit=10
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: {
          isPublished: true,
        },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          coverImage: true,
          publishedAt: true,
          createdAt: true,
        },
      }),
      prisma.post.count({
        where: {
          isPublished: true,
        },
      }),
    ]);

    const response = NextResponse.json({ posts, total });
    response.headers.set('X-Total-Count', total.toString());
    return response;
  } catch (error) {
    console.error('Public posts GET error:', error);
    return NextResponse.json(
      { error: 'Yazılar alınamadı' },
      { status: 500 }
    );
  }
} 