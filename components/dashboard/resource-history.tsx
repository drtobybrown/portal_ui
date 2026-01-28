'use client'

import * as React from 'react'
import { Activity, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart } from '@/components/ui/chart'
import { cpuUsageHistory, ramUsageHistory } from '@/lib/dummy-data'

export function ResourceHistory() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-purple-100 p-2">
            <Activity className="h-4 w-4 text-purple-600" />
          </div>
          <CardTitle className="text-base">Resource Usage (24h)</CardTitle>
        </div>
        <button className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
          <RefreshCw className="h-4 w-4" />
        </button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="min-h-[160px]">
            <LineChart
              data={cpuUsageHistory}
              color="#005493"
              height={130}
              label="CPU Usage"
              unit="%"
              showArea
            />
          </div>
          <div className="min-h-[160px]">
            <LineChart
              data={ramUsageHistory}
              color="#F5AA1C"
              height={130}
              label="Memory Usage"
              unit="%"
              showArea
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
