import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: List all reels
export async function GET() {
  const reels = await prisma.reel.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(reels);
}

// POST: Create a new reel
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { title, thumbnail, reelType, urlOrHtml } = data;
    if (!title || !thumbnail || !reelType || !urlOrHtml) {
      return NextResponse.json({ error: 'Eksik alanlar var.' }, { status: 400 });
    }
    let reelData: any = { title, thumbnail };
    if (reelType === 'embed') {
      reelData.embedUrl = urlOrHtml;
    } else if (reelType === 'html') {
      reelData.embedHtml = urlOrHtml;
    } else if (reelType === 'video') {
      reelData.videoUrl = urlOrHtml;
    } else {
      return NextResponse.json({ error: 'Geçersiz reel tipi.' }, { status: 400 });
    }
    const reel = await prisma.reel.create({ data: reelData });
    return NextResponse.json(reel);
  } catch (e) {
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}

// DELETE: Delete a reel by id (expects ?id=...)
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Eksik id.' }, { status: 400 });
  }
  try {
    await prisma.reel.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Kayıt silinemedi.' }, { status: 500 });
  }
} 