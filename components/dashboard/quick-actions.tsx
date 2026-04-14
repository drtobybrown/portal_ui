'use client'

import * as React from 'react'
import { Plus, Upload, ClipboardList, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface QuickActionsProps {
  onStartSession?: () => void
}

export function QuickActions({ onStartSession }: QuickActionsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {/* Start New Session - Primary action */}
      <button
        onClick={onStartSession}
        className="group relative overflow-hidden rounded-xl bg-primary p-6 text-left text-white shadow-lg transition-all hover:shadow-xl"
      >
        <div className="relative z-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <Plus className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">Start New Session</h3>
          <p className="mt-1 text-sm text-white/70">
            Launch Jupyter, CARTA, or Desktop
          </p>
          <div className="mt-4 flex items-center text-sm font-medium">
            Get started
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
        {/* Decorative element */}
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
        <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-white/5" />
      </button>

      {/* Transfer Data */}
      <button className="group rounded-xl border-2 border-dashed border-gray-200 bg-white p-6 text-left transition-all hover:border-primary hover:shadow-md">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 transition-colors group-hover:bg-primary-light">
          <Upload className="h-6 w-6 text-gray-500 transition-colors group-hover:text-primary" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-secondary">Transfer Data</h3>
        <p className="mt-1 text-sm text-gray-500">
          Transfer files between computer and CANFAR Science Platform
        </p>
        <div className="mt-4 flex items-center text-sm font-medium text-gray-600 group-hover:text-primary">
          Browse
          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </button>

      {/* Check Job Status */}
      <button className="group rounded-xl border-2 border-dashed border-gray-200 bg-white p-6 text-left transition-all hover:border-accent hover:shadow-md">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 transition-colors group-hover:bg-accent-light">
          <ClipboardList className="h-6 w-6 text-gray-500 transition-colors group-hover:text-accent" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-secondary">Check Jobs</h3>
        <p className="mt-1 text-sm text-gray-500">
          Monitor batch processing tasks
        </p>
        <div className="mt-4 flex items-center text-sm font-medium text-gray-600 group-hover:text-accent">
          View queue
          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </button>
    </div>
  )
}
