'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          {
            // Variants
            'bg-primary text-white hover:bg-primary-hover shadow-sm hover:shadow':
              variant === 'primary',
            'bg-secondary text-white hover:bg-secondary-hover shadow-sm hover:shadow':
              variant === 'secondary',
            'border-2 border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300':
              variant === 'outline',
            'text-gray-700 hover:bg-gray-100': variant === 'ghost',
            'bg-destructive text-white hover:bg-destructive-hover shadow-sm':
              variant === 'destructive',
            // Sizes
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4 text-sm': size === 'md',
            'h-12 px-6 text-base': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
