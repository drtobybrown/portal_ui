'use client'

import * as React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from './button'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to monitoring service in production
    console.error('Error caught by boundary:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div
          role="alert"
          className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 p-8"
        >
          <div className="mb-4 rounded-full bg-red-100 p-3">
            <AlertTriangle className="h-8 w-8 text-red-600" aria-hidden="true" />
          </div>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">Something went wrong</h2>
          <p className="mb-4 max-w-md text-center text-sm text-gray-600">
            An unexpected error occurred. Please try again or contact support if the problem
            persists.
          </p>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre className="mb-4 max-w-full overflow-auto rounded-lg bg-gray-900 p-4 text-xs text-red-400">
              {this.state.error.message}
            </pre>
          )}
          <Button onClick={this.handleReset} variant="primary">
            <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
            Try Again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook-based error boundary for functional components
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  const resetError = React.useCallback(() => {
    setError(null)
  }, [])

  const handleError = React.useCallback((error: Error) => {
    setError(error)
    console.error('Error handled:', error)
  }, [])

  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  return { handleError, resetError }
}
