import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Sample blog posts
  const posts = [
    {
      title: 'Burçların Günlük Yorumları: 2024 Rehberi',
      slug: 'burclar-gunluk-yorumlari-2024',
      excerpt: '2024 yılında burçlarınızın günlük yorumlarını nasıl okuyacağınızı ve astrolojik etkileri nasıl anlayacağınızı öğrenin.',
      content: {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Astroloji ve Günlük Yaşam' }]
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'Astroloji, günlük yaşamımızda büyük bir rol oynar. Burçlarımızın günlük yorumları, o gün bizi bekleyen fırsatları ve zorlukları anlamamıza yardımcı olur.' }
            ]
          },
          {
            type: 'heading',
            attrs: { level: 3 },
            content: [{ type: 'text', text: 'Burç Yorumlarını Nasıl Okumalı?' }]
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'Günlük burç yorumlarını okurken dikkat etmeniz gereken birkaç önemli nokta var:' }
            ]
          },
          {
            type: 'bulletList',
            content: [
              {
                type: 'listItem',
                content: [
                  { type: 'text', text: 'Yükselen burcunuzu da kontrol edin' }
                ]
              },
              {
                type: 'listItem',
                content: [
                  { type: 'text', text: 'Ay burcunuzun etkilerini göz ardı etmeyin' }
                ]
              },
              {
                type: 'listItem',
                content: [
                  { type: 'text', text: 'Geçiş yapan gezegenlerin etkilerini takip edin' }
                ]
              }
            ]
          }
        ]
      },
      coverImage: null,
      isPublished: true,
      publishedAt: new Date('2024-01-15'),
    },
    {
      title: 'Ayın Burçlar Üzerindeki Etkisi',
      slug: 'ay-burclar-etkisi',
      excerpt: 'Ay\'ın burçlar üzerindeki etkisini ve günlük yaşamımızı nasıl şekillendirdiğini keşfedin.',
      content: {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Ay\'ın Gücü' }]
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'Ay, astrolojide duygularımızı ve iç dünyamızı temsil eder. Burçlar üzerindeki etkisi oldukça güçlüdür ve günlük yaşamımızı derinden etkiler.' }
            ]
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'Yeni ay dönemlerinde yeni başlangıçlar yapmak, dolunay dönemlerinde ise mevcut projelerimizi tamamlamak için ideal zamanlardır.' }
            ]
          }
        ]
      },
      coverImage: null,
      isPublished: true,
      publishedAt: new Date('2024-01-20'),
    },
    {
      title: 'Merkür Retrosu: İletişim ve Teknoloji',
      slug: 'merkür-retrosu-iletisim-teknoloji',
      excerpt: 'Merkür retrosu dönemlerinde iletişim ve teknoloji alanlarında yaşanan etkileri ve nasıl başa çıkacağımızı öğrenin.',
      content: {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Merkür Retrosu Nedir?' }]
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'Merkür retrosu, iletişim gezegeni Merkür\'ün geriye doğru hareket ettiği dönemlerdir. Bu dönemlerde iletişim, teknoloji ve seyahat alanlarında sorunlar yaşanabilir.' }
            ]
          },
          {
            type: 'heading',
            attrs: { level: 3 },
            content: [{ type: 'text', text: 'Merkür Retrosu Döneminde Yapılması Gerekenler' }]
          },
          {
            type: 'orderedList',
            content: [
              {
                type: 'listItem',
                content: [
                  { type: 'text', text: 'Önemli kararlar almaktan kaçının' }
                ]
              },
              {
                type: 'listItem',
                content: [
                  { type: 'text', text: 'İletişimde daha dikkatli olun' }
                ]
              },
              {
                type: 'listItem',
                content: [
                  { type: 'text', text: 'Teknolojik aletlerinizi yedekleyin' }
                ]
              }
            ]
          }
        ]
      },
      coverImage: null,
      isPublished: true,
      publishedAt: new Date('2024-01-25'),
    },
    {
      title: 'Venüs ve Aşk Astrolojisi',
      slug: 'venus-asik-astrolojisi',
      excerpt: 'Venüs gezegeninin aşk ve ilişkiler üzerindeki etkisini ve astrolojik uyumluluğu keşfedin.',
      content: {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Venüs: Aşk Gezegeni' }]
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'Venüs, astrolojide aşk, güzellik ve uyumu temsil eder. Burçlarımızda bulunduğu konum, aşk hayatımızı ve ilişkilerimizi derinden etkiler.' }
            ]
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'Venüs\'ün hangi burçta olduğu, o dönemde aşk hayatımızda yaşayacağımız deneyimleri şekillendirir.' }
            ]
          }
        ]
      },
      coverImage: null,
      isPublished: false, // Draft
      publishedAt: null,
    },
    {
      title: 'Mars ve Enerji Yönetimi',
      slug: 'mars-enerji-yonetimi',
      excerpt: 'Mars gezegeninin enerji ve motivasyon üzerindeki etkisini ve nasıl daha verimli olacağımızı öğrenin.',
      content: {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Mars: Enerji Gezegeni' }]
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'Mars, astrolojide enerji, motivasyon ve eylemi temsil eder. Burçlarımızda bulunduğu konum, enerji seviyemizi ve motivasyonumuzu belirler.' }
            ]
          }
        ]
      },
      coverImage: null,
      isPublished: false, // Draft
      publishedAt: null,
    }
  ];

  // Create posts
  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log(`📝 Created ${posts.length} blog posts`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 