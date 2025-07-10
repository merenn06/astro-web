import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';
import { prisma } from '@/lib/prisma';

// Configure VAPID keys
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:info@astroloji.com',
  process.env.VAPID_PUBLIC_KEY || 'BOGNRgRRyMLtaV47xZkb2KDao-AIc-TqHaCOYu19rAn0Cov3j62rHUC54KMyzFE3UwgH5F6dt0JQe0yA2cIXUV4',
  process.env.VAPID_PRIVATE_KEY || 'ri5cU1e_6Zlx_LVFpHHb5z0g4nmuoUOfcnC0y8n9t3k'
);

export async function POST(request: NextRequest) {
  try {
    const subscription = await request.json();
    
    if (!subscription.endpoint || !subscription.keys) {
      return NextResponse.json(
        { error: 'Invalid subscription data' },
        { status: 400 }
      );
    }

    // Store subscription in database
    await prisma.subscription.upsert({
      where: { endpoint: subscription.endpoint },
      update: { 
        keys: JSON.stringify(subscription.keys),
        updatedAt: new Date(),
      },
      create: {
        endpoint: subscription.endpoint,
        keys: JSON.stringify(subscription.keys),
      },
    });

    // Send a test notification to verify subscription
    try {
      await webpush.sendNotification(
        subscription,
        JSON.stringify({
          title: 'Astroloji Rehberim',
          body: 'Bildirimler başarıyla aktifleştirildi! 🌟',
          icon: '/icons/icon-192.png',
          badge: '/icons/icon-72.png',
          data: {
            url: '/',
          },
        })
      );
    } catch (error) {
      console.error('Test notification failed:', error);
      // Don't fail the subscription if test notification fails
    }

    return NextResponse.json({ 
      success: true,
      message: 'Subscription saved successfully' 
    });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { endpoint } = await request.json();
    
    if (!endpoint) {
      return NextResponse.json(
        { error: 'Endpoint is required' },
        { status: 400 }
      );
    }

    // Remove subscription from database
    await prisma.subscription.delete({
      where: { endpoint },
    });

    return NextResponse.json({ 
      success: true,
      message: 'Subscription removed successfully' 
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 