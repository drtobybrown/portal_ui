'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface DataPoint {
  label: string
  value: number
}

interface LineChartProps {
  data: DataPoint[]
  color?: string
  height?: number
  showGrid?: boolean
  showArea?: boolean
  className?: string
  label?: string
  unit?: string
}

// Create a smooth curve path using cardinal spline interpolation
function createSmoothPath(points: { x: number; y: number }[], tension: number = 0.3): string {
  if (points.length < 2) return ''
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`
  }

  let path = `M ${points[0].x} ${points[0].y}`

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? i : i - 1]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2 >= points.length ? i + 1 : i + 2]

    const cp1x = p1.x + (p2.x - p0.x) * tension
    const cp1y = p1.y + (p2.y - p0.y) * tension
    const cp2x = p2.x - (p3.x - p1.x) * tension
    const cp2y = p2.y - (p3.y - p1.y) * tension

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
  }

  return path
}

export function LineChart({
  data,
  color = '#005493',
  height = 120,
  showGrid = true,
  showArea = true,
  className,
  label,
  unit = '',
}: LineChartProps) {
  if (!data || data.length === 0) return null

  const maxValue = Math.max(...data.map((d) => d.value)) * 1.05
  const minValue = Math.min(...data.map((d) => d.value)) * 0.95
  const range = maxValue - minValue || 1

  // Use a proper aspect ratio - width based on container
  const viewBoxWidth = 400
  const viewBoxHeight = 100
  const padding = { top: 8, right: 8, bottom: 4, left: 8 }
  const chartWidth = viewBoxWidth - padding.left - padding.right
  const chartHeight = viewBoxHeight - padding.top - padding.bottom

  const points = data.map((d, i) => {
    const x = padding.left + (i / Math.max(data.length - 1, 1)) * chartWidth
    const y = padding.top + chartHeight - ((d.value - minValue) / range) * chartHeight
    return { x, y, ...d }
  })

  const linePath = createSmoothPath(points)
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${padding.left} ${padding.top + chartHeight} Z`

  const currentValue = data[data.length - 1]?.value ?? 0

  // Select labels to show (first, last, and a few in between)
  const labelIndices = [0, Math.floor(data.length / 2), data.length - 1].filter(
    (v, i, a) => a.indexOf(v) === i
  )

  return (
    <div className={cn('relative', className)}>
      {label && (
        <div className="mb-3 flex items-baseline justify-between">
          <span className="text-sm font-medium text-gray-600">{label}</span>
          <span className="text-xl font-semibold text-secondary">
            {currentValue.toFixed(1)}{unit}
          </span>
        </div>
      )}
      
      <div className="relative" style={{ height }}>
        <svg
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="h-full w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid lines */}
          {showGrid && (
            <g>
              {[0, 0.5, 1].map((ratio) => (
                <line
                  key={ratio}
                  x1={padding.left}
                  y1={padding.top + chartHeight * ratio}
                  x2={viewBoxWidth - padding.right}
                  y2={padding.top + chartHeight * ratio}
                  stroke="#f3f4f6"
                  strokeWidth="1"
                />
              ))}
            </g>
          )}

          {/* Area fill with gradient */}
          <defs>
            <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.2" />
              <stop offset="100%" stopColor={color} stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {showArea && (
            <path
              d={areaPath}
              fill={`url(#gradient-${color.replace('#', '')})`}
            />
          )}

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Current value dot */}
          <circle
            cx={points[points.length - 1].x}
            cy={points[points.length - 1].y}
            r="4"
            fill="white"
            stroke={color}
            strokeWidth="2"
          />
        </svg>

        {/* X-axis labels rendered as HTML for better control */}
        <div className="absolute bottom-0 left-2 right-2 flex justify-between text-[11px] text-gray-400">
          {labelIndices.map((idx) => (
            <span key={idx}>{data[idx]?.label}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

interface GrafanaPanelProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  className?: string
  onRefresh?: () => void
}

export function GrafanaPanel({ title, subtitle, children, className, onRefresh }: GrafanaPanelProps) {
  return (
    <div className={cn('rounded-xl border border-gray-200 bg-white shadow-sm', className)}>
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-secondary">{title}</h3>
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  )
}

interface BarChartProps {
  data: DataPoint[]
  color?: string
  height?: number
  className?: string
  horizontal?: boolean
}

export function BarChart({
  data,
  color = '#005493',
  height = 120,
  className,
  horizontal = false,
}: BarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value))

  if (horizontal) {
    return (
      <div className={cn('space-y-3', className)}>
        {data.map((d, i) => (
          <div key={i}>
            <div className="mb-1.5 flex justify-between text-sm">
              <span className="text-gray-600">{d.label}</span>
              <span className="font-medium text-secondary">{d.value.toFixed(1)}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(d.value / maxValue) * 100}%`,
                  backgroundColor: color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('flex items-end justify-between gap-2', className)} style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex flex-1 flex-col items-center">
          <div
            className="w-full rounded-t-md transition-all duration-500"
            style={{
              height: `${(d.value / maxValue) * (height - 24)}px`,
              backgroundColor: color,
            }}
          />
          <span className="mt-2 text-xs text-gray-500">{d.label}</span>
        </div>
      ))}
    </div>
  )
}
