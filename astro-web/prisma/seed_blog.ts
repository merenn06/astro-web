import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding blog posts...');

  // Demo blog post
  await prisma.post.upsert({
    where: { slug: 'temmuz-2025-astroloji-genel-gorunum' },
    update: { category: 'MONTHLY' },
    create: {
      title: 'Temmuz 2025 Astroloji Genel Görünüm',
      slug: 'temmuz-2025-astroloji-genel-gorunum',
      excerpt: 'Temmuz ayında burçları neler bekliyor? Aşk, kariyer ve sağlık alanlarında burçlarınızın genel görünümü.',
      content: {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Temmuz 2025: Burçların Genel Görünümü' }]
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'Merhaba! Bu ay astrolojik açıdan oldukça dinamik bir dönem bizi bekliyor. Temmuz ayında birçok gezegen geçişi yaşanacak ve bu durum burçlarımızı farklı şekillerde etkileyecek.' }
            ]
          },
          {
            type: 'heading',
            attrs: { level: 3 },
            content: [{ type: 'text', text: 'Aşk ve İlişkiler' }]
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'Venüs\'ün Yay burcuna geçişi ile birlikte aşk hayatında yeni deneyimler yaşayabilirsiniz. Özellikle ateş grubu burçları (Koç, Aslan, Yay) bu dönemde daha romantik ve tutkulu olabilir.' }
            ]
          },
          {
            type: 'heading',
            attrs: { level: 3 },
            content: [{ type: 'text', text: 'Kariyer ve İş' }]
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'Merkür\'ün İkizler burcunda geriye hareketi iletişim konularında dikkatli olmanızı gerektiriyor. Önemli iş görüşmelerini bu dönemde yapmaktan kaçının ve sözleşmeleri dikkatle gözden geçirin.' }
            ]
          },
          {
            type: 'heading',
            attrs: { level: 3 },
            content: [{ type: 'text', text: 'Sağlık ve Enerji' }]
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'Mars\'ın Boğa burcundaki konumu enerji seviyenizi etkileyebilir. Toprak grubu burçları (Boğa, Başak, Oğlak) bu dönemde daha dayanıklı ve kararlı olabilir.' }
            ]
          },
          {
            type: 'bulletList',
            content: [
              {
                type: 'listItem',
                content: [
                  { type: 'text', text: 'Düzenli egzersiz yapmaya özen gösterin' }
                ]
              },
              {
                type: 'listItem',
                content: [
                  { type: 'text', text: 'Beslenme düzeninizi gözden geçirin' }
                ]
              },
              {
                type: 'listItem',
                content: [
                  { type: 'text', text: 'Stres yönetimi tekniklerini uygulayın' }
                ]
              }
            ]
          },
          {
            type: 'heading',
            attrs: { level: 3 },
            content: [{ type: 'text', text: 'Genel Öneriler' }]
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'Bu ay kendinize zaman ayırmaya ve kişisel gelişiminize odaklanmaya çalışın. Yeni hobiler edinmek veya mevcut yeteneklerinizi geliştirmek için ideal bir dönem.' }
            ]
          }
        ]
      },
      coverImage: '/uploads/temmuz2025.jpg',
      isPublished: true,
      publishedAt: new Date(),
      category: 'MONTHLY',
    },
  });

  // Diğer örnek güncellemeler
  await prisma.post.updateMany({ where: { slug: 'merkur-retrosu-iletisim-ve-teknoloji' }, data: { category: 'RETRO' } });
  await prisma.post.updateMany({ where: { slug: 'ayin-burclar-uzerindeki-etkisi' }, data: { category: 'TIP' } });
  await prisma.post.updateMany({ where: { slug: 'burclarin-gunluk-yorumlari-2024' }, data: { category: 'MONTHLY' } });

  console.log('✅ Blog post seeded successfully!');
  console.log('📝 Created: Temmuz 2025 Astroloji Genel Görünüm');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding blog:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 