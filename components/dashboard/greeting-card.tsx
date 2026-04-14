'use client'

import * as React from 'react'
import { Activity, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { getGreeting } from '@/lib/utils'
import { userData, systemStatus } from '@/lib/dummy-data'

export function GreetingCard() {
  const [greeting, setGreeting] = React.useState('Good morning')

  React.useEffect(() => {
    setGreeting(getGreeting())
  }, [])

  return (
    <Card className="border-none bg-gradient-to-r from-secondary to-primary shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">
              {greeting}, {userData.name}
            </h1>
            <p className="mt-1 text-sm text-white/70">Welcome back to the CANFAR Science Portal</p>
          </div>

          {/* System status */}
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur-sm">
            {systemStatus.overall === 'nominal' ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span className="text-sm font-medium text-white">System Nominal</span>
              </>
            ) : (
              <>
                <Activity className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-medium text-white">Degraded Performance</span>
              </>
            )}
          </div>
        </div>

        {/* Quick stats */}
        <div className="mt-4 flex gap-6 text-sm text-white/80">
          <div>
            <span className="font-medium text-white">3</span> active sessions
          </div>
          <div>
            <span className="font-medium text-white">2</span> jobs running
          </div>
          <div>
            <span className="font-medium text-white">25%</span> storage used
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
