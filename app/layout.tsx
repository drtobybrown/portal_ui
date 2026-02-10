'use client'

import * as React from 'react'
import { Inter } from 'next/font/google'
import './globals.css'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  return (
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
      </body>
    </html>
  )
}
