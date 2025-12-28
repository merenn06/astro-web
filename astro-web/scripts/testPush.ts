import { sendPushNotification } from './sendPush';

async function testPushNotifications() {
  console.log('🧪 Testing Push Notifications...\n');

  const testNotifications = [
    {
      title: 'Test Bildirimi',
      body: 'Bu bir test bildirimidir 🧪',
      url: '/',
    },
    {
      title: 'Merkür Retrosu Başladı!',
      body: 'İletişimde gecikmelere dikkat 🚀',
      url: '/blog/merkur-retrosu-iletisim-ve-teknoloji',
    },
    {
      title: 'Dolunay Ritüeli',
      body: 'Bu gece dolunay enerjisini kullanın 🌕',
      url: '/blog/dolunay-ritueli',
    },
  ];

  for (const notification of testNotifications) {
    console.log(`📤 Sending: ${notification.title}`);
    console.log(`   Body: ${notification.body}`);
    console.log(`   URL: ${notification.url}\n`);
    
    await sendPushNotification(notification);
    
    // Wait 2 seconds between notifications
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('✅ Test completed!');
}

// Run test if called directly
if (require.main === module) {
  testPushNotifications().catch(console.error);
}

export { testPushNotifications }; 