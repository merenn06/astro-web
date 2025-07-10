import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import NavBar from '@/components/NavBar'
import ToasterProvider from '@/components/ToasterProvider'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})
const playfair = Playfair_Display({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: {
    default: 'Astrolog Dilek Alkan Kara - Gökyüzünün Sırlarını Keşfedin',
    template: '%s | Astrolog Dilek Alkan Kara'
  },
  description: 'Gökyüzünün sırlarını keşfedin, geleceğinizi aydınlatın. Burç yorumları, astroloji danışmanlığı ve günlük horoskoplar.',
  keywords: ['astroloji', 'burç yorumları', 'horoskop', 'astrolog', 'danışmanlık', 'zodyak'],
  authors: [{ name: 'Dilek Alkan Kara' }],
  creator: 'Dilek Alkan Kara',
  publisher: 'Astrolog Dilek Alkan Kara',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.DOMAIN || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: '/',
    title: 'Astrolog Dilek Alkan Kara - Gökyüzünün Sırlarını Keşfedin',
    description: 'Gökyüzünün sırlarını keşfedin, geleceğinizi aydınlatın. Burç yorumları, astroloji danışmanlığı ve günlük horoskoplar.',
    siteName: 'Astrolog Dilek Alkan Kara',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Astrolog Dilek Alkan Kara',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Astrolog Dilek Alkan Kara - Gökyüzünün Sırlarını Keşfedin',
    description: 'Gökyüzünün sırlarını keşfedin, geleceğinizi aydınlatın. Burç yorumları, astroloji danışmanlığı ve günlük horoskoplar.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const domain = process.env.DOMAIN || 'localhost:3000';
  
  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Astrolog Dilek Alkan Kara",
    "url": `https://${domain}`,
    "logo": `https://${domain}/logo.png`,
    "description": "Gökyüzünün sırlarını keşfedin, geleceğinizi aydınlatın",
    "sameAs": [
      "https://instagram.com/astrologdilekalkan",
      "https://facebook.com/astrologdilekalkan"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": "Turkish"
    }
  };

  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#1a1a1a" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaOrg),
          }}
        />
      </head>
      <body className={`${inter.className} ${playfair.variable}`}>
        <NavBar />
        {children}
        <ToasterProvider />
      </body>
    </html>
  )
}
