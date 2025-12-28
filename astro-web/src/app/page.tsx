import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { Star, Calendar, Instagram, Mail, Twitter, Youtube, Heart, Sparkles, Moon, Sun } from 'lucide-react';
import Footer from '@/components/Footer';
import NewsletterForm from '@/components/NewsletterForm';
import MoonPhaseServer from '@/app/components/MoonPhaseServer';

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
  return { weeklyEvent };
}

export default async function Page() {
  const { weeklyEvent } = await getData();

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-950 dark:to-blue-950 font-sans">
      {/* Hero Section - Hakkımda */}
      <section className="min-h-screen relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Ribbons */}
          <div className="absolute top-20 left-10 w-16 h-16 text-pink-300/30 animate-pulse">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
            </svg>
          </div>
          <div className="absolute top-40 right-20 w-12 h-12 text-purple-300/40 animate-pulse" style={{animationDelay: '1s'}}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
            </svg>
          </div>
          <div className="absolute bottom-40 left-20 w-14 h-14 text-blue-300/30 animate-pulse" style={{animationDelay: '2s'}}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
            </svg>
          </div>
          <div className="absolute bottom-20 right-10 w-10 h-10 text-pink-300/40 animate-pulse" style={{animationDelay: '0.5s'}}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
            </svg>
          </div>
          
          {/* Gradient Orbs */}
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-pink-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-8">
              {/* Main Title with Ribbon */}
              <div className="relative inline-block">
                <div className="absolute -top-4 -left-4 w-8 h-8 text-pink-400">
                  <Heart className="w-full h-full" />
                </div>
                <div className="absolute -top-4 -right-4 w-8 h-8 text-purple-400">
                  <Sparkles className="w-full h-full" />
                </div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 bg-gradient-to-r from-gray-800 via-purple-700 to-gray-800 bg-clip-text text-transparent tracking-tight leading-tight px-8 py-4">
                  Gökyüzünün Sırlarını Keşfedin
                </h1>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-full"></div>
              </div>

              {/* Subtitle */}
              <p className="text-lg md:text-xl lg:text-2xl mb-8 text-gray-700 dark:text-gray-200 max-w-3xl mx-auto leading-relaxed font-normal">
                Astroloji ile kendinizi tanıyın, geleceğinizi aydınlatın ve hayatınızın en güzel versiyonunu yaşayın
              </p>

              {/* Profile Section */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 mt-12">
                {/* Profile Image */}
                <div className="relative animate-float">
                  <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 shadow-feminine flex items-center justify-center border-4 border-white dark:border-gray-800 relative overflow-hidden hover-lift">
                    <div className="w-40 h-40 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 mx-auto mb-4 flex items-center justify-center text-white font-serif text-3xl md:text-4xl font-bold shadow-lg animate-gradient">
                          D
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating Icons around profile */}
                  <div className="absolute -top-4 -left-4 w-8 h-8 text-pink-400 animate-sparkle">
                    <Moon className="w-full h-full" />
                  </div>
                  <div className="absolute -top-4 -right-4 w-8 h-8 text-purple-400 animate-sparkle" style={{animationDelay: '0.5s'}}>
                    <Sun className="w-full h-full" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-8 h-8 text-blue-400 animate-sparkle" style={{animationDelay: '1s'}}>
                    <Star className="w-full h-full" />
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-8 h-8 text-pink-400 animate-sparkle" style={{animationDelay: '1.5s'}}>
                    <Heart className="w-full h-full" />
                  </div>
                </div>

                {/* Profile Info */}
                <div className="text-center md:text-left space-y-6">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-2">
                      Dilek Alkan Kara
                    </h2>
                    <p className="text-lg md:text-xl text-pink-600 dark:text-pink-400 font-semibold">
                      Profesyonel Astrolog
                    </p>
                  </div>
                  
                  <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-md leading-relaxed font-normal">
                    Gökyüzünün sırlarını çözen, hayatınızın en güzel versiyonunu keşfetmenize yardımcı olan deneyimli astrolog.
                  </p>

                  {/* CTA Button */}
                  <button className="w-full md:w-auto px-8 py-4 rounded-full text-lg font-semibold shadow-feminine bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-pink-300 transform hover:scale-105 hover-lift">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Randevu Al
                    </span>
                  </button>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center justify-center gap-6 text-gray-600 dark:text-gray-300 mt-8">
                <a href="https://instagram.com" target="_blank" rel="noopener" className="p-3 rounded-full bg-white/50 dark:bg-gray-800/50 hover:bg-pink-100 dark:hover:bg-pink-900/30 hover:text-pink-600 dark:hover:text-pink-400 transition-all duration-300 transform hover:scale-110 hover-lift">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener" className="p-3 rounded-full bg-white/50 dark:bg-gray-800/50 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 transform hover:scale-110 hover-lift">
                  <Youtube className="w-6 h-6" />
                </a>
                <a href="mailto:info@dilekalkankara.com" className="p-3 rounded-full bg-white/50 dark:bg-gray-800/50 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 transform hover:scale-110 hover-lift">
                  <Mail className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Moon Phase Calendar */}
      <section className="py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <MoonPhaseServer />
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

      {/* Footer */}
      <Footer />
    </main>
  );
}
