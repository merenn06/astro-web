import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SIGNS = [
  'koc', 'boga', 'ikizler', 'yengec', 'aslan', 'basak',
  'terazi', 'akrep', 'yay', 'oglak', 'kova', 'balik'
];

const PERIODS = ['gunluk', 'haftalik'];

const SIGN_NAMES = {
  koc: 'Koç',
  boga: 'Boğa',
  ikizler: 'İkizler',
  yengec: 'Yengeç',
  aslan: 'Aslan',
  basak: 'Başak',
  terazi: 'Terazi',
  akrep: 'Akrep',
  yay: 'Yay',
  oglak: 'Oğlak',
  kova: 'Kova',
  balik: 'Balık'
};

const PERIOD_NAMES = {
  gunluk: 'Günlük',
  haftalik: 'Haftalık'
};

// Generate markdown content for each horoscope
function generateHoroscopeContent(sign: string, period: string): string {
  const signName = SIGN_NAMES[sign as keyof typeof SIGN_NAMES];
  const periodName = PERIOD_NAMES[period as keyof typeof PERIOD_NAMES];
  
  return `# ${signName} ${periodName} Burç Yorumu

## Genel Bakış

Bugün ${signName} burcu için ${periodName.toLowerCase()} enerjiler oldukça yoğun. Güneş ve Ay'ın konumları size özel fırsatlar sunuyor.

## Aşk ve İlişkiler

Venüs'ün etkisiyle romantik ilişkilerinizde pozitif gelişmeler yaşayabilirsiniz. Tek kişiler için yeni tanışıklıklar söz konusu olabilir.

## Kariyer ve İş

Mars'ın enerjisi iş hayatınızda dinamik bir dönem başlatıyor. Yeni projeler ve fırsatlar kapınızı çalabilir.

## Sağlık ve Enerji

Jüpiter'in koruyucu etkisi sağlığınızı destekliyor. Spor ve egzersiz için ideal bir dönem.

## Finansal Durum

Satürn'ün disiplinli etkisi finansal konularda daha dikkatli olmanızı sağlıyor. Tasarruf yapmak için uygun bir zaman.

## Şanslı Sayılar
- **Şanslı Sayı:** ${Math.floor(Math.random() * 9) + 1}
- **Şanslı Renk:** ${['Kırmızı', 'Mavi', 'Yeşil', 'Mor', 'Turuncu'][Math.floor(Math.random() * 5)]}
- **Şanslı Gün:** ${['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'][Math.floor(Math.random() * 7)]}

## Öneriler

- Meditasyon yapın
- Doğa ile iç içe olun
- Yeni hobiler edinin
- Arkadaşlarınızla vakit geçirin

> **Not:** Bu yorum genel astrolojik etkileri yansıtmaktadır. Kişisel doğum haritanız daha detaylı bilgi verebilir.
`;
}

async function main() {
  await prisma.horoscope.deleteMany({});
  console.log('🌟 Horoscope seed başlatılıyor...');

  const horoscopes = [];

  for (const sign of SIGNS) {
    for (const period of PERIODS) {
      const content = generateHoroscopeContent(sign, period);
      
      const horoscope = await prisma.horoscope.create({
        data: {
          sign,
          period,
          content,
          publishedAt: new Date()
        }
      });

      horoscopes.push(horoscope);
      console.log(`✅ ${SIGN_NAMES[sign as keyof typeof SIGN_NAMES]} ${PERIOD_NAMES[period as keyof typeof PERIOD_NAMES]} oluşturuldu`);
    }
  }

  console.log(`\n🎉 Toplam ${horoscopes.length} horoscope başarıyla oluşturuldu!`);
  console.log('📊 Özet:');
  console.log(`   - ${SIGNS.length} burç × ${PERIODS.length} dönem = ${horoscopes.length} yorum`);
  console.log('   - Tüm yorumlar bugünün tarihi ile yayınlandı');
  console.log('   - Markdown formatında içerikler hazırlandı');
}

main()
  .catch((e) => {
    console.error('❌ Hata:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 