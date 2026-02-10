'use client'

import * as React from 'react'
import { HardDrive, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { userStorage } from '@/lib/dummy-data'
import { formatPercentage } from '@/lib/utils'

export function StorageResourceCard() {
  const homePercentage = formatPercentage(userStorage.home.used, userStorage.home.quota)

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-accent-light p-2">
            <HardDrive className="h-4 w-4 text-accent" />
          </div>
          <CardTitle className="text-base">Storage Quotas</CardTitle>
        </div>
        <button className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
          <RefreshCw className="h-4 w-4" />
        </button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 py-4">
          {/* Home Storage */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Home (Arc)</span>
              <span className="text-sm text-gray-500">{homePercentage}%</span>
            </div>
            <Progress
              value={userStorage.home.used}
              max={userStorage.home.quota}
              variant={homePercentage > 80 ? 'warning' : 'success'}
              size="md"
            />
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>{userStorage.home.used} {userStorage.home.unit} used</span>
              <span>{userStorage.home.quota} {userStorage.home.unit} quota</span>
            </div>
          </div>

          {/* Project Storage */}
          {userStorage.projects.map((project) => {
            const percentage = formatPercentage(project.used, project.quota)
             return (
              <div key={project.name}>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">{project.name}</span>
                      <span className="text-[10px] uppercase tracking-wider text-gray-400 border border-gray-200 rounded px-1">{project.type}</span>
                  </div>
                  <span className="text-sm text-gray-500">{percentage}%</span>
                </div>
                <Progress
                  value={project.used}
                  max={project.quota}
                  variant={percentage > 80 ? 'warning' : 'default'}
                  size="md"
                />
                <div className="mt-1 flex justify-between text-xs text-gray-500">
                  <span>{project.used} {project.unit} used</span>
                  <span>{project.quota} {project.unit} quota</span>
                </div>
              </div>
            )
          })}
        </div>

        <p className="mt-2 text-xs text-gray-400">
          Last updated: {userStorage.lastUpdate}
        </p>
      </CardContent>
    </Card>
  )
}