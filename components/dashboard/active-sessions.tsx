'use client'

import * as React from 'react'
import { Monitor, ExternalLink, MoreHorizontal, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { activeSessions } from '@/lib/dummy-data'
import { cn } from '@/lib/utils'

const typeIcons: Record<string, string> = {
  Jupyter: '📓',
  CARTA: '📡',
  Desktop: '🖥️',
}

const typeColors: Record<string, string> = {
  Jupyter: 'bg-orange-100 text-orange-700',
  CARTA: 'bg-purple-100 text-purple-700',
  Desktop: 'bg-blue-100 text-blue-700',
}

export function ActiveSessions() {
  const [menuOpen, setMenuOpen] = React.useState<string | null>(null)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-green-100 p-2">
            <Monitor className="h-4 w-4 text-green-600" aria-hidden="true" />
          </div>
          <CardTitle className="text-base">Active Sessions</CardTitle>
          <Badge variant="success" className="ml-2">
            {activeSessions.length} running
          </Badge>
        </div>
        <Button variant="ghost" size="sm">
          View all
        </Button>
      </CardHeader>
      <CardContent>
        {activeSessions.length === 0 ? (
          <div className="py-8 text-center">
            <Monitor className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
            <p className="mt-2 text-sm text-gray-500">No active sessions</p>
            <Button variant="primary" size="sm" className="mt-4">
              Start a session
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {activeSessions.map(session => (
              <div
                key={session.id}
                className="group flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 p-3 transition-all hover:border-gray-200 hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  {/* Status indicator */}
                  <div className="relative">
                    <div
                      className={cn(
                        'h-2.5 w-2.5 rounded-full',
                        session.status === 'running'
                          ? 'bg-green-500'
                          : session.status === 'pending'
                            ? 'bg-amber-500'
                            : 'bg-gray-400'
                      )}
                    />
                    {session.status === 'running' && (
                      <div className="absolute inset-0 animate-ping rounded-full bg-green-500 opacity-75" />
                    )}
                  </div>

                  {/* Session info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-secondary">{session.name}</span>
                      <Badge className={typeColors[session.type]} variant="default">
                        {typeIcons[session.type]} {session.type}
                      </Badge>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
                      <span>{session.project}</span>
                      <span>•</span>
                      <span>
                        {session.cpu} CPU, {session.ram} GB RAM
                      </span>
                      <span>•</span>
                      <span>Started {session.startedAt}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <ExternalLink className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                    Connect
                  </Button>

                  <div className="relative">
                    <button
                      onClick={() => setMenuOpen(menuOpen === session.id ? null : session.id)}
                      className="rounded-lg p-1.5 text-gray-400 opacity-0 transition-all hover:bg-gray-200 hover:text-gray-600 group-hover:opacity-100"
                      aria-label={`More options for ${session.name}`}
                      aria-haspopup="menu"
                      aria-expanded={menuOpen === session.id}
                    >
                      <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                    </button>

                    {menuOpen === session.id && (
                      <div
                        className="absolute right-0 top-full z-10 mt-1 w-36 rounded-lg border bg-white py-1 shadow-lg"
                        role="menu"
                        aria-label="Session actions"
                      >
                        <button
                          className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                          role="menuitem"
                        >
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                          Open in new tab
                        </button>
                        <button
                          className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-destructive hover:bg-destructive-light"
                          role="menuitem"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                          Terminate
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
