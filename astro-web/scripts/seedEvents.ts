import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.event.deleteMany({}); // Clear existing events for idempotency

  const events = [
    {
      title: 'Yeniay',
      description: 'Yeni başlangıçlara açık olun.',
      type: 'yeniay',
      date: new Date('2025-08-05'),
    },
    {
      title: 'Dolunay',
      description: 'Duygusal patlamalara dikkat.',
      type: 'dolunay',
      date: new Date('2025-08-19'),
    },
    {
      title: 'Merkür Retro',
      description: 'İletişim kazalarına açık dönem.',
      type: 'retro',
      date: new Date('2025-08-28'),
    },
    {
      title: 'Güneş Tutulması',
      description: 'Kadersel değişimlere açık olun.',
      type: 'tutulma',
      date: new Date('2025-09-12'),
    },
  ];

  for (const event of events) {
    await prisma.event.create({ data: event });
  }

  console.log('🌟 Sample celestial events seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 