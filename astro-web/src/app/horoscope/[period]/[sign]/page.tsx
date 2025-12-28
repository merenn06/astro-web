import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, Star, Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Define valid periods and signs
const VALID_PERIODS = ['gunluk', 'haftalik'] as const;
const VALID_SIGNS = [
  'koc', 'boga', 'ikizler', 'yengec', 'aslan', 'basak',
  'terazi', 'akrep', 'yay', 'oglak', 'kova', 'balik'
] as const;

type Period = typeof VALID_PERIODS[number];
type Sign = typeof VALID_SIGNS[number];

// Sign display names
const SIGN_NAMES: Record<Sign, string> = {
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

// Period display names
const PERIOD_NAMES: Record<Period, string> = {
  gunluk: 'Günlük',
  haftalik: 'Haftalık'
};



// Generate static params for all possible combinations
export async function generateStaticParams() {
  const params: { period: Period; sign: Sign }[] = [];
  
  for (const period of VALID_PERIODS) {
    for (const sign of VALID_SIGNS) {
      params.push({ period, sign });
    }
  }
  
  return params;
}

// Generate metadata for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: { period: string; sign: string } 
}): Promise<Metadata> {
  const { period, sign } = params;
  
  // Validate parameters
  if (!VALID_PERIODS.includes(period as Period) || !VALID_SIGNS.includes(sign as Sign)) {
    return {
      title: 'Burç Yorumu Bulunamadı | Astrolog Dilek Alkan Kara',
      description: 'Aradığınız burç yorumu bulunamadı.',
    };
  }

  const signName = SIGN_NAMES[sign as Sign];
  const periodName = PERIOD_NAMES[period as Period];
  const title = `${signName} ${periodName} Burç Yorumu | Astrolog Dilek Alkan Kara`;
  const description = `${signName} burcu ${periodName.toLowerCase()} yorumu. ${signName} burcunun günlük/haftalık astroloji yorumu ve gelecek tahminleri.`;
  
  const domain = process.env.DOMAIN || 'localhost:3000';
  const url = `https://${domain}/horoscope/${period}/${sign}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      url,
      images: [
        {
          url: `https://${domain}/horoscope-${sign}.jpg`,
          width: 1200,
          height: 630,
          alt: `${signName} Burç Yorumu`,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`https://${domain}/horoscope-${sign}.jpg`],
    },
  };
}

// Fetch horoscope data
async function getHoroscope(period: Period, sign: Sign) {
  const horoscope = await prisma.horoscope.findFirst({
    where: {
      sign,
      period,
      publishedAt: {
        lte: new Date()
      }
    },
    orderBy: {
      publishedAt: 'desc'
    }
  });

  return horoscope;
}

// Page component
export default async function HoroscopePage({
  params
}: {
  params: { period: string; sign: string }
}) {
  const { period, sign } = params;
  
  // Validate parameters
  if (!VALID_PERIODS.includes(period as Period) || !VALID_SIGNS.includes(sign as Sign)) {
    notFound();
  }

  const horoscope = await getHoroscope(period as Period, sign as Sign);
  
  if (!horoscope) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <Star className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {SIGN_NAMES[sign as Sign]} {PERIOD_NAMES[period as Period]} Burç Yorumu
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Bu burç yorumu henüz hazırlanmamış. Lütfen daha sonra tekrar kontrol edin.
            </p>
            <Link 
              href="/horoscope"
              className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Tüm Burç Yorumları
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
          <Link href="/" className="hover:text-purple-600 transition-colors">
            Ana Sayfa
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/horoscope" className="hover:text-purple-600 transition-colors">
            Burç Yorumları
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 dark:text-white">
            {SIGN_NAMES[sign as Sign]} {PERIOD_NAMES[period as Period]}
          </span>
        </nav>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Star className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              {SIGN_NAMES[sign as Sign]} {PERIOD_NAMES[period as Period]} Burç Yorumu
            </h1>
          </div>
          <div className="flex items-center justify-center gap-4 text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>
                {new Date(horoscope.publishedAt).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Sign Selector */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Burç Seçin
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {VALID_SIGNS.map((validSign) => (
                <Link
                  key={validSign}
                  href={`/horoscope/${period}/${validSign}`}
                  className={`p-3 rounded-lg text-center transition-colors ${
                    validSign === sign
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900'
                  }`}
                >
                  {SIGN_NAMES[validSign]}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Period Selector */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Dönem Seçin
            </h3>
            <div className="flex gap-4">
              {VALID_PERIODS.map((validPeriod) => (
                <Link
                  key={validPeriod}
                  href={`/horoscope/${validPeriod}/${sign}`}
                  className={`px-6 py-3 rounded-lg transition-colors ${
                    validPeriod === period
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900'
                  }`}
                >
                  {PERIOD_NAMES[validPeriod]}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Horoscope Content */}
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-gray-900 dark:text-white">
              {SIGN_NAMES[sign as Sign]} Burç Yorumu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <ReactMarkdown>
                {horoscope.content as string}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ISR revalidation every 6 hours
export const revalidate = 21600; 