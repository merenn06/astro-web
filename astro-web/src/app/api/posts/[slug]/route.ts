import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET /api/posts/[slug]
export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const post = await prisma.post.findFirst({
      where: {
        slug,
        isPublished: true,
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Yazı bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Public post GET error:', error);
    return NextResponse.json(
      { error: 'Yazı alınamadı' },
      { status: 500 }
    );
  }
} 