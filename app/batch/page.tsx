'use client'

import * as React from 'react'
import { Cpu, Plus, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { recentJobs } from '@/lib/dummy-data'
import { cn } from '@/lib/utils'

const statusConfig = {
  completed: {
    icon: CheckCircle2,
    color: 'text-green-500',
    badge: 'success' as const,
  },
  running: {
    icon: Loader2,
    color: 'text-primary',
    badge: 'secondary' as const,
  },
  queued: {
    icon: Clock,
    color: 'text-amber-500',
    badge: 'warning' as const,
  },
  failed: {
    icon: AlertCircle,
    color: 'text-red-500',
    badge: 'error' as const,
  },
}

export default function BatchPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-secondary">Batch Processing</h1>
          <p className="text-sm text-gray-500">Submit and monitor batch processing jobs</p>
        </div>
        <Button variant="primary">
          <Plus className="mr-2 h-4 w-4" />
          Submit Job
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Running</p>
                <p className="text-2xl font-semibold text-secondary">2</p>
              </div>
              <div className="rounded-full bg-primary-light p-3">
                <Loader2 className="h-5 w-5 text-primary animate-spin" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Queued</p>
                <p className="text-2xl font-semibold text-secondary">5</p>
              </div>
              <div className="rounded-full bg-amber-100 p-3">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed Today</p>
                <p className="text-2xl font-semibold text-secondary">12</p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">CPU Hours Used</p>
                <p className="text-2xl font-semibold text-secondary">48.2</p>
              </div>
              <div className="rounded-full bg-gray-100 p-3">
                <Cpu className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <div className="grid grid-cols-12 gap-4 border-b bg-gray-50 px-4 py-2 text-xs font-medium uppercase text-gray-500">
              <div className="col-span-4">Job Name</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Started</div>
              <div className="col-span-2">Completed</div>
              <div className="col-span-2">CPU Hours</div>
            </div>
            {recentJobs.map(job => {
              const config = statusConfig[job.status]
              const Icon = config.icon

              return (
                <div
                  key={job.id}
                  className="grid grid-cols-12 gap-4 border-b px-4 py-3 text-sm last:border-0 hover:bg-gray-50"
                >
                  <div className="col-span-4 font-medium text-secondary">{job.name}</div>
                  <div className="col-span-2">
                    <Badge variant={config.badge} className="gap-1">
                      <Icon className={cn('h-3 w-3', job.status === 'running' && 'animate-spin')} />
                      {job.status}
                    </Badge>
                  </div>
                  <div className="col-span-2 text-gray-500">{job.startedAt || '-'}</div>
                  <div className="col-span-2 text-gray-500">{job.completedAt || '-'}</div>
                  <div className="col-span-2 text-gray-500">
                    {job.cpuHours > 0 ? `${job.cpuHours} hrs` : '-'}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
