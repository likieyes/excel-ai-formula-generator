import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'
import StructuredData from '@/components/StructuredData'
import GoogleAnalytics from '@/components/GoogleAnalytics'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: 'Free Excel AI Formula Generator - No Signup (Instant)',
  description: 'The best free AI tool to write Excel formulas. Convert English to Excel formulas, VLOOKUP, IF functions, and Google Sheets scripts instantly.',
  keywords: [
    'excel formula generator',
    'ai excel formulas',
    'vlookup generator',
    'if function generator',
    'google sheets formula',
    'excel ai',
    'free formula generator',
    'spreadsheet formulas',
    'excel formula builder',
    'google sheets ai'
  ].join(', '),
  authors: [{ name: 'AI Excel Formula' }],
  creator: 'AI Excel Formula',
  publisher: 'AI Excel Formula',
  robots: 'index, follow',
  openGraph: {
    title: 'Free Excel AI Formula Generator - No Signup (Instant)',
    description: 'The best free AI tool to write Excel formulas. Convert English to Excel formulas, VLOOKUP, IF functions, and Google Sheets scripts instantly.',
    url: 'https://www.aiexcelformula.com',
    siteName: 'AI Excel Formula',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://www.aiexcelformula.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Excel AI Formula Generator - Free Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Excel AI Formula Generator - No Signup (Instant)',
    description: 'The best free AI tool to write Excel formulas. Convert English to Excel formulas, VLOOKUP, IF functions, and Google Sheets scripts instantly.',
    creator: '@aiexcelformula',
    images: ['https://www.aiexcelformula.com/og-image.png'],
  },
  alternates: {
    canonical: 'https://www.aiexcelformula.com',
  },
  category: 'Business Tools',
  classification: 'Business Application',
  other: {
    'google-site-verification': 'bxK02cKDc_T8P7zHbjBKPDXzyph0hVTOSpJk',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://api.openai.com" />
      </head>
      <body className={inter.className}>
        <GoogleAnalytics />
        {children}
        <Analytics />
      </body>
    </html>
  )
}