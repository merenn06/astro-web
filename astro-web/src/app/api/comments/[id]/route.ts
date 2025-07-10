import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// PATCH /api/comments/[id]
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const body = await req.json();
    const { isApproved, isHighlighted } = body;
    const data: any = {};
    if (typeof isApproved === 'boolean') data.isApproved = isApproved;
    if (typeof isHighlighted === 'boolean') data.isHighlighted = isHighlighted;
    const updated = await prisma.comment.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: 'Güncelleme başarısız.' }, { status: 400 });
  }
}

// DELETE /api/comments/[id]
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    await prisma.comment.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Silme başarısız.' }, { status: 400 });
  }
} 