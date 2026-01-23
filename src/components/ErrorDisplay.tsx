'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, RefreshCw, Wifi, WifiOff, Clock } from 'lucide-react'
import { AppError, ErrorType } from '@/types'
import { NetworkMonitor } from '@/lib/errorHandling'

interface ErrorDisplayProps {
  error: AppError | null
  onRetry?: () => void
  onDismiss?: () => void
  showRetryButton?: boolean
  className?: string
}

export default function ErrorDisplay({ 
  error, 
  onRetry, 
  onDismiss, 
  showRetryButton = true,
  className = ''
}: ErrorDisplayProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const networkMonitor = NetworkMonitor.getInstance()
    setIsOnline(networkMonitor.getStatus())
    
    const unsubscribe = networkMonitor.onStatusChange(setIsOnline)
    return unsubscribe
  }, [])

  if (!error) {
    return null
  }

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
    onRetry?.()
  }

  const getErrorIcon = (errorType: ErrorType) => {
    switch (errorType) {
      case 'network_error':
        return isOnline ? <Wifi className="h-5 w-5" /> : <WifiOff className="h-5 w-5" />
      case 'rate_limit_error':
        return <Clock className="h-5 w-5" />
      default:
        return <AlertTriangle className="h-5 w-5" />
    }
  }

  const getErrorColor = (errorType: ErrorType) => {
    switch (errorType) {
      case 'network_error':
        return isOnline ? 'blue' : 'red'
      case 'rate_limit_error':
        return 'yellow'
      case 'validation_error':
        return 'orange'
      default:
        return 'red'
    }
  }

  const getRetryDelay = (errorType: ErrorType) => {
    switch (errorType) {
      case 'rate_limit_error':
        return 'Wait a moment before trying again'
      case 'ai_service_error':
        return 'The AI service will be back shortly'
      case 'network_error':
        return isOnline ? 'Connection restored' : 'Check your internet connection'
      default:
        return null
    }
  }

  const color = getErrorColor(error.type)
  const retryDelay = getRetryDelay(error.type)

  // Use static CSS classes instead of dynamic ones for better test compatibility
  const getStaticClasses = (errorType: ErrorType) => {
    switch (errorType) {
      case 'network_error':
        return {
          container: isOnline ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200',
          icon: isOnline ? 'text-blue-400' : 'text-red-400',
          title: isOnline ? 'text-blue-800' : 'text-red-800',
          text: isOnline ? 'text-blue-600' : 'text-red-600',
          button: isOnline ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-red-100 text-red-700 hover:bg-red-200',
          dismiss: isOnline ? 'text-blue-400 hover:text-blue-600' : 'text-red-400 hover:text-red-600'
        }
      case 'rate_limit_error':
        return {
          container: 'bg-yellow-50 border-yellow-200',
          icon: 'text-yellow-400',
          title: 'text-yellow-800',
          text: 'text-yellow-600',
          button: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
          dismiss: 'text-yellow-400 hover:text-yellow-600'
        }
      case 'validation_error':
        return {
          container: 'bg-orange-50 border-orange-200',
          icon: 'text-orange-400',
          title: 'text-orange-800',
          text: 'text-orange-600',
          button: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
          dismiss: 'text-orange-400 hover:text-orange-600'
        }
      default:
        return {
          container: 'bg-red-50 border-red-200',
          icon: 'text-red-400',
          title: 'text-red-800',
          text: 'text-red-600',
          button: 'bg-red-100 text-red-700 hover:bg-red-200',
          dismiss: 'text-red-400 hover:text-red-600'
        }
    }
  }

  const classes = getStaticClasses(error.type)

  return (
    <div className={`w-full max-w-4xl mx-auto mt-6 ${classes.container} rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <div className={`flex-shrink-0 ${classes.icon}`}>
          {getErrorIcon(error.type)}
        </div>
        <div className="ml-3 flex-1">
          <div className="flex items-center justify-between">
            <h3 className={`text-sm font-medium ${classes.title}`}>
              {error.message}
            </h3>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className={`${classes.dismiss} transition-colors`}
                aria-label="Dismiss error"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>

          {/* Additional context for specific error types */}
          {retryDelay && (
            <p className={`text-xs ${classes.text} mt-1`}>
              {retryDelay}
            </p>
          )}

          {/* Network status indicator */}
          {error.type === 'network_error' && (
            <div className="flex items-center mt-2">
              <div className={`w-2 h-2 rounded-full mr-2 ${isOnline ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className={`text-xs ${classes.text}`}>
                {isOnline ? 'Connected' : 'Offline'}
              </span>
            </div>
          )}

          {/* Retry button */}
          {showRetryButton && onRetry && (
            <div className="mt-3">
              <button
                onClick={handleRetry}
                disabled={!isOnline && error.type === 'network_error'}
                className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  !isOnline && error.type === 'network_error'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : classes.button
                }`}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Try Again
                {retryCount > 0 && ` (${retryCount})`}
              </button>
            </div>
          )}

          {/* Development error details */}
          {process.env.NODE_ENV === 'development' && error.details && (
            <details className="mt-3">
              <summary className={`text-xs ${classes.text} cursor-pointer hover:${classes.title}`}>
                Error Details (Development)
              </summary>
              <pre className={`mt-1 text-xs ${classes.text} bg-gray-100 p-2 rounded overflow-auto max-h-32`}>
                {error.details}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  )
}