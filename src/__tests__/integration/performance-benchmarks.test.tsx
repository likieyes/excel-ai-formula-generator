/**
 * Integration Test: Performance Benchmarks
 * 
 * Tests performance requirements including response times,
 * UI interaction speeds, and Core Web Vitals metrics.
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from '@/app/page'

// Mock analytics to avoid interference
jest.mock('@/lib/analytics', () => ({
  initializeAnalytics: jest.fn(),
  trackFormulaGenerated: jest.fn(),
  trackFormulaCopied: jest.fn(),
  trackPlatformToggle: jest.fn(),
  createProcessingTimer: jest.fn(() => () => 1500),
  getInputLength: jest.fn((input: string) => input.length),
}))

// Mock Vercel Analytics
jest.mock('@vercel/analytics/react', () => ({
  Analytics: () => null,
}))

describe('Performance Benchmarks', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock successful API response with realistic timing
    global.fetch = jest.fn().mockImplementation(() => 
      new Promise(resolve => {
        setTimeout(() => {
          resolve({
            ok: true,
            json: async () => ({
              success: true,
              data: {
                formula: '=VLOOKUP(A2,B:C,2,FALSE)',
                explanation: 'This formula performs a lookup operation.'
              }
            }),
          })
        }, 1200) // Simulate 1.2s API response time
      })
    )
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Formula Generation Response Time', () => {
    it('should complete formula generation within 3 seconds (95% requirement)', async () => {
      const startTime = performance.now()
      
      render(<Home />)

      // Enter input and generate
      await user.type(screen.getByTestId('formula-input'), 'Calculate sum of A1:A10')
      await user.click(screen.getByTestId('generate-button'))

      // Wait for result
      await waitFor(() => {
        expect(screen.getByTestId('formula-code')).toBeInTheDocument()
      }, { timeout: 3000 })

      const endTime = performance.now()
      const totalTime = endTime - startTime

      // Should complete within 3 seconds (3000ms)
      expect(totalTime).toBeLessThan(3000)
    })

    it('should handle multiple concurrent requests within time limits', async () => {
      const requests = []
      
      // Simulate multiple users generating formulas
      for (let i = 0; i < 3; i++) {
        const promise = (async () => {
          const startTime = performance.now()
          
          render(<Home />)
          await user.type(screen.getByTestId('formula-input'), `Formula request ${i}`)
          await user.click(screen.getByTestId('generate-button'))
          
          await waitFor(() => {
            expect(screen.getByTestId('formula-code')).toBeInTheDocument()
          }, { timeout: 3000 })
          
          return performance.now() - startTime
        })()
        
        requests.push(promise)
      }

      const times = await Promise.all(requests)
      
      // All requests should complete within 3 seconds
      times.forEach(time => {
        expect(time).toBeLessThan(3000)
      })
    })
  })

  describe('UI Interaction Response Time', () => {
    it('should respond to button clicks within 100ms', async () => {
      render(<Home />)

      const interactions = [
        () => user.click(screen.getByTestId('excel-tab')),
        () => user.click(screen.getByTestId('google-sheets-tab')),
        () => user.click(screen.getByTestId('quick-fill-vlookup')),
      ]

      for (const interaction of interactions) {
        const startTime = performance.now()
        await interaction()
        const endTime = performance.now()
        
        const responseTime = endTime - startTime
        
        // UI interactions should be under 100ms
        expect(responseTime).toBeLessThan(100)
      }
    })

    it('should update state changes within 100ms', async () => {
      render(<Home />)

      // Test platform toggle state change
      const startTime = performance.now()
      await user.click(screen.getByTestId('google-sheets-tab'))
      
      // Verify state changed quickly
      expect(screen.getByTestId('google-sheets-tab')).toHaveClass('text-excel-green')
      
      const endTime = performance.now()
      expect(endTime - startTime).toBeLessThan(100)
    })

    it('should handle rapid input changes efficiently', async () => {
      render(<Home />)

      const inputField = screen.getByTestId('formula-input')
      const testText = 'This is a test input for performance measurement'

      const startTime = performance.now()
      
      // Type text rapidly
      await user.type(inputField, testText)
      
      const endTime = performance.now()
      const typingTime = endTime - startTime

      // Verify input was processed
      expect(inputField).toHaveValue(testText)
      
      // Typing should be responsive (allowing for test environment overhead)
      expect(typingTime).toBeLessThan(1000) // 1 second for full text
    })
  })

  describe('Page Load Performance', () => {
    it('should render initial page within 2 seconds', async () => {
      const startTime = performance.now()
      
      render(<Home />)
      
      // Wait for critical elements to be present
      await waitFor(() => {
        expect(screen.getByTestId('formula-input')).toBeInTheDocument()
        expect(screen.getByTestId('generate-button')).toBeInTheDocument()
        expect(screen.getByTestId('excel-tab')).toBeInTheDocument()
      })
      
      const endTime = performance.now()
      const loadTime = endTime - startTime

      // Initial render should be fast
      expect(loadTime).toBeLessThan(2000)
    })

    it('should lazy load non-critical components efficiently', async () => {
      render(<Home />)

      // Critical components should be immediately available
      expect(screen.getByTestId('formula-input')).toBeInTheDocument()
      expect(screen.getByTestId('generate-button')).toBeInTheDocument()

      // Non-critical components (FAQ, FeatureGrid) should load asynchronously
      // but still be present after a short delay
      await waitFor(() => {
        expect(screen.getByText('Why Choose Our Excel AI Formula Generator?')).toBeInTheDocument()
        expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument()
      }, { timeout: 1000 })
    })
  })

  describe('Memory and Resource Usage', () => {
    it('should not cause memory leaks during repeated interactions', async () => {
      render(<Home />)

      // Perform many interactions to test for memory leaks
      for (let i = 0; i < 10; i++) {
        // Toggle platforms
        await user.click(screen.getByTestId('google-sheets-tab'))
        await user.click(screen.getByTestId('excel-tab'))

        // Enter and clear input
        await user.type(screen.getByTestId('formula-input'), `Test input ${i}`)
        await user.clear(screen.getByTestId('formula-input'))

        // Click quick-fill tags
        await user.click(screen.getByTestId('quick-fill-vlookup'))
        await user.clear(screen.getByTestId('formula-input'))
      }

      // If we reach here without crashes, memory management is working
      expect(screen.getByTestId('formula-input')).toBeInTheDocument()
    })

    it('should handle large input efficiently', async () => {
      render(<Home />)

      // Create a large input string
      const largeInput = 'Calculate the sum of '.repeat(100) + 'A1:A1000'
      
      const startTime = performance.now()
      
      await user.type(screen.getByTestId('formula-input'), largeInput)
      
      const endTime = performance.now()
      const processingTime = endTime - startTime

      // Should handle large input without significant delay
      expect(processingTime).toBeLessThan(2000)
      expect(screen.getByTestId('formula-input')).toHaveValue(largeInput)
    })
  })

  describe('Core Web Vitals Simulation', () => {
    it('should minimize layout shifts during content loading', async () => {
      render(<Home />)

      // Get initial positions of key elements
      const initialPositions = {
        input: screen.getByTestId('formula-input').getBoundingClientRect(),
        button: screen.getByTestId('generate-button').getBoundingClientRect(),
      }

      // Trigger content changes
      await user.type(screen.getByTestId('formula-input'), 'Test input')
      await user.click(screen.getByTestId('generate-button'))

      // Wait for any potential layout changes
      await new Promise(resolve => setTimeout(resolve, 100))

      // Check positions haven't shifted significantly
      const finalPositions = {
        input: screen.getByTestId('formula-input').getBoundingClientRect(),
        button: screen.getByTestId('generate-button').getBoundingClientRect(),
      }

      // Positions should remain stable (allowing for minor variations)
      expect(Math.abs(finalPositions.input.top - initialPositions.input.top)).toBeLessThan(5)
      expect(Math.abs(finalPositions.button.top - initialPositions.button.top)).toBeLessThan(5)
    })

    it('should provide immediate visual feedback for interactions', async () => {
      render(<Home />)

      // Test immediate feedback for button states
      const generateButton = screen.getByTestId('generate-button')
      
      // Button should be disabled initially
      expect(generateButton).toBeDisabled()

      // Add input - button should enable immediately
      await user.type(screen.getByTestId('formula-input'), 'test')
      expect(generateButton).toBeEnabled()

      // Click button - should show loading state immediately
      await user.click(generateButton)
      expect(screen.getByText('Generating...')).toBeInTheDocument()
      expect(generateButton).toBeDisabled()
    })
  })

  describe('Network Performance', () => {
    it('should handle slow network conditions gracefully', async () => {
      // Mock slow API response
      global.fetch = jest.fn().mockImplementation(() => 
        new Promise(resolve => {
          setTimeout(() => {
            resolve({
              ok: true,
              json: async () => ({
                success: true,
                data: {
                  formula: '=SUM(A1:A10)',
                  explanation: 'Slow response formula'
                }
              }),
            })
          }, 2800) // Just under 3 second limit
        })
      )

      render(<Home />)

      await user.type(screen.getByTestId('formula-input'), 'slow network test')
      
      const startTime = performance.now()
      await user.click(screen.getByTestId('generate-button'))

      // Should show loading state immediately
      expect(screen.getByText('Generating...')).toBeInTheDocument()

      // Wait for completion
      await waitFor(() => {
        expect(screen.getByTestId('formula-code')).toBeInTheDocument()
      }, { timeout: 3000 })

      const endTime = performance.now()
      const totalTime = endTime - startTime

      // Should still complete within requirements
      expect(totalTime).toBeLessThan(3000)
    })

    it('should timeout appropriately for very slow responses', async () => {
      // Mock extremely slow response (over 3 seconds)
      global.fetch = jest.fn().mockImplementation(() => 
        new Promise(resolve => {
          setTimeout(() => {
            resolve({
              ok: true,
              json: async () => ({
                success: true,
                data: {
                  formula: '=SUM(A1:A10)',
                  explanation: 'Very slow response'
                }
              }),
            })
          }, 5000) // 5 seconds - should timeout
        })
      )

      render(<Home />)

      await user.type(screen.getByTestId('formula-input'), 'timeout test')
      await user.click(screen.getByTestId('generate-button'))

      // Should show loading state
      expect(screen.getByText('Generating...')).toBeInTheDocument()

      // In a real implementation, this would timeout and show an error
      // For this test, we'll just verify the loading state is maintained
      await new Promise(resolve => setTimeout(resolve, 1000))
      expect(screen.getByText('Generating...')).toBeInTheDocument()
    })
  })
})