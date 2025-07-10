import webpush from 'web-push';
import { PrismaClient } from '@prisma/client';

// Configure VAPID keys
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:info@astroloji.com',
  process.env.VAPID_PUBLIC_KEY || 'BOGNRgRRyMLtaV47xZkb2KDao-AIc-TqHaCOYu19rAn0Cov3j62rHUC54KMyzFE3UwgH5F6dt0JQe0yA2cIXUV4',
  process.env.VAPID_PRIVATE_KEY || 'ri5cU1e_6Zlx_LVFpHHb5z0g4nmuoUOfcnC0y8n9t3k'
);

const prisma = new PrismaClient();

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  url?: string;
  data?: any;
}

async function sendPushNotification(payload: NotificationPayload) {
  try {
    console.log('Fetching subscriptions...');
    const subscriptions = await prisma.subscription.findMany();
    
    if (subscriptions.length === 0) {
      console.log('No subscriptions found');
      return;
    }

    console.log(`Found ${subscriptions.length} subscriptions`);

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

    console.log(`Push notification sent to ${successful} subscribers`);
    if (failed > 0) {
      console.log(`${failed} notifications failed`);
    }

  } catch (error) {
    console.error('Error sending push notifications:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Example usage
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    // Default notification
    await sendPushNotification({
      title: 'Merkür Retrosu Başladı!',
      body: 'İletişimde gecikmelere dikkat 🚀',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-72.png',
      url: '/blog/merkur-retrosu-iletisim-ve-teknoloji',
      data: {
        type: 'retro',
        url: '/blog/merkur-retrosu-iletisim-ve-teknoloji',
      },
    });
  } else {
    // Custom notification from command line
    const [title, body, url] = args;
    await sendPushNotification({
      title: title || 'Astroloji Rehberim',
      body: body || 'Yeni bir güncelleme var!',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-72.png',
      url: url || '/',
      data: {
        type: 'custom',
        url: url || '/',
      },
    });
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { sendPushNotification }; 