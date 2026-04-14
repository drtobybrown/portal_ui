'use client'

import * as React from 'react'
import {
  Globe,
  Cpu,
  HardDrive,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Signal,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { srcSites } from '@/lib/dummy-data'

export default function SitesPage() {
  const [selectedSite, setSelectedSite] = React.useState<string | null>(null)

  const onlineSites = srcSites.filter(s => s.status === 'online').length
  const totalCpu = srcSites.reduce((sum, s) => sum + s.cpuTotal, 0)
  const totalStorage = srcSites.reduce((sum, s) => sum + s.storageTotal, 0)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">SRC Network</h1>
        <p className="mt-1 text-sm text-gray-500">
          SKA Regional Centre sites providing distributed compute and storage
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
              <Globe className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {onlineSites}/{srcSites.length}
              </p>
              <p className="text-sm text-gray-500">Sites Online</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Cpu className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {(totalCpu / 1000).toFixed(1)}k
              </p>
              <p className="text-sm text-gray-500">Total CPU Cores</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
              <HardDrive className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {(totalStorage / 1000).toFixed(1)} PB
              </p>
              <p className="text-sm text-gray-500">Total Storage</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Site Grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {srcSites.map(site => {
          const cpuUsed = site.cpuTotal - site.cpuAvailable
          const cpuPercent = (cpuUsed / site.cpuTotal) * 100
          const ramUsed = site.ramTotal - site.ramAvailable
          const ramPercent = (ramUsed / site.ramTotal) * 100
          const storagePercent = (site.storageUsed / site.storageTotal) * 100
          const isSelected = selectedSite === site.id

          return (
            <Card
              key={site.id}
              className={cn(
                'cursor-pointer transition-all hover:shadow-card-hover',
                isSelected && 'ring-2 ring-primary shadow-glow-navy'
              )}
              onClick={() => setSelectedSite(isSelected ? null : site.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{site.flag}</span>
                    <div>
                      <CardTitle className="text-base">{site.name}</CardTitle>
                      <p className="text-xs text-gray-500">{site.location}</p>
                    </div>
                  </div>
                  <Badge
                    variant={site.status === 'online' ? 'success' : 'warning'}
                    className="gap-1"
                  >
                    {site.status === 'online' ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <AlertTriangle className="h-3 w-3" />
                    )}
                    {site.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    Provider
                  </span>
                  <span className="font-medium text-gray-700">{site.provider}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Signal className="h-3 w-3" />
                    Latency
                  </span>
                  <span
                    className={cn(
                      'font-medium',
                      site.latency < 50
                        ? 'text-green-600'
                        : site.latency < 150
                          ? 'text-yellow-600'
                          : 'text-orange-600'
                    )}
                  >
                    {site.latency} ms
                  </span>
                </div>

                {/* CPU */}
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-gray-500">CPU</span>
                    <span className="font-medium text-gray-700">
                      {cpuUsed.toLocaleString()} / {site.cpuTotal.toLocaleString()} cores
                    </span>
                  </div>
                  <Progress value={cpuPercent} variant={cpuPercent > 85 ? 'error' : 'default'} />
                </div>

                {/* RAM */}
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-gray-500">RAM</span>
                    <span className="font-medium text-gray-700">
                      {(ramUsed / 1000).toFixed(1)} / {(site.ramTotal / 1000).toFixed(1)} TB
                    </span>
                  </div>
                  <Progress value={ramPercent} variant={ramPercent > 85 ? 'error' : 'default'} />
                </div>

                {/* Storage */}
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-gray-500">Storage</span>
                    <span className="font-medium text-gray-700">
                      {site.storageUsed} / {site.storageTotal} {site.unit}
                    </span>
                  </div>
                  <Progress
                    value={storagePercent}
                    variant={storagePercent > 85 ? 'error' : 'default'}
                  />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
