import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/ratelimit';

// GET /api/comments?q=search&status=approved|unapproved|all&page=1&limit=12
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.trim() || '';
  const status = searchParams.get('status') || 'all';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '12', 10);
  const skip = (page - 1) * limit;

  const where: any = {};
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
    ];
  }
  if (status === 'approved') where.isApproved = true;
  if (status === 'unapproved') where.isApproved = false;

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.comment.count({ where }),
  ]);

  const response = NextResponse.json({ comments, total });
  response.headers.set('X-Total-Count', total.toString());
  return response;
}

// POST /api/comments
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
    const { name, email, content, isApproved = false, isHighlighted = false, website } = body;

    // Honeypot protection
    if (website) {
      return NextResponse.json(
        { error: 'Geçersiz istek' },
        { status: 400 }
      );
    }

    // Validation
    if (!name?.trim() || !email?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: 'Ad, e-posta ve yorum alanları zorunludur' },
        { status: 400 }
      );
    }

    if (content.trim().length < 10) {
      return NextResponse.json(
        { error: 'Yorum en az 10 karakter olmalıdır' },
        { status: 400 }
      );
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        content: content.trim(),
        isApproved,
        isHighlighted,
      },
    });

    const response = NextResponse.json(comment, { status: 201 });
    if (rateLimitResult.remainingPoints !== undefined) {
      response.headers.set('X-RateLimit-Remaining', rateLimitResult.remainingPoints.toString());
    }
    return response;
  } catch (error) {
    console.error('Comment creation error:', error);
    return NextResponse.json(
      { error: 'Yorum oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
} 