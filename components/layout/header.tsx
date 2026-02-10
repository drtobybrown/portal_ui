'use client'

import * as React from 'react'
import { Search, Bell, ChevronDown, Menu, User, Command } from 'lucide-react'
import { cn } from '@/lib/utils'
import { userData } from '@/lib/dummy-data'
import { CommandPalette } from '@/components/ui/command-palette'

interface HeaderProps {
  onMenuClick?: () => void
  sidebarCollapsed?: boolean
}

export function Header({ onMenuClick, sidebarCollapsed = false }: HeaderProps) {
  const [searchFocused, setSearchFocused] = React.useState(false)
  const [paletteOpen, setPaletteOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setPaletteOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <header
      className={cn(
        'fixed right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-gray-800 bg-gray-950 px-6 transition-all duration-300 backdrop-blur-md bg-opacity-90',
        sidebarCollapsed ? 'left-16' : 'left-60'
      )}
    >
      <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} />
      {/* Left section */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search */}
        <div className="relative">
          <div
            className={cn(
              'flex items-center gap-2 rounded-lg border bg-gray-800 px-3 py-2 transition-all duration-200 shadow-inner',
              searchFocused
                ? 'border-primary bg-gray-900 ring-2 ring-primary/20'
                : 'border-gray-700 hover:bg-gray-800'
            )}
          >
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search datasets or commands..."
              className="w-64 bg-transparent text-sm text-gray-300 placeholder-gray-500 outline-none"
              onFocus={() => {
                setSearchFocused(true)
                setPaletteOpen(true)
              }}
              onBlur={() => setSearchFocused(false)}
            />
            <kbd className="hidden rounded bg-gray-800 px-1.5 py-0.5 text-[10px] font-mono text-gray-500 md:block border border-gray-700 shadow-sm">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-accent" />
        </button>

        {/* User menu */}
        <button className="flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-gray-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-white shadow-lg shadow-primary/20">
            {userData.name.split(' ').pop()?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
          </div>
          <div className="hidden text-left md:block">
            <p className="text-sm font-medium text-gray-200">{userData.name}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-tight">{userData.email}</p>
          </div>
          <ChevronDown className="hidden h-4 w-4 text-gray-600 md:block" />
        </button>
      </div>
    </header>
  )
}
