'use client'

import * as React from 'react'
import {
  GreetingCard,
  StorageResourceCard,
  ActiveSessions,
  QuickActions,
  ResourceHistory,
} from '@/components/dashboard'
import { SessionLauncher } from '@/components/session-launcher/launcher-modal'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  Database,
  Download,
  CheckCircle2,
  Clock,
  Loader2,
} from 'lucide-react'
import { dataStagingRequests, srcSites } from '@/lib/dummy-data'
import Link from 'next/link'

export default function DashboardPage() {
  const [launcherOpen, setLauncherOpen] = React.useState(false)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Greeting */}
      <GreetingCard />

      {/* Quick Actions */}
      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-gray-500">
          Quick Actions
        </h2>
        <QuickActions onStartSession={() => setLauncherOpen(true)} />
      </section>

      {/* SRC Network Overview */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wider text-gray-500">
            SRC Network Status
          </h2>
          <Link href="/sites">
            <Button variant="ghost" size="sm" className="gap-1 text-xs">
              View All Sites <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {srcSites.slice(0, 4).map(site => (
            <Card key={site.id} className="hover:shadow-card-hover transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{site.flag}</span>
                    <span className="text-sm font-medium text-gray-900">{site.name}</span>
                  </div>
                  <div className={`h-2 w-2 rounded-full ${site.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">CPU</span>
                    <span className="text-gray-700">
                      {Math.round(((site.cpuTotal - site.cpuAvailable) / site.cpuTotal) * 100)}%
                    </span>
                  </div>
                  <Progress
                    value={((site.cpuTotal - site.cpuAvailable) / site.cpuTotal) * 100}
                    className="h-1.5"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Data Staging Activity */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wider text-gray-500">
            Data Staging Activity
          </h2>
          <Link href="/archive">
            <Button variant="ghost" size="sm" className="gap-1 text-xs">
              Browse Archive <Database className="h-3 w-3" />
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="p-0">
            {dataStagingRequests.length === 0 ? (
              <div className="py-8 text-center">
                <Download className="mx-auto h-10 w-10 text-gray-300" />
                <p className="mt-2 text-sm text-gray-500">No active staging requests</p>
              </div>
            ) : (
              <div className="divide-y">
                {dataStagingRequests.map(req => (
                  <div key={req.id} className="flex items-center gap-4 px-4 py-3">
                    <div className="flex-shrink-0">
                      {req.status === 'completed' ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : req.status === 'in_progress' ? (
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      ) : (
                        <Clock className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {req.target}
                        </span>
                        <Badge variant="default" className="text-xs">
                          {req.size}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        {req.fromSite}
                        <ArrowRight className="h-3 w-3" />
                        {req.toSite}
                      </p>
                    </div>
                    <div className="flex-shrink-0 w-24">
                      {req.status === 'in_progress' ? (
                        <div>
                          <Progress value={req.progress} className="h-1.5" />
                          <p className="mt-1 text-xs text-gray-500 text-right">{req.progress}%</p>
                        </div>
                      ) : (
                        <Badge
                          variant={req.status === 'completed' ? 'success' : 'default'}
                          className="text-xs"
                        >
                          {req.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Resource Overview */}
      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-gray-500">
          Resource Overview
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <StorageResourceCard />
        </div>
      </section>

      {/* Resource History Chart */}
      <section>
        <ResourceHistory />
      </section>

      {/* Active Sessions */}
      <section>
        <ActiveSessions />
      </section>

      {/* Session Launcher Modal */}
      <SessionLauncher open={launcherOpen} onClose={() => setLauncherOpen(false)} />
    </div>
  )
}
