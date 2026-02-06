'use client'

import * as React from 'react'
import { Plus, Search, Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { activeSessions } from '@/lib/dummy-data'
import { cn } from '@/lib/utils'

const typeColors: Record<string, string> = {
  Jupyter: 'bg-orange-100 text-orange-700',
  CARTA: 'bg-purple-100 text-purple-700',
  Desktop: 'bg-blue-100 text-blue-700',
}

export default function SessionsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-secondary">My Sessions</h1>
          <p className="text-sm text-gray-500">
            Manage your active and recent interactive sessions
          </p>
        </div>
        <Button variant="primary">
          <Plus className="mr-2 h-4 w-4" />
          New Session
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search sessions..."
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Sessions Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {activeSessions.map(session => (
          <Card key={session.id} className="group">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'h-2.5 w-2.5 rounded-full',
                      session.status === 'running' ? 'bg-green-500' : 'bg-gray-400'
                    )}
                  />
                  <CardTitle className="text-base">{session.name}</CardTitle>
                </div>
                <Badge className={typeColors[session.type]}>{session.type}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex justify-between">
                  <span>Project</span>
                  <span className="font-medium text-gray-700">{session.project}</span>
                </div>
                <div className="flex justify-between">
                  <span>Resources</span>
                  <span className="font-medium text-gray-700">
                    {session.cpu} CPU, {session.ram} GB
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Started</span>
                  <span className="font-medium text-gray-700">{session.startedAt}</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="primary" size="sm" className="flex-1">
                  Connect
                </Button>
                <Button variant="outline" size="sm">
                  Stop
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
