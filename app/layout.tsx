import type { Metadata } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Inter, Playfair_Display } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-HJ20PZTJNT'

export const metadata: Metadata = {
  title: 'Original Price - 海外通販の現地価格をチェック',
  description: '日本発送対応の海外通販サイトを厳選してご紹介。関税や送料を含めた現地価格に近いお得な情報を届けます。',
  metadataBase: new URL('https://original-price.com'),
  openGraph: {
    title: 'Original Price - 海外通販の現地価格をチェック',
    description: '日本発送対応の海外通販サイトを厳選してご紹介。関税や送料を含めた現地価格に近いお得な情報を届けます。',
    type: 'website',
    url: 'https://original-price.com',
    siteName: 'Original Price',
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  alternates: {
    types: {
      'application/rss+xml': [{ url: 'feed.xml', title: 'Original Price - 最新記事' }],
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        {children}
        <Script 
          src="https://s.skimresources.com/js/156009X1622316.skimlinks.js" 
          strategy="lazyOnload"
        />
        {GA_ID && (
          <GoogleAnalytics gaId={GA_ID} />
        )}
      </body>
    </html>
  )
}
