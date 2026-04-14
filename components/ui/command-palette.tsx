'use client'

import * as React from 'react'
import { Search, File, Terminal, User, Settings, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CommandPaletteProps {
    isOpen: boolean
    onClose: () => void
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
    const [query, setQuery] = React.useState('')

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                if (isOpen) onClose()
                else {
                    // This should be handled by the parent
                }
            }
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, onClose])

    if (!isOpen) return null

    const items = [
        { icon: Terminal, label: 'Run Batch Job...', category: 'Commands', shortcut: 'R' },
        { icon: File, label: 'obs_2026_01_25.parquet', category: 'Recent Data', shortcut: '↵' },
        { icon: Clock, label: 'vlass-analysis:v1.0.2', category: 'Recent Jobs', shortcut: '↵' },
        { icon: User, label: 'Manage Groups', category: 'Collaboration' },
        { icon: Settings, label: 'Settings', category: 'System' },
    ].filter(item => item.label.toLowerCase().includes(query.toLowerCase()))

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Palette */}
            <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
                    <Search className="h-5 w-5 text-gray-400" />
                    <input
                        autoFocus
                        type="text"
                        placeholder="Search datasets, jobs, or run commands..."
                        className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 outline-none text-base"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <Badge className="bg-gray-100 text-gray-500 border border-gray-200 font-mono text-[10px]">ESC</Badge>
                </div>

                <div className="max-h-[60vh] overflow-y-auto py-2">
                    {items.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <p className="text-gray-500">No results found for &quot;{query}&quot;</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {['Commands', 'Recent Data', 'Recent Jobs', 'Collaboration', 'System'].map(category => {
                                const categoryItems = items.filter(i => i.category === category)
                                if (categoryItems.length === 0) return null

                                return (
                                    <div key={category}>
                                        <h3 className="px-4 text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">{category}</h3>
                                        <div className="px-2 space-y-0.5">
                                            {categoryItems.map(item => (
                                                <button
                                                    key={item.label}
                                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
                                                    onClick={() => {
                                                        onClose()
                                                    }}
                                                >
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 group-hover:bg-primary transition-colors">
                                                        <item.icon className="h-4 w-4 text-gray-500 group-hover:text-white" />
                                                    </div>
                                                    <span className="flex-1 font-medium">{item.label}</span>
                                                    {item.shortcut && (
                                                        <span className="text-[10px] font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded uppercase border border-gray-200">{item.shortcut}</span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4 border-t border-gray-200 bg-gray-50 px-4 py-3 text-[10px] text-gray-500 font-mono">
                    <div className="flex items-center gap-1.5">
                        <kbd className="rounded border border-gray-200 bg-white px-1.5 py-0.5 shadow-sm">TAB</kbd> to navigate
                    </div>
                    <div className="flex items-center gap-1.5">
                        <kbd className="rounded border border-gray-200 bg-white px-1.5 py-0.5 shadow-sm">ENTER</kbd> to select
                    </div>
                    <div className="ml-auto text-primary opacity-50 font-bold tracking-tighter">SRCNet Gateway v1.0</div>
                </div>
            </div>
        </div>
    )
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <span className={cn("px-2 py-0.5 rounded text-xs font-medium", className)}>
            {children}
        </span>
    )
}
