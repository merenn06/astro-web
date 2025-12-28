import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';
import { prisma } from '@/lib/prisma';

// Configure VAPID keys
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:info@astroloji.com',
  process.env.VAPID_PUBLIC_KEY || 'BOGNRgRRyMLtaV47xZkb2KDao-AIc-TqHaCOYu19rAn0Cov3j62rHUC54KMyzFE3UwgH5F6dt0JQe0yA2cIXUV4',
  process.env.VAPID_PRIVATE_KEY || 'ri5cU1e_6Zlx_LVFpHHb5z0g4nmuoUOfcnC0y8n9t3k'
);

// Simple auth check - in production, you'd want proper auth
async function checkAuth(request: NextRequest) {
  // For now, we'll skip auth check - implement proper auth later
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const isAuthorized = await checkAuth(request);
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, body, url } = await request.json();

    if (!title || !body) {
      return NextResponse.json(
        { error: 'Title and body are required' },
        { status: 400 }
      );
    }

    // Get all subscriptions
    const subscriptions = await prisma.subscription.findMany();
    
    if (subscriptions.length === 0) {
      return NextResponse.json({
        sent: 0,
        total: 0,
        message: 'No subscribers found',
      });
    }

    // Prepare notification payload
    const payload = {
      title,
      body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-72.png',
      url: url || '/',
      data: {
        url: url || '/',
        timestamp: Date.now(),
      },
    };

    // Send notifications to all subscribers
    const results = await Promise.allSettled(
      subscriptions.map(async (sub: any) => {
        try {
          const subscription = {
            endpoint: sub.endpoint,
            keys: JSON.parse(sub.keys),
          };

          await webpush.sendNotification(
            subscription,
            JSON.stringify(payload)
          );

          return { success: true, endpoint: sub.endpoint };
        } catch (error: any) {
          // If subscription is invalid (410), remove it from database
          if (error.statusCode === 410) {
            console.log(`Removing invalid subscription: ${sub.endpoint}`);
            await prisma.subscription.delete({
              where: { endpoint: sub.endpoint },
            });
          }
          
          return { 
            success: false, 
            endpoint: sub.endpoint, 
            error: error.message 
          };
        }
      })
    );

    const successful = results.filter((r: any) => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.length - successful;

    return NextResponse.json({
      sent: successful,
      total: subscriptions.length,
      failed,
      message: `Notification sent to ${successful} subscribers`,
    });
  } catch (error) {
    console.error('Error sending notifications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 