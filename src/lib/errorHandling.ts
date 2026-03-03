import { ErrorType, AppError } from '@/types'

// Error message mappings for user-friendly display
export const ERROR_MESSAGES: Record<ErrorType, string> = {
  ai_service_error: 'AI is busy, please try again',
  network_error: 'Network error. Please check your connection and try again.',
  validation_error: 'Please check your input and try again.',
  rate_limit_error: 'Too many requests. Please wait a moment and try again.'
}

// Specific error patterns for AI service responses
const AI_ERROR_PATTERNS = [
  'i cannot fulfill this request',
  'not a spreadsheet calculation',
  'not related to spreadsheets',
  'unable to generate a formula for this',
  'invalid spreadsheet request'
]

/**
 * Creates a standardized AppError object
 */
export function createAppError(
  type: ErrorType,
  message?: string,
  details?: string
): AppError {
  return {
    type,
    message: message || ERROR_MESSAGES[type],
    details,
    timestamp: new Date()
  }
}

/**
 * Categorizes an error based on its characteristics
 */
export function categorizeError(error: any): ErrorType {
  // Network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return 'network_error'
  }

  if (error.name === 'NetworkError' || error.code === 'NETWORK_ERROR') {
    return 'network_error'
  }

  // Rate limiting (HTTP 429)
  if (error.status === 429 || error.message?.includes('rate limit')) {
    return 'rate_limit_error'
  }

  // Validation errors (HTTP 400)
  if (error.status === 400) {
    return 'validation_error'
  }

  // AI service errors (HTTP 503, 401, or AI-specific errors)
  if (error.status === 503 || error.status === 401 || error.status === 500) {
    return 'ai_service_error'
  }

  // Default to AI service error for unknown errors
  return 'ai_service_error'
}

/**
 * Determines if an AI response contains an error indication
 */
export function isAIErrorResponse(explanation: string): boolean {
  const lowerExplanation = explanation.toLowerCase()
  return AI_ERROR_PATTERNS.some(pattern => lowerExplanation.includes(pattern))
}

/**
 * Gets user-friendly error message based on error type and context
 */
export function getUserFriendlyErrorMessage(
  error: any,
  context?: 'generation' | 'copy' | 'network'
): string {
  const errorType = categorizeError(error)
  let baseMessage = ERROR_MESSAGES[errorType]

  // Add context-specific guidance
  switch (context) {
    case 'generation':
      if (errorType === 'ai_service_error') {
        baseMessage = 'AI is busy, please try again'
      } else if (errorType === 'validation_error') {
        baseMessage = 'Please describe a spreadsheet calculation and try again.'
      }
      break
    case 'copy':
      baseMessage = 'Failed to copy to clipboard. Please try selecting and copying the formula manually.'
      break
    case 'network':
      baseMessage = 'Connection lost. Please check your internet and try again.'
      break
  }

  return baseMessage
}

/**
 * Logs error for debugging while preserving user privacy
 */
export function logError(error: AppError, additionalContext?: Record<string, any>) {
  const logData = {
    type: error.type,
    message: error.message,
    timestamp: error.timestamp.toISOString(),
    ...additionalContext
  }

  // Only log details in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Application Error:', logData, error.details)
  } else {
    // In production, log minimal information
    console.error('Application Error:', {
      type: error.type,
      timestamp: error.timestamp.toISOString()
    })
  }

  // Track error in analytics if available
  if (typeof window !== 'undefined' && (window as any).va) {
    (window as any).va('track', 'app_error', {
      error_type: error.type,
      error_context: additionalContext?.context || 'unknown'
    })
  }
}

/**
 * Retry mechanism with exponential backoff
 */
export class RetryManager {
  private retryCount = 0
  private maxRetries = 3
  private baseDelay = 1000 // 1 second

  async executeWithRetry<T>(
    operation: () => Promise<T>,
    errorHandler?: (error: any, attempt: number) => boolean
  ): Promise<T> {
    try {
      const result = await operation()
      this.retryCount = 0 // Reset on success
      return result
    } catch (error) {
      this.retryCount++

      // Check if we should retry
      const shouldRetry = this.retryCount <= this.maxRetries &&
        (errorHandler ? errorHandler(error, this.retryCount) : this.shouldRetryError(error))

      if (shouldRetry) {
        const delay = this.baseDelay * Math.pow(2, this.retryCount - 1)
        await this.delay(delay)
        return this.executeWithRetry(operation, errorHandler)
      }

      throw error
    }
  }

  private shouldRetryError(error: any): boolean {
    const errorType = categorizeError(error)
    // Retry network errors and AI service errors, but not validation errors
    return errorType === 'network_error' || errorType === 'ai_service_error'
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  reset() {
    this.retryCount = 0
  }
}

/**
 * State preservation utility for maintaining user data during errors
 */
export class StatePreserver {
  private static readonly STORAGE_KEY = 'excel_ai_preserved_state'

  static preserveState(state: {
    inputText: string
    selectedPlatform: string
    timestamp: number
  }) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state))
    } catch (error) {
      console.warn('Failed to preserve state:', error)
    }
  }

  static restoreState(): {
    inputText: string
    selectedPlatform: string
    timestamp: number
  } | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        const state = JSON.parse(stored)
        // Only restore if less than 1 hour old
        if (Date.now() - state.timestamp < 3600000) {
          return state
        }
      }
    } catch (error) {
      console.warn('Failed to restore state:', error)
    }
    return null
  }

  static clearState() {
    try {
      localStorage.removeItem(this.STORAGE_KEY)
    } catch (error) {
      console.warn('Failed to clear preserved state:', error)
    }
  }
}

/**
 * Network status monitoring
 */
export class NetworkMonitor {
  private static instance: NetworkMonitor
  private isOnline = navigator.onLine
  private listeners: ((online: boolean) => void)[] = []

  private constructor() {
    window.addEventListener('online', () => {
      this.isOnline = true
      this.notifyListeners()
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
      this.notifyListeners()
    })
  }

  static getInstance(): NetworkMonitor {
    if (!NetworkMonitor.instance) {
      NetworkMonitor.instance = new NetworkMonitor()
    }
    return NetworkMonitor.instance
  }

  getStatus(): boolean {
    return this.isOnline
  }

  onStatusChange(callback: (online: boolean) => void) {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback)
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.isOnline))
  }
}