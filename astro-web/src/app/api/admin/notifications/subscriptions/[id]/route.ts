import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Simple auth check - in production, you'd want proper auth
async function checkAuth(request: NextRequest) {
  // For now, we'll skip auth check - implement proper auth later
  return true;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const isAuthorized = await checkAuth(request);
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    await prisma.subscription.delete({
      where: { id },
    });

    return NextResponse.json({ 
      success: true,
      message: 'Subscription deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 