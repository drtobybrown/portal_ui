import { cn } from '@/lib/utils'

interface SkaoLogoProps {
  className?: string
  variant?: 'full' | 'icon'
}

export function SkaoLogo({ className, variant = 'full' }: SkaoLogoProps) {
  if (variant === 'icon') {
    return (
      <svg
        viewBox="0 0 48 48"
        className={cn('h-8 w-8', className)}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="SKAO"
      >
        <circle cx="24" cy="24" r="24" fill="url(#skao-grad-icon)" />
        <path
          d="M24 8l2.5 6.5L33 17l-6.5 2.5L24 26l-2.5-6.5L15 17l6.5-2.5L24 8z"
          fill="white"
          opacity="0.95"
        />
        <circle cx="24" cy="32" r="2" fill="white" opacity="0.7" />
        <circle cx="18" cy="28" r="1.2" fill="white" opacity="0.5" />
        <circle cx="30" cy="28" r="1.2" fill="white" opacity="0.5" />
        <circle cx="16" cy="34" r="0.8" fill="white" opacity="0.4" />
        <circle cx="32" cy="34" r="0.8" fill="white" opacity="0.4" />
        <circle cx="20" cy="38" r="0.6" fill="white" opacity="0.3" />
        <circle cx="28" cy="38" r="0.6" fill="white" opacity="0.3" />
        <defs>
          <linearGradient id="skao-grad-icon" x1="0" y1="0" x2="48" y2="48">
            <stop offset="0%" stopColor="#070068" />
            <stop offset="100%" stopColor="#E70068" />
          </linearGradient>
        </defs>
      </svg>
    )
  }

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <svg
        viewBox="0 0 36 36"
        className="h-8 w-8 flex-shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="18" cy="18" r="18" fill="url(#skao-grad-full)" />
        <path
          d="M18 6l1.9 5L25 13l-5 1.9L18 20l-1.9-5L11 13l5-1.9L18 6z"
          fill="white"
          opacity="0.95"
        />
        <circle cx="18" cy="24" r="1.5" fill="white" opacity="0.7" />
        <circle cx="13.5" cy="21" r="0.9" fill="white" opacity="0.5" />
        <circle cx="22.5" cy="21" r="0.9" fill="white" opacity="0.5" />
        <circle cx="12" cy="26" r="0.6" fill="white" opacity="0.35" />
        <circle cx="24" cy="26" r="0.6" fill="white" opacity="0.35" />
        <circle cx="15" cy="29" r="0.5" fill="white" opacity="0.25" />
        <circle cx="21" cy="29" r="0.5" fill="white" opacity="0.25" />
        <defs>
          <linearGradient id="skao-grad-full" x1="0" y1="0" x2="36" y2="36">
            <stop offset="0%" stopColor="#070068" />
            <stop offset="100%" stopColor="#E70068" />
          </linearGradient>
        </defs>
      </svg>
      <div className="flex flex-col leading-none">
        <span className="text-sm font-bold tracking-wide text-white">SRCNet</span>
        <span className="text-[9px] font-medium tracking-widest text-gray-400 uppercase">
          Gateway
        </span>
      </div>
    </div>
  )
}
