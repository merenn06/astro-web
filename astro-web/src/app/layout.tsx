import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import NavBar from '@/components/NavBar'
import ToasterProvider from '@/components/ToasterProvider'

const inter = Inter({ subsets: ['latin'] })
const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'Astrolog Dilek Alkan Kara',
  description: 'Gökyüzünün sırlarını keşfedin, geleceğinizi aydınlatın',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} ${playfair.variable}`}>
        <NavBar />
        {children}
        <ToasterProvider />
      </body>
    </html>
  )
}
