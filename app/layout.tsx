import 'css/tailwind.css'

import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import siteMetadata from '@/data/siteMetadata'
import { getLocale } from '@/lib/i18n-server'
import { ThemeProviders } from './theme-providers'

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: siteMetadata.title,
  description: siteMetadata.description,
  alternates: { canonical: siteMetadata.siteUrl },
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: '/static/favicons/favicon.ico',
    apple: '/static/favicons/apple-touch-icon.png',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <ThemeProviders>
          <div className="site-shell">
            <Header />
            <main id="main-content">{children}</main>
            <Footer />
          </div>
        </ThemeProviders>
      </body>
    </html>
  )
}
