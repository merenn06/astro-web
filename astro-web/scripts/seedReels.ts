import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.reel.deleteMany({});
  
  const reels = [
    // 3 YouTube embeds
    {
      title: 'Astroloji Reel #1 - Koç Burcu',
      thumbnail: 'https://picsum.photos/seed/reel1/400/600',
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      createdAt: new Date(Date.now() - 1 * 86400000),
    },
    {
      title: 'Astroloji Reel #2 - Boğa Burcu',
      thumbnail: 'https://picsum.photos/seed/reel2/400/600',
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      createdAt: new Date(Date.now() - 2 * 86400000),
    },
    {
      title: 'Astroloji Reel #3 - İkizler Burcu',
      thumbnail: 'https://picsum.photos/seed/reel3/400/600',
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      createdAt: new Date(Date.now() - 3 * 86400000),
    },
    // 2 Instagram embeds
    {
      title: 'Astroloji Reel #4 - Yengeç Burcu',
      thumbnail: 'https://picsum.photos/seed/reel4/400/600',
      embedHtml: '<iframe src="https://www.instagram.com/reel/example1/embed" width="400" height="600" frameborder="0" scrolling="no" allowtransparency="true"></iframe>',
      createdAt: new Date(Date.now() - 4 * 86400000),
    },
    {
      title: 'Astroloji Reel #5 - Aslan Burcu',
      thumbnail: 'https://picsum.photos/seed/reel5/400/600',
      embedHtml: '<iframe src="https://www.instagram.com/reel/example2/embed" width="400" height="600" frameborder="0" scrolling="no" allowtransparency="true"></iframe>',
      createdAt: new Date(Date.now() - 5 * 86400000),
    },
    // 3 MP4 videos
    {
      title: 'Astroloji Reel #6 - Başak Burcu',
      thumbnail: 'https://picsum.photos/seed/reel6/400/600',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      createdAt: new Date(Date.now() - 6 * 86400000),
    },
    {
      title: 'Astroloji Reel #7 - Terazi Burcu',
      thumbnail: 'https://picsum.photos/seed/reel7/400/600',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      createdAt: new Date(Date.now() - 7 * 86400000),
    },
    {
      title: 'Astroloji Reel #8 - Akrep Burcu',
      thumbnail: 'https://picsum.photos/seed/reel8/400/600',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      createdAt: new Date(Date.now() - 8 * 86400000),
    },
  ];

  for (const reel of reels) {
    await prisma.reel.create({ data: reel });
  }
  
  console.log('🎬 8 mixed sample reels seeded!');
  console.log('   - 3 YouTube embeds');
  console.log('   - 2 Instagram embeds');
  console.log('   - 3 MP4 videos');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 