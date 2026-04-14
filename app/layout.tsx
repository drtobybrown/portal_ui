import * as React from 'react'
import type { Metadata, Viewport } from 'next'
import { Noto_Sans } from 'next/font/google'
import './globals.css'
import { LayoutProvider } from '@/components/layout/layout-provider'

const notoSans = Noto_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-sans',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'SRCNet Gateway',
    template: '%s | SRCNet Gateway',
  },
  description:
    'SKA Regional Centre Network Gateway — Data staging, compute sessions, and distributed science platform for SKA Observatory',
  keywords: [
    'SKA',
    'SKAO',
    'SRCNet',
    'SRC',
    'radio astronomy',
    'science platform',
    'data staging',
    'Jupyter',
    'CARTA',
  ],
  authors: [{ name: 'SKA Observatory' }],
  creator: 'SKAO',
  publisher: 'SKA Observatory',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'SRCNet Gateway',
    title: 'SRCNet Gateway',
    description: 'SKA Regional Centre Network — Distributed science platform',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#070068',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={notoSans.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${notoSans.className} bg-gray-50 antialiased`}>
        <LayoutProvider>{children}</LayoutProvider>
      </body>
    </html>
  )
}
