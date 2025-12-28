import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET /api/admin/posts/[id]
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Yazı bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Admin post GET error:', error);
    return NextResponse.json(
      { error: 'Yazı alınamadı' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/posts/[id]
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { title, excerpt, content, coverImage, isPublished } = body;

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Yazı bulunamadı' },
        { status: 404 }
      );
    }

    // Generate new slug if title changed
    let slug = existingPost.slug;
    if (title && title !== existingPost.title) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      // Check for slug conflicts (excluding current post)
      let counter = 1;
      let originalSlug = slug;
      while (await prisma.post.findFirst({
        where: { 
          slug,
          id: { not: id }
        }
      })) {
        slug = `${originalSlug}-${counter}`;
        counter++;
      }
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title.trim();
    if (excerpt !== undefined) updateData.excerpt = excerpt?.trim() || null;
    if (content !== undefined) updateData.content = content;
    if (coverImage !== undefined) updateData.coverImage = coverImage;
    if (isPublished !== undefined) {
      updateData.isPublished = isPublished;
      updateData.publishedAt = isPublished ? new Date() : null;
    }
    if (slug !== existingPost.slug) updateData.slug = slug;

    const post = await prisma.post.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Admin posts PATCH error:', error);
    return NextResponse.json(
      { error: 'Yazı güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/posts/[id]
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Yazı bulunamadı' },
        { status: 404 }
      );
    }

    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin posts DELETE error:', error);
    return NextResponse.json(
      { error: 'Yazı silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 