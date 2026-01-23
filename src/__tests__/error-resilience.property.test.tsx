/**
 * Property-Based Tests for Error Resilience
 * Feature: excel-ai-formula-generator, Property 8: Error Resilience
 * **Validates: Requirements 7.4, 7.5**
 * 
 * Property 8: Error Resilience
 * For any API failure or error condition, the application should remain stable,
 * maintain current state, and provide appropriate user feedback
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import * as fc from 'fast-check'
import Home from '@/app/page'
import { 
  createAppError, 
  categorizeError, 
  getUserFriendlyErrorMessage,
  StatePreserver,
  RetryManager,
  NetworkMonitor,
  logError
} from '@/lib/errorHandling'
import { ErrorType, AppError } from '@/types'

// Mock fetch for controlled error scenarios
const mockFetch = jest.fn()
global.fetch = mockFetch

// Mock localStorage for state preservation tests
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
}
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
})

// Mock navigator.onLine for network status tests
Object.defineProperty(navigator, 'onLine', {
  writable: true,
  value: true
})

// Mock Vercel Analytics
const mockVA = jest.fn()
Object.defineProperty(window, 'va', {
  value: mockVA
})

describe('Property 8: Error Resilience', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue(null)
    navigator.onLine = true
  })

  describe('Error Categorization Property', () => {
    it('should correctly categorize different error types', () => {
      fc.assert(fc.property(
        fc.oneof(
          // Network errors - TypeError with fetch message
          fc.record({
            name: fc.constant('TypeError'),
            message: fc.constantFrom('fetch failed', 'Failed to fetch', 'fetch error')
          }).map(obj => {
            const error = new TypeError(obj.message)
            return error
          }),
          // Network errors - NetworkError
          fc.record({
            name: fc.constant('NetworkError'),
            message: fc.string()
          }),
          // HTTP status errors
          fc.record({
            status: fc.constantFrom(400, 401, 429, 500, 503),
            message: fc.string()
          }),
          // Rate limit errors with message
          fc.record({
            message: fc.constantFrom('rate limit exceeded', 'rate limit error'),
            name: fc.string()
          }),
          // Generic errors
          fc.record({
            message: fc.string(),
            name: fc.string()
          })
        ),
        (error) => {
          const errorType = categorizeError(error)
          
          // Verify error type is valid
          expect(['ai_service_error', 'network_error', 'validation_error', 'rate_limit_error'])
            .toContain(errorType)
          
          // Verify categorization logic
          if (error instanceof TypeError && error.message.includes('fetch')) {
            expect(errorType).toBe('network_error')
          } else if (error.name === 'NetworkError') {
            expect(errorType).toBe('network_error')
          } else if (error.status === 429 || (error.message && error.message.includes('rate limit'))) {
            expect(errorType).toBe('rate_limit_error')
          } else if (error.status === 400) {
            expect(errorType).toBe('validation_error')
          } else if ([401, 500, 503].includes(error.status)) {
            expect(errorType).toBe('ai_service_error')
          }
          // Default case is ai_service_error, so no assertion needed for that
        }
      ), { numRuns: 100 })
    })
  })

  describe('User-Friendly Error Messages Property', () => {
    it('should provide appropriate user messages for all error types', () => {
      fc.assert(fc.property(
        fc.constantFrom('ai_service_error', 'network_error', 'validation_error', 'rate_limit_error'),
        fc.oneof(
          fc.constant(undefined),
          fc.constantFrom('generation', 'copy', 'network')
        ),
        (errorType: ErrorType, context) => {
          // Create proper mock error that will categorize to the expected type
          let mockError: any
          switch (errorType) {
            case 'network_error':
              mockError = new TypeError('fetch failed')
              break
            case 'rate_limit_error':
              mockError = { status: 429, message: 'rate limit exceeded' }
              break
            case 'validation_error':
              mockError = { status: 400, message: 'validation error' }
              break
            case 'ai_service_error':
            default:
              mockError = { status: 503, message: 'service unavailable' }
              break
          }
          
          const message = getUserFriendlyErrorMessage(mockError, context)
          
          // Message should be non-empty and user-friendly
          expect(message).toBeTruthy()
          expect(typeof message).toBe('string')
          expect(message.length).toBeGreaterThan(0)
          
          // Should not contain technical jargon
          expect(message.toLowerCase()).not.toMatch(/stack|trace|exception|undefined|null/)
          
          // Context-specific message validation
          if (context === 'copy') {
            expect(message.toLowerCase()).toMatch(/copy|clipboard|manual/)
          } else if (context === 'network') {
            expect(message.toLowerCase()).toMatch(/connection|internet|check/)
          } else if (context === 'generation') {
            if (errorType === 'ai_service_error') {
              expect(message.toLowerCase()).toMatch(/ai|busy|try again/)
            } else if (errorType === 'validation_error') {
              expect(message.toLowerCase()).toMatch(/describe|spreadsheet|calculation/)
            }
          } else {
            // No context - should use base error messages
            if (errorType === 'ai_service_error') {
              expect(message.toLowerCase()).toMatch(/ai|busy|try again/)
            } else if (errorType === 'network_error') {
              expect(message.toLowerCase()).toMatch(/network|connection/)
            } else if (errorType === 'validation_error') {
              expect(message.toLowerCase()).toMatch(/input|check|try again/)
            } else if (errorType === 'rate_limit_error') {
              expect(message.toLowerCase()).toMatch(/wait|moment|try again/)
            }
          }
        }
      ), { numRuns: 50 })
    })
  })

  describe('State Preservation Property', () => {
    it('should preserve and restore user state during errors', () => {
      fc.assert(fc.property(
        fc.record({
          inputText: fc.string({ minLength: 1, maxLength: 500 }),
          selectedPlatform: fc.constantFrom('excel', 'google-sheets'),
          timestamp: fc.integer({ min: Date.now() - 1800000, max: Date.now() }) // Within last 30 minutes
        }),
        (state) => {
          // Clear any existing state
          mockLocalStorage.getItem.mockReturnValue(null)
          mockLocalStorage.setItem.mockClear()
          mockLocalStorage.removeItem.mockClear()
          
          // Test state preservation
          StatePreserver.preserveState(state)
          expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
            'excel_ai_preserved_state',
            JSON.stringify(state)
          )
          
          // Mock localStorage return for restoration test
          mockLocalStorage.getItem.mockReturnValue(JSON.stringify(state))
          
          // Test state restoration
          const restored = StatePreserver.restoreState()
          expect(restored).toEqual(state)
          
          // Test state clearing
          StatePreserver.clearState()
          expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('excel_ai_preserved_state')
        }
      ), { numRuns: 50 })
    })

    it('should not restore expired state', () => {
      fc.assert(fc.property(
        fc.record({
          inputText: fc.string({ minLength: 1 }),
          selectedPlatform: fc.constantFrom('excel', 'google-sheets'),
          timestamp: fc.integer({ min: 0, max: Date.now() - 3600001 }) // Older than 1 hour
        }),
        (expiredState) => {
          mockLocalStorage.getItem.mockReturnValue(JSON.stringify(expiredState))
          
          const restored = StatePreserver.restoreState()
          expect(restored).toBeNull()
        }
      ), { numRuns: 20 })
    })
  })

  describe('Application Stability Property', () => {
    it('should remain stable and functional after any error scenario', async () => {
      fc.assert(fc.asyncProperty(
        fc.record({
          input: fc.string({ minLength: 1, maxLength: 100 }),
          platform: fc.constantFrom('excel', 'google-sheets'),
          errorType: fc.constantFrom('network', 'api', 'timeout', 'invalid_response')
        }),
        async ({ input, platform, errorType }) => {
          // Setup different error scenarios
          switch (errorType) {
            case 'network':
              mockFetch.mockRejectedValue(new Error('Network error'))
              break
            case 'api':
              mockFetch.mockResolvedValue({
                ok: false,
                status: 503,
                json: () => Promise.resolve({ success: false, error: 'AI is busy' })
              })
              break
            case 'timeout':
              mockFetch.mockImplementation(() => 
                new Promise((_, reject) => 
                  setTimeout(() => reject(new Error('Request timeout')), 100)
                )
              )
              break
            case 'invalid_response':
              mockFetch.mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({ invalid: 'response' })
              })
              break
          }

          render(<Home />)
          
          // Verify initial state is stable
          expect(screen.getByTestId('formula-input')).toBeInTheDocument()
          expect(screen.getByTestId('generate-button')).toBeInTheDocument()
          
          // Fill input and trigger generation
          const input_element = screen.getByTestId('formula-input')
          const generateButton = screen.getByTestId('generate-button')
          
          fireEvent.change(input_element, { target: { value: input } })
          fireEvent.click(generateButton)
          
          // Wait for error handling to complete
          await waitFor(() => {
            expect(generateButton).not.toHaveAttribute('disabled')
          }, { timeout: 5000 })
          
          // Verify application remains stable
          expect(screen.getByTestId('formula-input')).toBeInTheDocument()
          expect(screen.getByTestId('generate-button')).toBeInTheDocument()
          
          // Verify input is preserved
          expect(input_element).toHaveValue(input)
          
          // Verify error is displayed appropriately
          const errorElements = screen.queryAllByText(/error|busy|try again|network/i)
          expect(errorElements.length).toBeGreaterThan(0)
          
          // Verify user can still interact with the interface
          expect(generateButton).not.toBeDisabled()
          
          // Test that retry functionality works
          fireEvent.click(generateButton)
          expect(generateButton).toBeDisabled() // Should show loading state
        }
      ), { numRuns: 20 })
    })
  })

  describe('Retry Mechanism Property', () => {
    it('should implement proper retry logic with exponential backoff', async () => {
      const retryManager = new RetryManager()
      let attemptCount = 0
      
      fc.assert(fc.asyncProperty(
        fc.constantFrom('network_error', 'ai_service_error'),
        async (errorType) => {
          attemptCount = 0
          
          const operation = jest.fn().mockImplementation(() => {
            attemptCount++
            if (attemptCount <= 2) {
              const error = new Error('Temporary failure')
              if (errorType === 'network_error') {
                error.name = 'NetworkError'
              } else {
                ;(error as any).status = 503
              }
              throw error
            }
            return Promise.resolve('success')
          })
          
          const startTime = Date.now()
          const result = await retryManager.executeWithRetry(operation)
          const endTime = Date.now()
          
          // Should eventually succeed
          expect(result).toBe('success')
          
          // Should have made multiple attempts
          expect(attemptCount).toBe(3)
          
          // Should have implemented delay (at least 1 second for retries)
          expect(endTime - startTime).toBeGreaterThan(1000)
          
          // Reset for next test
          retryManager.reset()
        }
      ), { numRuns: 10 })
    })
  })

  describe('Network Status Monitoring Property', () => {
    it('should properly monitor and respond to network status changes', () => {
      fc.assert(fc.property(
        fc.boolean(),
        (initialOnlineStatus) => {
          // Set initial navigator.onLine status
          navigator.onLine = initialOnlineStatus
          
          // Create a fresh network monitor instance for testing
          // Note: Since NetworkMonitor is a singleton, we test the behavior
          const networkMonitor = NetworkMonitor.getInstance()
          
          // Test status change callback
          let callbackCalled = false
          let callbackStatus = false
          
          const unsubscribe = networkMonitor.onStatusChange((online) => {
            callbackCalled = true
            callbackStatus = online
          })
          
          // Simulate network status change
          const newStatus = !initialOnlineStatus
          navigator.onLine = newStatus
          
          // Trigger the event
          const event = new Event(newStatus ? 'online' : 'offline')
          window.dispatchEvent(event)
          
          // Verify callback was called with correct status
          expect(callbackCalled).toBe(true)
          expect(callbackStatus).toBe(newStatus)
          
          // Verify the monitor's status is updated
          expect(networkMonitor.getStatus()).toBe(newStatus)
          
          // Test unsubscribe
          unsubscribe()
          
          // Reset for next test
          callbackCalled = false
          
          // Trigger another event to ensure unsubscribe worked
          const anotherEvent = new Event(initialOnlineStatus ? 'online' : 'offline')
          window.dispatchEvent(anotherEvent)
          
          // Callback should not have been called after unsubscribe
          expect(callbackCalled).toBe(false)
        }
      ), { numRuns: 20 })
    })
  })

  describe('Error Logging Property', () => {
    it('should log errors appropriately without exposing sensitive information', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      
      fc.assert(fc.property(
        fc.record({
          type: fc.constantFrom('ai_service_error', 'network_error', 'validation_error', 'rate_limit_error'),
          message: fc.string({ minLength: 1, maxLength: 200 }),
          details: fc.option(fc.string({ minLength: 10, maxLength: 500 }), { nil: undefined }) // Longer details to avoid false positives
        }),
        fc.record({
          context: fc.string({ minLength: 1, maxLength: 50 }),
          input: fc.string({ maxLength: 100 })
        }),
        (errorData, context) => {
          const appError = createAppError(
            errorData.type as ErrorType,
            errorData.message,
            errorData.details
          )
          
          // Clear previous calls
          consoleSpy.mockClear()
          mockVA.mockClear()
          
          // Log the error in development mode first
          const originalEnv = process.env.NODE_ENV
          process.env.NODE_ENV = 'development'
          
          logError(appError, context)
          
          // Verify console logging occurred
          expect(consoleSpy).toHaveBeenCalled()
          
          // Verify analytics tracking
          expect(mockVA).toHaveBeenCalledWith('track', 'app_error', {
            error_type: errorData.type,
            error_context: context.context
          })
          
          // In production mode, sensitive details should not be logged
          process.env.NODE_ENV = 'production'
          
          consoleSpy.mockClear()
          logError(appError, context)
          
          const loggedArgs = consoleSpy.mock.calls[0]
          const loggedString = JSON.stringify(loggedArgs)
          
          // Only check for details if they exist and are substantial enough to avoid false positives
          if (errorData.details && errorData.details.trim().length > 5) {
            expect(loggedString).not.toContain(errorData.details)
          }
          
          // Verify that production logs are minimal
          expect(loggedString).toContain('type')
          expect(loggedString).toContain('timestamp')
          
          process.env.NODE_ENV = originalEnv
        }
      ), { numRuns: 30 })
      
      consoleSpy.mockRestore()
    })
  })
})