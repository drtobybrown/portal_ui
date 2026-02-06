'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  showLabel?: boolean
  variant?: 'default' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    { className, value, max = 100, showLabel = false, variant = 'default', size = 'md', ...props },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        <div
          className={cn('w-full overflow-hidden rounded-full bg-gray-100', {
            'h-1.5': size === 'sm',
            'h-2.5': size === 'md',
            'h-4': size === 'lg',
          })}
        >
          <div
            className={cn('h-full rounded-full transition-all duration-500 ease-out', {
              'bg-primary': variant === 'default',
              'bg-green-500': variant === 'success',
              'bg-amber-500': variant === 'warning',
              'bg-red-500': variant === 'error',
            })}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showLabel && (
          <div className="mt-1 flex justify-between text-xs text-gray-500">
            <span>{value.toFixed(1)}</span>
            <span>{max.toFixed(1)}</span>
          </div>
        )}
      </div>
    )
  }
)
Progress.displayName = 'Progress'

export { Progress }
