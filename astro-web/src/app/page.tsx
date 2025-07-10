import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { Star, Calendar, Instagram, Mail, Twitter, Youtube } from 'lucide-react';
import HomeReelGrid from '@/components/HomeReelGrid';
import Footer from '@/components/Footer';
import NewsletterForm from '@/components/NewsletterForm';
import dynamic from 'next/dynamic';

const MoonPhase = dynamic(() => import('@/app/components/MoonPhaseServer'), { ssr: false });

// ISR - Revalidate every 60 seconds
export const revalidate = 60;

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  const domain = process.env.DOMAIN || 'localhost:3000';
  
  return {
    title: 'Astrolog Dilek Alkan Kara - Gökyüzünün Sırlarını Keşfedin',
    description: 'Gökyüzünün sırlarını keşfedin, geleceğinizi aydınlatın. Burç yorumları, astroloji danışmanlığı ve günlük horoskoplar.',
    alternates: {
      canonical: `https://${domain}`,
    },
    openGraph: {
      title: 'Astrolog Dilek Alkan Kara - Gökyüzünün Sırlarını Keşfedin',
      description: 'Gökyüzünün sırlarını keşfedin, geleceğinizi aydınlatın. Burç yorumları, astroloji danışmanlığı ve günlük horoskoplar.',
      type: 'website',
      url: `https://${domain}`,
      images: [
        {
          url: `https://${domain}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: 'Astrolog Dilek Alkan Kara',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Astrolog Dilek Alkan Kara - Gökyüzünün Sırlarını Keşfedin',
      description: 'Gökyüzünün sırlarını keşfedin, geleceğinizi aydınlatın. Burç yorumları, astroloji danışmanlığı ve günlük horoskoplar.',
      images: [`https://${domain}/og-image.jpg`],
    },
  };
}

async function getData() {
  const today = new Date();
  const weeklyEvent = await prisma.event.findFirst({
    where: { date: { gte: today }, type: { not: "retro-end" } },
    orderBy: { date: 'asc' }
  });
  const reels = await prisma.reel.findMany({
    take: 6,
    orderBy: { createdAt: 'desc' },
  });
  return { weeklyEvent, reels };
}

export default async function Page() {
  const { weeklyEvent, reels } = await getData();

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-purple-50 dark:from-black dark:via-gray-950 dark:to-purple-950 font-sans">
      {/* Hero Section */}
      <section className="min-h-[80vh] flex items-center py-20 px-4 bg-gradient-to-br from-purple-50 via-blue-50 to-white dark:from-purple-950 dark:via-gray-950 dark:to-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          {/* Left: Text Content */}
          <div className="flex-1 flex flex-col items-start text-center md:text-left animate-fadein">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent tracking-tight leading-tight">
              Gökyüzünün Sırlarını Keşfedin
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-700 dark:text-gray-200 max-w-2xl leading-relaxed">
              Astroloji ile kendinizi tanıyın, geleceğinizi aydınlatın ve hayatınızın en güzel versiyonunu yaşayın
            </p>
            <button className="w-full md:w-auto px-12 py-5 rounded-full text-xl font-bold shadow-2xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/30 mb-8">
              Randevu Al
            </button>
            
            {/* Social Links */}
            <div className="flex items-center gap-6 text-primary dark:text-primary">
              <a href="https://instagram.com" target="_blank" rel="noopener" className="hover:text-accent transition-colors">
                <Instagram className="w-8 h-8" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener" className="hover:text-accent transition-colors">
                <Youtube className="w-8 h-8" />
              </a>
              <a href="mailto:info@dilekalkankara.com" className="hover:text-accent transition-colors">
                <Mail className="w-8 h-8" />
              </a>
            </div>
          </div>
          
          {/* Right: Portrait */}
          <div className="flex-1 flex items-center justify-center w-full md:w-auto">
            <div className="relative">
              <div className="w-80 h-96 md:w-96 md:h-[500px] rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 shadow-2xl flex items-center justify-center border border-primary/30">
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-4 flex items-center justify-center text-white font-serif text-4xl font-bold">
                    D
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Portrait Placeholder</p>
                </div>
              </div>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                <p className="font-serif text-lg text-primary dark:text-primary font-medium">
                  Dilek Alkan Kara
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Moon Phase Calendar */}
      <section className="py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <MoonPhase />
        </div>
      </section>

      {/* Weekly Sky Section */}
      <section className="py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-3xl shadow-2xl bg-white/95 dark:bg-gray-900/90 p-10 border border-primary/20 dark:border-primary/30 flex flex-col gap-6 items-start animate-fadein">
            <div className="flex items-center gap-4 mb-2">
              <Star className="w-10 h-10 text-primary" />
              <h2 className="text-4xl font-serif font-bold text-gray-900 dark:text-white">Haftanın Gökyüzü</h2>
            </div>
            {weeklyEvent ? (
              <div className="space-y-4 w-full">
                <div className="flex items-center gap-3 text-primary">
                  <Calendar className="w-6 h-6" />
                  <span className="font-semibold text-lg">
                    {new Date(weeklyEvent.date).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
                  {weeklyEvent.title}
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  {weeklyEvent.description}
                </p>
                <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-base font-medium">
                  {weeklyEvent.type}
                </span>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                Bu hafta için özel bir gökyüzü olayı bulunmuyor.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950 dark:to-purple-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-6">
            📅 2025 Astro Takvimi
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            E-posta bültenimize kaydolun ve 2025 Astro Takvimi PDF'ini ücretsiz indirin!
          </p>
          <div className="flex justify-center">
            <NewsletterForm />
          </div>
        </div>
      </section>

      {/* Reels Carousel */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Instagram className="w-10 h-10 text-primary" />
              <h2 className="text-4xl font-serif font-bold text-gray-900 dark:text-white">Son Reeller</h2>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Instagram'da paylaştığımız en son astroloji içeriklerini keşfedin
            </p>
          </div>
          <HomeReelGrid reels={reels} />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
