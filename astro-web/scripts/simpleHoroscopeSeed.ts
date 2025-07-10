import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌟 Simple horoscope seed başlatılıyor...');

  try {
    // Create a single horoscope to test
    const horoscope = await prisma.horoscope.create({
      data: {
        sign: 'koc',
        period: 'gunluk',
        content: '# Koç Günlük Burç Yorumu\n\nBugün çok güzel bir gün!',
        publishedAt: new Date()
      }
    });

    console.log('✅ Horoscope oluşturuldu:', horoscope);
  } catch (error) {
    console.error('❌ Hata:', error);
  }
}

main()
  .catch((e) => {
    console.error('❌ Hata:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 