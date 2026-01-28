'use client'

import * as React from 'react'
import {
  GreetingCard,
  ComputeResourceCard,
  StorageResourceCard,
  ActiveSessions,
  QuickActions,
  ResourceHistory,
} from '@/components/dashboard'
import { SessionLauncher } from '@/components/session-launcher/launcher-modal'

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

      {/* Resource Overview */}
      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-gray-500">
          Resource Overview
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <ComputeResourceCard />
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
