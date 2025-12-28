import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const forms = await prisma.consultation.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      question: true,
      createdAt: true,
    },
  });
  return NextResponse.json(forms);
} 