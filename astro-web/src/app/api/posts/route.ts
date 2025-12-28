import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET /api/posts?page=1&limit=10
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const category = searchParams.get('category')?.toUpperCase();
    const skip = (page - 1) * limit;

    const where: any = { isPublished: true };
    if (category && ['MONTHLY', 'RETRO', 'TIP'].includes(category)) {
      where.category = category;
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          coverImage: true,
          category: true,
          publishedAt: true,
          createdAt: true,
        },
      }),
      prisma.post.count({ where }),
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