'use client'

import * as React from 'react'
import { Monitor, Plus, Search, Filter, Cpu, Terminal, Clock, CheckCircle2, AlertCircle, Loader2, ChevronDown, ChevronUp, AlertTriangle, Pause, Play, Square, Activity, RefreshCw, Network, Database } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { activeSessions, recentJobs } from '@/lib/dummy-data'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

type Tab = 'interactive' | 'batch' | 'queue'

interface ClusterJob {
    pos: number
    name: string
    id: string
    user: string
    status: 'running' | 'queued'
    nodes: number
    wait: string
}

const typeColors: Record<string, string> = {
    Jupyter: 'bg-orange-100 text-orange-700',
    CARTA: 'bg-purple-100 text-purple-700',
    Desktop: 'bg-blue-100 text-blue-700',
}

const statusConfig = {
    completed: { icon: CheckCircle2, color: 'text-green-500', badge: 'success' as const },
    running: { icon: Loader2, color: 'text-primary', badge: 'secondary' as const },
    queued: { icon: Clock, color: 'text-amber-500', badge: 'warning' as const },
    failed: { icon: AlertCircle, color: 'text-red-500', badge: 'error' as const },
    paused: { icon: Pause, color: 'text-gray-500', badge: 'default' as const },
}

export default function SessionsPage() {
    const [activeTab, setActiveTab] = React.useState<Tab>('interactive')
    const [expandedJob, setExpandedJob] = React.useState<string | null>(null)
    const [selectedJobs, setSelectedJobs] = React.useState<Set<string>>(new Set())
    const [compactMode, setCompactMode] = React.useState(false)
    const router = useRouter()

    const toggleJobExpansion = (id: string) => {
        setExpandedJob(expandedJob === id ? null : id)
    }

    const toggleJobSelection = (id: string) => {
        const newSelected = new Set(selectedJobs)
        if (newSelected.has(id)) {
            newSelected.delete(id)
        } else {
            newSelected.add(id)
        }
        setSelectedJobs(newSelected)
    }

    const toggleAllJobs = () => {
        if (selectedJobs.size === recentJobs.length) {
            setSelectedJobs(new Set())
        } else {
            setSelectedJobs(new Set(recentJobs.map(j => j.id)))
        }
    }

    const isSessionLimitReached = activeSessions.length >= 3;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-secondary">My Workloads</h1>
                    <p className="text-sm text-gray-500">
                        Manage your interactive sessions and batch processing jobs
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant={activeTab === 'interactive' ? 'primary' : 'secondary'} onClick={() => setActiveTab('interactive')}>
                        <Monitor className="mr-2 h-4 w-4" />
                        Interactive
                    </Button>
                    <Button variant={activeTab === 'batch' ? 'primary' : 'secondary'} onClick={() => setActiveTab('batch')}>
                        <Cpu className="mr-2 h-4 w-4" />
                        Batch Jobs
                    </Button>
                    <Button variant={activeTab === 'queue' ? 'primary' : 'secondary'} onClick={() => setActiveTab('queue')}>
                        <Activity className="mr-2 h-4 w-4" />
                        Cluster Queue
                    </Button>
                </div>
            </div>

            {/* Content */}
            {activeTab === 'interactive' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative flex-1 max-w-xs">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search sessions..."
                                    className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {isSessionLimitReached && (
                                <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                                    <AlertTriangle className="h-3.5 w-3.5" />
                                    Session limit reached (3/3)
                                </div>
                            )}
                            <Button variant="primary" disabled={isSessionLimitReached} className={cn(isSessionLimitReached && "opacity-50 cursor-not-allowed")}>
                                <Plus className="mr-2 h-4 w-4" />
                                New Session
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {activeSessions.map((session) => (
                            <Card key={session.id} className="group overflow-hidden transition-all hover:shadow-md">
                                <CardHeader className="bg-gray-50/50 pb-3">
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
                                        <div className="flex items-center gap-2">
                                            <Badge className={typeColors[session.type]}>{session.type}</Badge>
                                            <Button variant="ghost" size="sm" className="h-7 text-[10px] gap-1 px-2 border border-dashed border-gray-200 hover:border-primary hover:text-primary">
                                                Share
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="space-y-3 text-sm text-gray-500">
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Node</span>
                                                <div className="font-medium text-gray-700">{session.nodeId || 'N/A'}</div>
                                            </div>
                                            <div>
                                                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Project</span>
                                                <div className="font-medium text-gray-700">{session.project}</div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-gray-400">CPU Usage</span>
                                                <span className="font-medium text-gray-700">{session.cpu} Cores</span>
                                            </div>
                                            <Progress value={(session.cpu / 8) * 100} className="h-1.5" />

                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-gray-400">RAM Usage</span>
                                                <span className="font-medium text-gray-700">{session.ram} GB</span>
                                            </div>
                                            <Progress value={(session.ram / 32) * 100} className="h-1.5" variant="warning" />

                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-gray-400">GPU Usage</span>
                                                <span className="font-medium text-gray-700">{session.gpu || 0}%</span>
                                            </div>
                                            <Progress value={session.gpu || 0} className="h-1.5" variant="success" />
                                        </div>

                                        <div className="rounded-md bg-gray-50 p-2 text-xs space-y-2">
                                            <div className="flex justify-between items-center pb-1 border-b border-gray-100">
                                                <div className="flex items-center gap-1.5">
                                                    <Network className="h-3 w-3 text-gray-400" />
                                                    <span>Network</span>
                                                </div>
                                                <span className="font-mono text-gray-700">{session.network?.in}↓ {session.network?.out}↑ MB/s</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-1.5">
                                                    <Database className="h-3 w-3 text-gray-400" />
                                                    <span>Scratch</span>
                                                </div>
                                                <span className="font-mono text-gray-700">{session.scratch?.used} / {session.scratch?.quota} GB</span>
                                            </div>
                                        </div>

                                        <div className="bg-blue-50/50 rounded-md p-2 border border-blue-100/50">
                                            <div className="text-[10px] font-semibold text-blue-600 uppercase mb-1">Node Relative Performance</div>
                                            <div className="flex justify-between text-[11px] text-blue-800">
                                                <span>Share of {session.nodeId}</span>
                                                <span>{Math.round((session.cpu / 64) * 100)}% CPU / {Math.round((session.ram / 256) * 100)}% RAM</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center border-t pt-2 mt-2">
                                            <span className="text-xs">Started {session.startedAt}</span>
                                            <span className="text-[10px] text-gray-400 font-mono">{session.nodeId}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex gap-2">
                                        <Button variant="primary" size="sm" className="flex-1">
                                            Connect
                                        </Button>
                                        <Button variant="secondary" size="sm" title="Restart Session">
                                            <RefreshCw className="h-4 w-4" />
                                        </Button>
                                        <Button variant="secondary" size="sm" className="text-destructive hover:text-destructive" title="Stop Session">
                                            <Square className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'batch' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between bg-white rounded-lg border p-4 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light">
                                <Cpu className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-secondary">Batch Processing</h2>
                                <p className="text-sm text-gray-500">You have {recentJobs.filter(j => j.status === 'running').length} jobs currently running</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {selectedJobs.size > 0 && (
                                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
                                    <Button variant="secondary" size="sm" className="gap-1 border-gray-300">
                                        <Pause className="h-3.5 w-3.5" /> Pause
                                    </Button>
                                    <Button variant="secondary" size="sm" className="gap-1 border-gray-300">
                                        <Play className="h-3.5 w-3.5" /> Resume
                                    </Button>
                                    <Button variant="destructive" size="sm">
                                        Cancel {selectedJobs.size} Jobs
                                    </Button>
                                </div>
                            )}
                            <Button
                                variant="secondary"
                                size="sm"
                                className={cn("gap-1.5", compactMode && "bg-primary-light text-primary border-primary/20")}
                                onClick={() => setCompactMode(!compactMode)}
                            >
                                <Activity className="h-3.5 w-3.5" />
                                {compactMode ? 'Standard' : 'Compact'}
                            </Button>
                            <Button variant="secondary" className="gap-2" onClick={() => router.push('/builder')}>
                                <Terminal className="h-4 w-4" />
                                Build Image
                            </Button>
                            <Button variant="primary">
                                <Plus className="mr-2 h-4 w-4" />
                                Submit Job
                            </Button>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Recent Batch Jobs</CardTitle>
                            <CardDescription>Click on a job to view details, logs, and resource usage</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y">
                                <div className={cn("grid grid-cols-12 gap-4 bg-gray-50 px-6 text-xs font-medium uppercase text-gray-500", compactMode ? "py-1.5" : "py-3")}>
                                    <div className="col-span-1 flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                                            checked={selectedJobs.size === recentJobs.length && recentJobs.length > 0}
                                            onChange={toggleAllJobs}
                                        />
                                    </div>
                                    <div className="col-span-3">Job Name</div>
                                    <div className="col-span-2">Status</div>
                                    <div className="col-span-2">Resources</div>
                                    <div className="col-span-2">Time</div>
                                    <div className="col-span-2 text-right">Action</div>
                                </div>
                                {recentJobs.map((job) => {
                                    const config = statusConfig[job.status as keyof typeof statusConfig] || statusConfig.queued
                                    const Icon = config.icon
                                    const isExpanded = expandedJob === job.id

                                    return (
                                        <div key={job.id} className={cn("group transition-colors", selectedJobs.has(job.id) ? "bg-primary-light/30" : "hover:bg-gray-50/50")}>
                                            <div className={cn("grid grid-cols-12 gap-4 px-6 text-sm items-center", compactMode ? "py-2" : "py-4")}>
                                                <div className="col-span-1 flex items-center justify-center">
                                                    <input
                                                        type="checkbox"
                                                        className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                                                        checked={selectedJobs.has(job.id)}
                                                        onChange={() => toggleJobSelection(job.id)}
                                                    />
                                                </div>
                                                <div
                                                    className="col-span-3 font-medium text-secondary cursor-pointer"
                                                    onClick={() => toggleJobExpansion(job.id)}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        {job.name}
                                                        {job.id === 'job-001' && (
                                                            <Badge variant="secondary" className="text-[9px] px-1 h-3.5 bg-blue-50 text-blue-600 border-blue-200 shadow-sm">Shared</Badge>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-gray-400 font-mono mt-1 truncate max-w-[200px]">{job.id}</div>
                                                </div>
                                                <div className="col-span-2" onClick={() => toggleJobExpansion(job.id)}>
                                                    <Badge variant={config.badge} className="gap-1 w-fit">
                                                        <Icon
                                                            className={cn(
                                                                'h-3 w-3',
                                                                job.status === 'running' && 'animate-spin'
                                                            )}
                                                        />
                                                        {job.status}
                                                    </Badge>
                                                </div>
                                                <div className="col-span-2 text-xs text-gray-500 font-mono" onClick={() => toggleJobExpansion(job.id)}>
                                                    {job.resources ? (
                                                        <div className="flex flex-col">
                                                            <span>CPU: {job.resources.cpu}%</span>
                                                            <span>GPU: {job.resources.gpu || 0}%</span>
                                                            <span>RAM: {job.resources.ram}GB</span>
                                                        </div>
                                                    ) : (
                                                        <span>{job.cpuHours > 0 ? `${job.cpuHours} CPU-h` : '-'}</span>
                                                    )}
                                                </div>
                                                <div className="col-span-2 text-gray-500 text-xs" onClick={() => toggleJobExpansion(job.id)}>
                                                    <div>S: {job.startedAt || '-'}</div>
                                                    <div>E: {job.completedAt || '-'}</div>
                                                </div>
                                                <div className="col-span-2 text-right">
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => toggleJobExpansion(job.id)}>
                                                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Expanded Details */}
                                            {isExpanded && (
                                                <div className="px-6 pb-6 pt-0 animate-in slide-in-from-top-2 duration-200 bg-white">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-4">
                                                            {/* Job Actions */}
                                                            {job.status === 'running' && (
                                                                <div className="flex gap-2">
                                                                    <Button variant="secondary" size="sm" className="gap-1">
                                                                        <Pause className="h-3.5 w-3.5" /> Pause
                                                                    </Button>
                                                                    <Button variant="destructive" size="sm" className="gap-1">
                                                                        <Square className="h-3.5 w-3.5" /> Cancel
                                                                    </Button>
                                                                </div>
                                                            )}
                                                            {job.status === 'queued' && (
                                                                <div className="flex gap-2">
                                                                    <Button variant="destructive" size="sm" className="gap-1">
                                                                        <Square className="h-3.5 w-3.5" /> Cancel
                                                                    </Button>
                                                                </div>
                                                            )}
                                                            {(job.status as any) === 'paused' && (
                                                                <div className="flex gap-2">
                                                                    <Button variant="secondary" size="sm" className="gap-1">
                                                                        <Play className="h-3.5 w-3.5" /> Resume
                                                                    </Button>
                                                                    <Button variant="destructive" size="sm" className="gap-1">
                                                                        <Square className="h-3.5 w-3.5" /> Cancel
                                                                    </Button>
                                                                </div>
                                                            )}

                                                            {/* Resource Monitor (Running only) */}
                                                            {job.status === 'running' && job.resources && (
                                                                <div className="rounded-lg border p-4 space-y-3 bg-gray-50">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <Activity className="h-4 w-4 text-blue-500" />
                                                                        <span className="text-sm font-medium">Real-time Usage</span>
                                                                    </div>

                                                                    <div className="space-y-1">
                                                                        <div className="flex justify-between text-xs text-gray-500">
                                                                            <span>CPU Usage</span>
                                                                            <span>{job.resources.cpu}%</span>
                                                                        </div>
                                                                        <Progress value={job.resources.cpu} className="h-1.5" />
                                                                    </div>

                                                                    <div className="space-y-1">
                                                                        <div className="flex justify-between text-xs text-gray-500">
                                                                            <span>RAM Usage</span>
                                                                            <span>{job.resources.ram} GB</span>
                                                                        </div>
                                                                        <Progress value={45} className="h-1.5" variant="warning" />
                                                                    </div>

                                                                    <div className="space-y-1">
                                                                        <div className="flex justify-between text-xs text-gray-500">
                                                                            <span>GPU Usage</span>
                                                                            <span>{job.resources.gpu || 0}%</span>
                                                                        </div>
                                                                        <Progress value={job.resources.gpu || 0} className="h-1.5" variant="success" />
                                                                    </div>

                                                                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                                                                        <div className="bg-white p-2 rounded border text-center">
                                                                            <div className="text-gray-400 mb-1">Network</div>
                                                                            <div className="font-mono">{job.resources.network.in}↓ {job.resources.network.out}↑</div>
                                                                            <div className="text-gray-300 text-[10px]">MB/s</div>
                                                                        </div>
                                                                        <div className="bg-white p-2 rounded border text-center">
                                                                            <div className="text-gray-400 mb-1">Scratch</div>
                                                                            <div className="font-mono">{job.resources.scratch.used} / {job.resources.scratch.quota}</div>
                                                                            <div className="text-gray-300 text-[10px]">GB</div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Command */}
                                                            <div>
                                                                <h4 className="text-xs font-medium uppercase text-gray-500 mb-2">Command</h4>
                                                                <div className="bg-gray-900 text-green-400 font-mono text-xs p-3 rounded overflow-x-auto">
                                                                    $ {job.command}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Console Log */}
                                                        <div className="h-full min-h-[250px] flex flex-col">
                                                            <h4 className="text-xs font-medium uppercase text-gray-500 mb-2 flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    <span>Console Output</span>
                                                                    {job.status === 'running' && (
                                                                        <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 animate-pulse border-none text-[10px] py-0 h-4">
                                                                            Live
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <Button variant="ghost" size="sm" className="h-6 text-xs px-2">Copy</Button>
                                                                    <Button variant="ghost" size="sm" className="h-6 text-xs px-2">Download</Button>
                                                                </div>
                                                            </h4>
                                                            <div className="bg-gray-950 text-gray-300 font-mono text-[11px] p-4 rounded-lg flex-1 overflow-y-auto whitespace-pre border border-gray-800 shadow-inner">
                                                                <div className="opacity-50 border-b border-gray-800 pb-2 mb-2">--- Start of execution log for {job.id} ---</div>
                                                                {job.logs || 'No logs available.'}
                                                                {job.status === 'running' && (
                                                                    <div className="flex items-center gap-2 mt-2 text-green-500 animate-pulse">
                                                                        <span>_</span>
                                                                        <span className="text-[10px] uppercase tracking-tighter">Waiting for output...</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
            {activeTab === 'queue' && (
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Global Cluster Queue</CardTitle>
                                    <CardDescription>All pending and running jobs across the CANFAR cluster</CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">127 Jobs Total</Badge>
                                    <Badge variant="success">98.2% Cluster Health</Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold uppercase text-gray-400 border-b">
                                    <div className="col-span-1">Pos</div>
                                    <div className="col-span-4">Job Name / ID</div>
                                    <div className="col-span-2">User</div>
                                    <div className="col-span-2">Status</div>
                                    <div className="col-span-2">Resources</div>
                                    <div className="col-span-1">Wait</div>
                                </div>
                                {([
                                    { pos: 1, name: 'DeepSky v4 Run', id: 'job-984', user: 'jdoe', status: 'running', nodes: 32, wait: 'n/a' },
                                    { pos: 2, name: 'Gaia DR3 Crossmatch', id: 'job-985', user: 'astrosara', status: 'running', nodes: 16, wait: 'n/a' },
                                    { pos: 3, name: 'VLASS Beamforming', id: 'job-986', user: 'thbrown', status: 'queued', nodes: 64, wait: '12m' },
                                    { pos: 4, name: 'N-Body Sim HighRes', id: 'job-987', user: 'kruger', status: 'queued', nodes: 128, wait: '45m' },
                                    { pos: 5, name: 'Spectral Fit Batch', id: 'job-988', user: 'mcollins', status: 'queued', nodes: 8, wait: '1h 10m' },
                                ] as ClusterJob[]).map((q) => (
                                    <div key={q.id} className="grid grid-cols-12 gap-4 px-4 py-3 text-sm border-b last:border-0 hover:bg-gray-50 transition-colors items-center">
                                        <div className="col-span-1 font-mono text-gray-400">#{q.pos}</div>
                                        <div className="col-span-4">
                                            <div className="font-medium text-secondary">{q.name}</div>
                                            <div className="text-xs text-gray-400 font-mono">{q.id}</div>
                                        </div>
                                        <div className="col-span-2 text-gray-600">
                                            <div className="flex items-center gap-1.5">
                                                <div className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold">
                                                    {q.user.charAt(0).toUpperCase()}
                                                </div>
                                                {q.user}
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <Badge variant={q.status === 'running' ? 'secondary' : 'warning'} className="gap-1">
                                                {q.status === 'running' ? <Loader2 className="h-3 w-3 animate-spin" /> : <Clock className="h-3 w-3" />}
                                                {q.status}
                                            </Badge>
                                        </div>
                                        <div className="col-span-2 text-xs text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Cpu className="h-3 w-3" /> {q.nodes} Nodes
                                            </div>
                                        </div>
                                        <div className="col-span-1 text-xs text-gray-400">{q.wait}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 flex justify-center">
                                <Button variant="secondary" size="sm">View All 127 Jobs in Queue</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
