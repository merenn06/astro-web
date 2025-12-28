import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, email, birthDate, birthPlace, question } = data;
    if (!name || !email || !birthDate || !birthPlace || !question) {
      return NextResponse.json({ error: 'Eksik alanlar var.' }, { status: 400 });
    }
    const consultation = await prisma.consultation.create({
      data: {
        name,
        email,
        birthDate: new Date(birthDate),
        birthPlace,
        question,
      },
    });
    return NextResponse.json({ success: true, consultation });
  } catch (e) {
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Eksik id.' }, { status: 400 });
  }
  try {
    await prisma.consultation.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Kayıt silinemedi.' }, { status: 500 });
  }
} 