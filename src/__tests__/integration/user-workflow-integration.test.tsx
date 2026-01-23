/**
 * Integration Test: Complete User Workflow
 * 
 * Tests the essential user workflows including formula generation,
 * platform switching, and error handling.
 * 
 * Requirements: 1.1, 1.2, 6.1, 6.2, 6.3, 7.4, 7.5
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from '@/app/page'
import * as analytics from '@/lib/analytics'

// Mock analytics module
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

describe('User Workflow Integration', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock clipboard API
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
      configurable: true,
    })
    
    // Mock successful API response
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          formula: '=VLOOKUP(A2,B:C,2,FALSE)',
          explanation: 'This formula looks up the value in A2 within the range B:C and returns the corresponding value from column 2.'
        }
      }),
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Basic Formula Generation Workflow', () => {
    it('should complete a successful formula generation workflow', async () => {
      render(<Home />)

      // Verify initial state
      expect(screen.getByTestId('formula-input')).toBeInTheDocument()
      expect(screen.getByTestId('generate-button')).toBeDisabled()

      // Enter input
      const testInput = 'Find the price for product ID A2'
      await user.type(screen.getByTestId('formula-input'), testInput)

      // Button should be enabled
      expect(screen.getByTestId('generate-button')).toBeEnabled()

      // Generate formula
      await user.click(screen.getByTestId('generate-button'))

      // Wait for result
      await waitFor(() => {
        expect(screen.getByTestId('formula-code')).toBeInTheDocument()
      }, { timeout: 5000 })

      // Verify result is displayed
      expect(screen.getByTestId('formula-code')).toHaveTextContent('=VLOOKUP(A2,B:C,2,FALSE)')
      expect(screen.getByTestId('formula-explanation')).toBeInTheDocument()

      // Verify analytics was called
      expect(analytics.trackFormulaGenerated).toHaveBeenCalledWith(
        'excel',
        testInput.length,
        true,
        1500
      )
    })

    it('should handle copy functionality', async () => {
      render(<Home />)

      // Generate a formula first
      await user.type(screen.getByTestId('formula-input'), 'test formula')
      await user.click(screen.getByTestId('generate-button'))

      await waitFor(() => {
        expect(screen.getByTestId('formula-code')).toBeInTheDocument()
      })

      // Copy the formula
      await user.click(screen.getByTestId('copy-button'))

      // Verify copy was called
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('=VLOOKUP(A2,B:C,2,FALSE)')

      // Verify copy analytics
      expect(analytics.trackFormulaCopied).toHaveBeenCalledWith(
        'excel',
        '=VLOOKUP(A2,B:C,2,FALSE)'.length
      )

      // Verify copy feedback
      await waitFor(() => {
        expect(screen.getByText('Copied!')).toBeInTheDocument()
      })
    })
  })

  describe('Platform Switching', () => {
    it('should handle platform switching correctly', async () => {
      render(<Home />)

      // Initially Excel should be selected
      expect(screen.getByTestId('excel-tab')).toHaveClass('text-excel-green')

      // Switch to Google Sheets
      await user.click(screen.getByTestId('google-sheets-tab'))

      // Verify platform switch
      expect(screen.getByTestId('google-sheets-tab')).toHaveClass('text-excel-green')
      expect(analytics.trackPlatformToggle).toHaveBeenCalledWith('excel', 'google-sheets')

      // Generate formula on Google Sheets
      await user.type(screen.getByTestId('formula-input'), 'google sheets formula')
      await user.click(screen.getByTestId('generate-button'))

      await waitFor(() => {
        expect(screen.getByTestId('formula-code')).toBeInTheDocument()
      })

      // Verify API was called with correct platform
      expect(global.fetch).toHaveBeenCalledWith('/api/generate-formula', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: 'google sheets formula',
          platform: 'google-sheets'
        })
      })
    })
  })

  describe('Quick-Fill Functionality', () => {
    it('should populate input with quick-fill tags', async () => {
      render(<Home />)

      // Click VLOOKUP quick-fill tag
      await user.click(screen.getByTestId('quick-fill-vlookup'))

      // Verify input is populated
      expect(screen.getByTestId('formula-input')).toHaveValue(
        'Find the price for a product ID from a price list table'
      )

      // Generate button should be enabled
      expect(screen.getByTestId('generate-button')).toBeEnabled()
    })
  })

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      // Mock API error
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal server error' }),
      })

      render(<Home />)

      await user.type(screen.getByTestId('formula-input'), 'test input')
      await user.click(screen.getByTestId('generate-button'))

      // Wait for error message
      await waitFor(() => {
        expect(screen.getByText(/AI is busy/)).toBeInTheDocument()
      }, { timeout: 5000 })

      // Verify error analytics
      expect(analytics.trackFormulaGenerated).toHaveBeenCalledWith(
        'excel',
        10,
        false,
        1500,
        'ai_service_error'
      )
    })

    it('should preserve input during errors', async () => {
      // Mock API error
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Server error' }),
      })

      render(<Home />)

      const testInput = 'preserve this input'
      await user.type(screen.getByTestId('formula-input'), testInput)
      await user.click(screen.getByTestId('generate-button'))

      // Wait for error
      await waitFor(() => {
        expect(screen.getByText(/AI is busy/)).toBeInTheDocument()
      })

      // Input should be preserved
      expect(screen.getByTestId('formula-input')).toHaveValue(testInput)
    })
  })

  describe('Performance Requirements', () => {
    it('should complete formula generation within reasonable time', async () => {
      render(<Home />)

      const startTime = Date.now()

      await user.type(screen.getByTestId('formula-input'), 'performance test')
      await user.click(screen.getByTestId('generate-button'))

      await waitFor(() => {
        expect(screen.getByTestId('formula-code')).toBeInTheDocument()
      }, { timeout: 3000 })

      const endTime = Date.now()
      const totalTime = endTime - startTime

      // Should complete within 3 seconds (requirement)
      expect(totalTime).toBeLessThan(3000)
    })

    it('should provide immediate UI feedback', async () => {
      // Mock a delayed API response to ensure loading state is visible
      ;(global.fetch as jest.Mock).mockImplementationOnce(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({
            ok: true,
            json: async () => ({
              success: true,
              data: {
                formula: '=VLOOKUP(A2,B:C,2,FALSE)',
                explanation: 'This formula looks up the value in A2 within the range B:C and returns the corresponding value from column 2.'
              }
            }),
          }), 100) // 100ms delay to ensure loading state is visible
        )
      )

      render(<Home />)

      await user.type(screen.getByTestId('formula-input'), 'ui feedback test')
      
      // Button should enable immediately after typing
      expect(screen.getByTestId('generate-button')).toBeEnabled()

      // Click the button
      await user.click(screen.getByTestId('generate-button'))

      // Should show loading state immediately
      await waitFor(() => {
        expect(screen.getByText('Generating...')).toBeInTheDocument()
      }, { timeout: 100 })
      
      expect(screen.getByTestId('generate-button')).toBeDisabled()
    })
  })

  describe('Analytics Integration', () => {
    it('should track all user interactions', async () => {
      render(<Home />)

      // Initialize analytics should be called
      expect(analytics.initializeAnalytics).toHaveBeenCalled()

      // Platform toggle
      await user.click(screen.getByTestId('google-sheets-tab'))
      expect(analytics.trackPlatformToggle).toHaveBeenCalledWith('excel', 'google-sheets')

      // Formula generation
      await user.type(screen.getByTestId('formula-input'), 'analytics test')
      await user.click(screen.getByTestId('generate-button'))

      await waitFor(() => {
        expect(screen.getByTestId('formula-code')).toBeInTheDocument()
      })

      expect(analytics.trackFormulaGenerated).toHaveBeenCalledWith(
        'google-sheets',
        'analytics test'.length,
        true,
        1500
      )

      // Copy formula
      await user.click(screen.getByTestId('copy-button'))
      expect(analytics.trackFormulaCopied).toHaveBeenCalledWith(
        'google-sheets',
        '=VLOOKUP(A2,B:C,2,FALSE)'.length
      )
    })
  })

  describe('Accessibility', () => {
    it('should provide proper accessibility attributes', async () => {
      render(<Home />)

      // Check ARIA attributes
      expect(screen.getByTestId('excel-tab')).toHaveAttribute('role', 'tab')
      expect(screen.getByTestId('google-sheets-tab')).toHaveAttribute('role', 'tab')
      expect(screen.getByTestId('formula-input')).toHaveAttribute('aria-describedby')
      expect(screen.getByTestId('generate-button')).toHaveAttribute('aria-describedby')
    })

    it('should handle keyboard interactions', async () => {
      render(<Home />)

      const inputField = screen.getByTestId('formula-input')
      
      // Focus input field
      inputField.focus()
      expect(inputField).toHaveFocus()

      // Type using keyboard
      await user.keyboard('keyboard test input')
      expect(inputField).toHaveValue('keyboard test input')
    })
  })
})