'use client'

import * as React from 'react'
import { RefreshCw, Clock, Server, Activity, Zap, Database, Network, Timer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LineChart, BarChart, GrafanaPanel } from '@/components/ui/chart'
import { platformMetrics, jobPerformanceMetrics } from '@/lib/dummy-data'
import { cn } from '@/lib/utils'

type TabType = 'platform' | 'jobs'

export default function MetricsPage() {
  const [activeTab, setActiveTab] = React.useState<TabType>('platform')
  const [timeRange, setTimeRange] = React.useState('24h')
  const [lastRefresh, setLastRefresh] = React.useState(new Date())

  const handleRefresh = () => {
    setLastRefresh(new Date())
    // In a real app, this would refetch data from Prometheus/Grafana
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-secondary">Metrics & Monitoring</h1>
          <p className="text-sm text-gray-500">
            Platform resource usage and job performance metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Time range selector */}
          <div className="flex items-center gap-1 rounded-lg border bg-white p-1">
            {['1h', '6h', '24h', '7d'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  'rounded-md px-3 py-1 text-sm font-medium transition-colors',
                  timeRange === range ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Refresh button */}
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Last updated */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Clock className="h-3 w-3" aria-hidden="true" />
        Last updated: {lastRefresh.toLocaleTimeString()}
        <Badge variant="success" className="ml-2">
          Live
        </Badge>
      </div>

      {/* Tab navigation */}
      <div className="border-b" role="tablist" aria-label="Metrics categories">
        <div className="flex gap-1">
          <button
            role="tab"
            aria-selected={activeTab === 'platform'}
            aria-controls="platform-panel"
            id="platform-tab"
            onClick={() => setActiveTab('platform')}
            className={cn(
              'relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors',
              activeTab === 'platform' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'
            )}
          >
            <Server className="h-4 w-4" aria-hidden="true" />
            Platform Resources
            {activeTab === 'platform' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'jobs'}
            aria-controls="jobs-panel"
            id="jobs-tab"
            onClick={() => setActiveTab('jobs')}
            className={cn(
              'relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors',
              activeTab === 'jobs' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'
            )}
          >
            <Zap className="h-4 w-4" aria-hidden="true" />
            Job Performance
            {activeTab === 'jobs' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        role="tabpanel"
        id={activeTab === 'platform' ? 'platform-panel' : 'jobs-panel'}
        aria-labelledby={activeTab === 'platform' ? 'platform-tab' : 'jobs-tab'}
      >
        {activeTab === 'platform' ? <PlatformMetrics /> : <JobPerformanceMetrics />}
      </div>
    </div>
  )
}

function PlatformMetrics() {
  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Server}
          label="Active Nodes"
          value="6"
          subtext="of 8 total"
          color="primary"
        />
        <StatCard
          icon={Activity}
          label="Avg CPU Usage"
          value="60.5%"
          subtext="+5.2% from yesterday"
          color="blue"
        />
        <StatCard
          icon={Database}
          label="Storage Used"
          value="4.7 PB"
          subtext="of 12.2 PB total"
          color="amber"
        />
        <StatCard
          icon={Network}
          label="Network I/O"
          value="430 MB/s"
          subtext="avg throughput"
          color="green"
        />
      </div>

      {/* Charts row 1 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <GrafanaPanel title="CPU Usage by Node" subtitle="Current utilization %">
          <BarChart data={platformMetrics.nodesCpuUsage} color="#005493" horizontal />
        </GrafanaPanel>

        <GrafanaPanel title="Memory Usage by Node" subtitle="Current utilization %">
          <BarChart data={platformMetrics.nodesMemoryUsage} color="#F5AA1C" horizontal />
        </GrafanaPanel>
      </div>

      {/* Charts row 2 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <GrafanaPanel title="Active Sessions" subtitle="Last 24 hours">
          <LineChart
            data={platformMetrics.activeSessionsHistory}
            color="#005493"
            height={160}
            showArea
          />
        </GrafanaPanel>

        <GrafanaPanel title="Job Queue Depth" subtitle="Last 24 hours">
          <LineChart data={platformMetrics.jobQueueHistory} color="#22c55e" height={160} showArea />
        </GrafanaPanel>
      </div>

      {/* Charts row 3 - I/O */}
      <div className="grid gap-4 lg:grid-cols-2">
        <GrafanaPanel title="Network I/O" subtitle="MB/s">
          <div className="space-y-4">
            <LineChart
              data={platformMetrics.networkInHistory}
              color="#3b82f6"
              height={100}
              label="Inbound"
              unit=" MB/s"
            />
            <LineChart
              data={platformMetrics.networkOutHistory}
              color="#8b5cf6"
              height={100}
              label="Outbound"
              unit=" MB/s"
            />
          </div>
        </GrafanaPanel>

        <GrafanaPanel title="Storage I/O" subtitle="MB/s">
          <div className="space-y-4">
            <LineChart
              data={platformMetrics.storageReadHistory}
              color="#22c55e"
              height={100}
              label="Read"
              unit=" MB/s"
            />
            <LineChart
              data={platformMetrics.storageWriteHistory}
              color="#f59e0b"
              height={100}
              label="Write"
              unit=" MB/s"
            />
          </div>
        </GrafanaPanel>
      </div>
    </div>
  )
}

function JobPerformanceMetrics() {
  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Zap}
          label="Jobs Today"
          value="127"
          subtext="23 currently running"
          color="primary"
        />
        <StatCard
          icon={Activity}
          label="Success Rate"
          value="94.2%"
          subtext="last 24 hours"
          color="green"
        />
        <StatCard
          icon={Timer}
          label="Avg Duration"
          value="45 min"
          subtext="-8 min from last week"
          color="blue"
        />
        <StatCard
          icon={Clock}
          label="Queue Wait"
          value="12 min"
          subtext="average wait time"
          color="amber"
        />
      </div>

      {/* Charts row 1 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <GrafanaPanel title="CPU Hours by Project" subtitle="Last 7 days">
          <BarChart data={jobPerformanceMetrics.cpuHoursByProject} color="#005493" horizontal />
        </GrafanaPanel>

        <GrafanaPanel title="Jobs Completed" subtitle="Last 24 hours">
          <LineChart
            data={jobPerformanceMetrics.jobsCompletedHistory}
            color="#22c55e"
            height={160}
            showArea
          />
        </GrafanaPanel>
      </div>

      {/* Charts row 2 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <GrafanaPanel title="Job Success Rate" subtitle="% successful">
          <LineChart
            data={jobPerformanceMetrics.jobSuccessRate}
            color="#005493"
            height={160}
            showArea
          />
        </GrafanaPanel>

        <GrafanaPanel title="Average Job Duration" subtitle="Minutes">
          <LineChart
            data={jobPerformanceMetrics.avgJobDuration}
            color="#F5AA1C"
            height={160}
            showArea
          />
        </GrafanaPanel>
      </div>

      {/* Queue wait time */}
      <GrafanaPanel title="Queue Wait Time" subtitle="Average minutes in queue before execution">
        <LineChart
          data={jobPerformanceMetrics.queueWaitTime}
          color="#8b5cf6"
          height={160}
          showArea
        />
      </GrafanaPanel>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  color,
}: {
  icon: React.ElementType
  label: string
  value: string
  subtext: string
  color: 'primary' | 'blue' | 'amber' | 'green'
}) {
  const colorClasses = {
    primary: 'bg-primary-light text-primary',
    blue: 'bg-blue-100 text-blue-600',
    amber: 'bg-amber-100 text-amber-600',
    green: 'bg-green-100 text-green-600',
  }

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={cn('rounded-lg p-2', colorClasses[color])}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-semibold text-secondary">{value}</p>
          <p className="text-xs text-gray-400">{subtext}</p>
        </div>
      </div>
    </div>
  )
}
