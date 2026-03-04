'use client'

import * as React from 'react'
import { Cpu, RefreshCw, Server, Activity, HardDrive } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { activeSessions } from '@/lib/dummy-data'
import { cn } from '@/lib/utils'

export function SessionResourceMonitor() {
  // Group sessions by node for display
  // In reality, this would query the API for node stats. 
  // Here we just show the active sessions as "monitored contexts".
  
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-blue-100 p-2">
            <Activity className="h-4 w-4 text-blue-600" />
          </div>
          <CardTitle className="text-base">Session Resources</CardTitle>
        </div>
        <button className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
          <RefreshCw className="h-4 w-4" />
        </button>
      </CardHeader>
      <CardContent className="space-y-6">
        {activeSessions.length === 0 ? (
           <div className="py-8 text-center text-sm text-gray-500">
             No active sessions to monitor.
           </div>
        ) : (
          activeSessions.map((session) => (
            <div key={session.id} className="space-y-3 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="h-3 w-3 text-gray-400" />
                  <span className="text-sm font-medium text-secondary">{session.nodeId}</span>
                  <span className="text-xs text-gray-400">({session.name})</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                   <span className="flex items-center gap-1">
                     <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                     Live
                   </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* CPU & RAM */}
                <div className="space-y-2">
                   <div className="flex justify-between text-xs text-gray-500">
                     <span>CPU Usage</span>
                     <span className="font-medium text-gray-700">{(Math.random() * 30 + 10).toFixed(1)}%</span>
                   </div>
                   <Progress value={Math.random() * 30 + 10} className="h-1.5" />
                   
                   <div className="flex justify-between text-xs text-gray-500 pt-1">
                     <span>RAM Usage</span>
                     <span className="font-medium text-gray-700">{(Math.random() * 40 + 20).toFixed(1)}%</span>
                   </div>
                   <Progress value={Math.random() * 40 + 20} className="h-1.5" variant="warning" />
                </div>

                {/* Network & Scratch */}
                <div className="space-y-2">
                   <div className="flex justify-between text-xs text-gray-500">
                     <span>Network I/O</span>
                     <span className="font-medium text-gray-700">
                       {session.network?.in || 0} ↓ / {session.network?.out || 0} ↑ MB/s
                     </span>
                   </div>
                   {/* Visual bar for network just for show */}
                   <div className="flex h-1.5 w-full gap-0.5 overflow-hidden rounded-full bg-gray-100">
                      <div className="h-full bg-blue-500" style={{ width: '40%' }} />
                      <div className="h-full bg-green-500" style={{ width: '30%' }} />
                   </div>

                   <div className="flex justify-between text-xs text-gray-500 pt-1">
                     <span>Scratch Space</span>
                     <span className="font-medium text-gray-700">
                       {session.scratch?.used || 0} / {session.scratch?.quota || 0} GB
                     </span>
                   </div>
                    <Progress value={(session.scratch?.used || 0) / (session.scratch?.quota || 100) * 100} className="h-1.5" />
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
