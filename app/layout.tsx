import * as React from 'react'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { LayoutProvider } from '@/components/layout/layout-provider'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'CANFAR Science Portal',
    template: '%s | CANFAR Science Portal',
  },
  description:
    'Cloud ecosystem for astronomy - Jupyter sessions, batch processing, and VOSpace storage',
  keywords: ['CANFAR', 'astronomy', 'cloud computing', 'Jupyter', 'CARTA', 'science platform'],
  authors: [{ name: 'Canadian Astronomy Data Centre' }],
  creator: 'CANFAR',
  publisher: 'Canadian Astronomy Data Centre',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    siteName: 'CANFAR Science Portal',
    title: 'CANFAR Science Portal',
    description: 'Cloud ecosystem for astronomy',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#005493',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${inter.className} bg-gray-50 antialiased`}>
        <LayoutProvider>{children}</LayoutProvider>
      </body>
    </html>
  )
}
