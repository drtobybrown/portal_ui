'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Monitor,
  HardDrive,
  Cpu,
  Settings,
  ChevronLeft,
  ChevronRight,
  BarChart3,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { CanfarLogo } from '@/components/ui/canfar-logo'

const navigationItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'My Sessions', href: '/sessions', icon: Monitor },
  { name: 'Data & Storage', href: '/storage', icon: HardDrive },
  { name: 'Batch Processing', href: '/batch', icon: Cpu },
  { name: 'Metrics', href: '/metrics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

interface SidebarProps {
  collapsed?: boolean
  onToggle?: () => void
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col bg-secondary transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          {collapsed ? (
            <CanfarLogo variant="icon" className="h-8 w-8" />
          ) : (
            <CanfarLogo variant="full" className="h-7 w-auto" />
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigationItems.map(item => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white',
                collapsed && 'justify-center px-2'
              )}
            >
              <div className="relative">
                {isActive && (
                  <div className="absolute -left-5 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-accent" />
                )}
                <Icon
                  className={cn(
                    'h-5 w-5 flex-shrink-0 transition-colors',
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                  )}
                  aria-hidden="true"
                />
              </div>
              {!collapsed && <span>{item.name}</span>}
              {collapsed && <span className="sr-only">{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-white/10 p-2">
        <button
          onClick={onToggle}
          className="flex w-full items-center justify-center rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          ) : (
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Footer */}
      {!collapsed && (
        <div className="border-t border-white/10 p-4">
          <p className="text-xs text-gray-400">Science Portal</p>
          <p className="text-xs text-gray-500">v2.0.0</p>
        </div>
      )}
    </aside>
  )
}
