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
<<<<<<< HEAD
    <html lang="en">
      <body className={cn(inter.className, 'bg-gray-900 text-gray-100')}>
        {/* Sidebar */}
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Mobile overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Header */}
        <Header
          sidebarCollapsed={sidebarCollapsed}
          onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        {/* Main content */}
        <main
          className={cn(
            'min-h-screen pt-16 transition-all duration-300',
            sidebarCollapsed ? 'pl-16' : 'pl-60'
          )}
        >
          <div className="mx-auto max-w-7xl p-6">
            {children}
          </div>
        </main>
=======
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${inter.className} bg-gray-50 antialiased`}>
        <LayoutProvider>{children}</LayoutProvider>
>>>>>>> origin/main
      </body>
    </html>
  )
}
