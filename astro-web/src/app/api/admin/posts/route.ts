import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/ratelimit';

// GET /api/admin/posts?page=1&status=draft|published&query=search
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const status = searchParams.get('status') || 'all';
    const query = searchParams.get('query')?.trim() || '';
    const limit = 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { excerpt: { contains: query, mode: 'insensitive' } },
      ];
    }
    
    if (status === 'draft') where.isPublished = false;
    if (status === 'published') where.isPublished = true;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          coverImage: true,
          isPublished: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.post.count({ where }),
    ]);

    const response = NextResponse.json({ posts, total });
    response.headers.set('X-Total-Count', total.toString());
    return response;
  } catch (error) {
    console.error('Admin posts GET error:', error);
    return NextResponse.json(
      { error: 'Yazılar alınamadı' },
      { status: 500 }
    );
  }
}

// POST /api/admin/posts
export async function POST(req: Request) {
  try {
    // Rate limiting
    const rateLimitResult = await checkRateLimit(req);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Çok fazla istek gönderdiniz. Lütfen 1 dakika bekleyin.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { title, excerpt, content, coverImage, isPublished = false } = body;

    // Validation
    if (!title?.trim()) {
      return NextResponse.json(
        { error: 'Başlık zorunludur' },
        { status: 400 }
      );
    }

    // Generate slug from title
    let slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Check for slug conflicts
    let counter = 1;
    let originalSlug = slug;
    while (await prisma.post.findUnique({ where: { slug } })) {
      slug = `${originalSlug}-${counter}`;
      counter++;
    }

    const post = await prisma.post.create({
      data: {
        title: title.trim(),
        slug,
        excerpt: excerpt?.trim() || null,
        content,
        coverImage: coverImage || null,
        isPublished,
        publishedAt: isPublished ? new Date() : null,
      },
    });

    const response = NextResponse.json(post, { status: 201 });
    if (rateLimitResult.remainingPoints !== undefined) {
      response.headers.set('X-RateLimit-Remaining', rateLimitResult.remainingPoints.toString());
    }
    return response;
  } catch (error) {
    console.error('Admin posts POST error:', error);
    return NextResponse.json(
      { error: 'Yazı oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
} 