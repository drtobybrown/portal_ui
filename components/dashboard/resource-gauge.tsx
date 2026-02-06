'use client'

import * as React from 'react'
import { Cpu, HardDrive, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { platformLoad, userStorage } from '@/lib/dummy-data'
import { formatPercentage } from '@/lib/utils'

// Circular progress component
function CircularGauge({
  value,
  max,
  label,
  color,
}: {
  value: number
  max: number
  label: string
  color: string
}) {
  const percentage = (value / max) * 100
  const circumference = 2 * Math.PI * 36
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-24 w-24">
        <svg className="h-24 w-24 -rotate-90 transform">
          {/* Background circle */}
          <circle
            cx="48"
            cy="48"
            r="36"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-100"
          />
          {/* Progress circle */}
          <circle
            cx="48"
            cy="48"
            r="36"
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset,
              transition: 'stroke-dashoffset 0.5s ease-out',
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-semibold text-secondary">{percentage.toFixed(0)}%</span>
        </div>
      </div>
      <span className="mt-2 text-sm font-medium text-gray-600">{label}</span>
    </div>
  )
}

export function ComputeResourceCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary-light p-2">
            <Cpu className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-base">Platform Load</CardTitle>
        </div>
        <button className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
          <RefreshCw className="h-4 w-4" />
        </button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-around py-4">
          <CircularGauge
            value={platformLoad.cpus.used}
            max={platformLoad.cpus.total}
            label="CPU"
            color="#005493"
          />
          <CircularGauge
            value={platformLoad.ram.used}
            max={platformLoad.ram.total}
            label="RAM"
            color="#F5AA1C"
          />
        </div>

        <div className="mt-4 space-y-3 border-t pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Available CPUs</span>
            <span className="font-medium text-secondary">
              {platformLoad.cpus.available.toFixed(1)} / {platformLoad.cpus.total.toFixed(1)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Available RAM</span>
            <span className="font-medium text-secondary">
              {platformLoad.ram.available.toFixed(0)} GB / {platformLoad.ram.total.toFixed(0)} GB
            </span>
          </div>
        </div>

        <p className="mt-4 text-xs text-gray-400">Last updated: {platformLoad.lastUpdate}</p>
      </CardContent>
    </Card>
  )
}

export function StorageResourceCard() {
  const homePercentage = formatPercentage(userStorage.home.used, userStorage.home.quota)
  const scratchPercentage = formatPercentage(userStorage.scratch.used, userStorage.scratch.quota)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-accent-light p-2">
            <HardDrive className="h-4 w-4 text-accent" />
          </div>
          <CardTitle className="text-base">Your Storage</CardTitle>
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
              <span className="text-sm font-medium text-gray-700">Home Storage</span>
              <span className="text-sm text-gray-500">{homePercentage}%</span>
            </div>
            <Progress
              value={userStorage.home.used}
              max={userStorage.home.quota}
              variant={homePercentage > 80 ? 'warning' : 'success'}
              size="md"
            />
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>
                {userStorage.home.used} {userStorage.home.unit} used
              </span>
              <span>
                {userStorage.home.quota} {userStorage.home.unit} quota
              </span>
            </div>
          </div>

          {/* Scratch Storage */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Scratch Space</span>
              <span className="text-sm text-gray-500">{scratchPercentage}%</span>
            </div>
            <Progress
              value={userStorage.scratch.used}
              max={userStorage.scratch.quota}
              variant={scratchPercentage > 80 ? 'warning' : 'default'}
              size="md"
            />
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>
                {userStorage.scratch.used} {userStorage.scratch.unit} used
              </span>
              <span>
                {userStorage.scratch.quota} {userStorage.scratch.unit} quota
              </span>
            </div>
          </div>
        </div>

        <p className="mt-2 text-xs text-gray-400">Last updated: {userStorage.lastUpdate}</p>
      </CardContent>
    </Card>
  )
}
