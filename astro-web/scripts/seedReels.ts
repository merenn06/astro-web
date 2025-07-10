import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.reel.deleteMany({});
  
  const reels = [
    {
      title: 'Astroloji Reel #1 - Koç Burcu',
      description: 'Koç burcu için günlük astroloji yorumu',
      thumbnail: 'https://picsum.photos/seed/reel1/400/600',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      publishedAt: new Date(Date.now() - 1 * 86400000),
      calendarUrl: 'https://calendar.google.com/calendar/event?action=TEMPLATE&text=Astroloji+Reel+1&dates=20240101T100000Z/20240101T110000Z',
    },
    {
      title: 'Astroloji Reel #2 - Boğa Burcu',
      description: 'Boğa burcu için haftalık astroloji rehberi',
      thumbnail: 'https://picsum.photos/seed/reel2/400/600',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      publishedAt: new Date(Date.now() - 2 * 86400000),
    },
    {
      title: 'Astroloji Reel #3 - İkizler Burcu',
      description: 'İkizler burcu için ayın ritüeli',
      thumbnail: 'https://picsum.photos/seed/reel3/400/600',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      publishedAt: new Date(Date.now() - 3 * 86400000),
      calendarUrl: 'https://calendar.google.com/calendar/event?action=TEMPLATE&text=Astroloji+Reel+3&dates=20240103T100000Z/20240103T110000Z',
    },
    {
      title: 'Astroloji Reel #4 - Yengeç Burcu',
      description: 'Yengeç burcu için özel astroloji ipuçları',
      thumbnail: 'https://picsum.photos/seed/reel4/400/600',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      publishedAt: new Date(Date.now() - 4 * 86400000),
    },
    {
      title: 'Astroloji Reel #5 - Aslan Burcu',
      description: 'Aslan burcu için güçlü ritüeller',
      thumbnail: 'https://picsum.photos/seed/reel5/400/600',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      publishedAt: new Date(Date.now() - 5 * 86400000),
    },
    {
      title: 'Astroloji Reel #6 - Başak Burcu',
      description: 'Başak burcu için detaylı astroloji analizi',
      thumbnail: 'https://picsum.photos/seed/reel6/400/600',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      publishedAt: new Date(Date.now() - 6 * 86400000),
    },
    {
      title: 'Astroloji Reel #7 - Terazi Burcu',
      description: 'Terazi burcu için denge ve uyum rehberi',
      thumbnail: 'https://picsum.photos/seed/reel7/400/600',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      publishedAt: new Date(Date.now() - 7 * 86400000),
    },
    {
      title: 'Astroloji Reel #8 - Akrep Burcu',
      description: 'Akrep burcu için derin astroloji keşifleri',
      thumbnail: 'https://picsum.photos/seed/reel8/400/600',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      publishedAt: new Date(Date.now() - 8 * 86400000),
    },
  ];

  for (const reel of reels) {
    await prisma.reel.create({ data: reel });
  }
  
  console.log('🎬 8 sample reels seeded!');
  console.log('   - All with videoUrl and descriptions');
  console.log('   - 2 with calendar URLs');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 