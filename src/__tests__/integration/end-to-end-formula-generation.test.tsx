/**
 * Integration Test: End-to-End Formula Generation Flow
 * 
 * Tests the complete user journey from input to formula generation,
 * including analytics tracking and error handling.
 * 
 * Requirements: 1.1, 1.2, 6.1, 6.2, 6.3
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from '@/app/page'
import * as analytics from '@/lib/analytics'

// Mock the analytics module
jest.mock('@/lib/analytics', () => ({
  initializeAnalytics: jest.fn(),
  trackFormulaGenerated: jest.fn(),
  trackFormulaCopied: jest.fn(),
  trackPlatformToggle: jest.fn(),
  createProcessingTimer: jest.fn(() => () => 1500), // Mock 1.5s processing time
  getInputLength: jest.fn((input: string) => input.length),
}))

// Mock the API endpoint
const mockApiResponse = {
  success: true,
  data: {
    formula: '=VLOOKUP(A2,B:C,2,FALSE)',
    explanation: 'This formula looks up the value in A2 within the range B:C and returns the corresponding value from column 2.'
  }
}

// Mock fetch globally
global.fetch = jest.fn()

describe('End-to-End Formula Generation Flow', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse,
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Complete User Journey', () => {
    it('should complete the full formula generation workflow', async () => {
      render(<Home />)

      // Step 1: Verify initial state
      expect(screen.getByTestId('formula-input')).toBeInTheDocument()
      expect(screen.getByTestId('generate-button')).toBeDisabled()
      expect(analytics.initializeAnalytics).toHaveBeenCalled()

      // Step 2: User enters input
      const input = 'Find the price for product ID A2 from price list'
      const inputField = screen.getByTestId('formula-input')
      await user.type(inputField, input)

      expect(inputField).toHaveValue(input)
      expect(screen.getByTestId('generate-button')).toBeEnabled()

      // Step 3: User generates formula
      const generateButton = screen.getByTestId('generate-button')
      await user.click(generateButton)

      // Verify loading state
      expect(generateButton).toBeDisabled()
      expect(screen.getByText('Generating...')).toBeInTheDocument()

      // Step 4: Wait for API response and result display
      await waitFor(() => {
        expect(screen.getByTestId('formula-code')).toBeInTheDocument()
      })

      // Verify formula is displayed
      expect(screen.getByTestId('formula-code')).toHaveTextContent('=VLOOKUP(A2,B:C,2,FALSE)')
      expect(screen.getByTestId('formula-explanation')).toHaveTextContent(mockApiResponse.data.explanation)

      // Step 5: Verify analytics tracking
      expect(analytics.trackFormulaGenerated).toHaveBeenCalledWith(
        'excel', // default platform
        input.length,
        true, // success
        1500 // processing time
      )

      // Step 6: User copies formula
      const copyButton = screen.getByTestId('copy-button')
      await user.click(copyButton)

      // Verify copy feedback
      await waitFor(() => {
        expect(screen.getByText('Copied!')).toBeInTheDocument()
      })

      // Verify copy analytics
      expect(analytics.trackFormulaCopied).toHaveBeenCalledWith(
        'excel',
        mockApiResponse.data.formula.length
      )

      // Step 7: Verify API was called correctly
      expect(global.fetch).toHaveBeenCalledWith('/api/generate-formula', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: input.trim(),
          platform: 'excel'
        })
      })
    })

    it('should handle platform switching during workflow', async () => {
      render(<Home />)

      // Step 1: Switch to Google Sheets
      const googleSheetsTab = screen.getByTestId('google-sheets-tab')
      await user.click(googleSheetsTab)

      // Verify platform toggle analytics
      expect(analytics.trackPlatformToggle).toHaveBeenCalledWith('excel', 'google-sheets')

      // Step 2: Enter input and generate
      const input = 'Calculate sum of range A1:A10'
      await user.type(screen.getByTestId('formula-input'), input)
      await user.click(screen.getByTestId('generate-button'))

      // Step 3: Verify API called with correct platform
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/generate-formula', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            input: input.trim(),
            platform: 'google-sheets'
          })
        })
      })

      // Step 4: Verify analytics with correct platform
      await waitFor(() => {
        expect(analytics.trackFormulaGenerated).toHaveBeenCalledWith(
          'google-sheets',
          input.length,
          true,
          1500
        )
      })
    })

    it('should handle quick-fill tag workflow', async () => {
      render(<Home />)

      // Step 1: Click VLOOKUP quick-fill tag
      const vlookupTag = screen.getByTestId('quick-fill-vlookup')
      await user.click(vlookupTag)

      // Step 2: Verify input is populated
      const inputField = screen.getByTestId('formula-input')
      expect(inputField).toHaveValue('Find the price for a product ID from a price list table')

      // Step 3: Generate formula
      await user.click(screen.getByTestId('generate-button'))

      // Step 4: Verify workflow completes
      await waitFor(() => {
        expect(screen.getByTestId('formula-code')).toBeInTheDocument()
      })

      expect(analytics.trackFormulaGenerated).toHaveBeenCalled()
    })
  })

  describe('Error Scenarios and Recovery', () => {
    it('should handle API errors gracefully', async () => {
      // Mock API error
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal server error' }),
      })

      render(<Home />)

      // Enter input and generate
      await user.type(screen.getByTestId('formula-input'), 'test input')
      await user.click(screen.getByTestId('generate-button'))

      // Verify error is displayed
      await waitFor(() => {
        expect(screen.getByText(/AI正忙，请稍后再试|An unexpected error occurred/)).toBeInTheDocument()
      })

      // Verify error analytics
      expect(analytics.trackFormulaGenerated).toHaveBeenCalledWith(
        'excel',
        10, // 'test input'.length
        false, // failure
        1500,
        'ai_service_error'
      )

      // Verify retry functionality
      const retryButton = screen.getByText('Try Again')
      expect(retryButton).toBeInTheDocument()
    })

    it('should handle network errors', async () => {
      // Mock network error
      ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

      render(<Home />)

      await user.type(screen.getByTestId('formula-input'), 'test input')
      await user.click(screen.getByTestId('generate-button'))

      // Verify error handling
      await waitFor(() => {
        expect(screen.getByText(/AI正忙，请稍后再试|An unexpected error occurred/)).toBeInTheDocument()
      })

      expect(analytics.trackFormulaGenerated).toHaveBeenCalledWith(
        'excel',
        10,
        false,
        1500,
        'network_error'
      )
    })

    it('should preserve state during errors', async () => {
      // Mock API error
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Server error' }),
      })

      render(<Home />)

      const testInput = 'test formula input'
      
      // Switch platform and enter input
      await user.click(screen.getByTestId('google-sheets-tab'))
      await user.type(screen.getByTestId('formula-input'), testInput)
      await user.click(screen.getByTestId('generate-button'))

      // Wait for error
      await waitFor(() => {
        expect(screen.getByText(/AI正忙，请稍后再试|An unexpected error occurred/)).toBeInTheDocument()
      })

      // Verify state is preserved
      expect(screen.getByTestId('formula-input')).toHaveValue(testInput)
      expect(screen.getByTestId('google-sheets-tab')).toHaveClass('text-excel-green')
    })
  })

  describe('Performance Requirements', () => {
    it('should track processing time within performance requirements', async () => {
      // Mock faster response time
      ;(analytics.createProcessingTimer as jest.Mock).mockReturnValue(() => 2500) // 2.5s

      render(<Home />)

      await user.type(screen.getByTestId('formula-input'), 'test input')
      await user.click(screen.getByTestId('generate-button'))

      await waitFor(() => {
        expect(screen.getByTestId('formula-code')).toBeInTheDocument()
      })

      // Verify processing time is tracked
      expect(analytics.trackFormulaGenerated).toHaveBeenCalledWith(
        'excel',
        10,
        true,
        2500 // Should be < 3000ms per requirements
      )
    })

    it('should handle UI interactions within 100ms requirement', async () => {
      render(<Home />)

      const startTime = performance.now()
      
      // Test button click responsiveness
      await user.click(screen.getByTestId('excel-tab'))
      
      const endTime = performance.now()
      const interactionTime = endTime - startTime

      // UI interaction should be fast (this is more of a smoke test)
      expect(interactionTime).toBeLessThan(100)
    })
  })

  describe('Accessibility and User Experience', () => {
    it('should provide proper ARIA labels and roles', async () => {
      render(<Home />)

      // Verify accessibility attributes
      expect(screen.getByTestId('excel-tab')).toHaveAttribute('role', 'tab')
      expect(screen.getByTestId('google-sheets-tab')).toHaveAttribute('role', 'tab')
      expect(screen.getByTestId('formula-input')).toHaveAttribute('aria-describedby')
      expect(screen.getByTestId('generate-button')).toHaveAttribute('aria-describedby')
    })

    it('should handle keyboard navigation', async () => {
      render(<Home />)

      const inputField = screen.getByTestId('formula-input')
      
      // Focus input field
      inputField.focus()
      expect(inputField).toHaveFocus()

      // Tab to generate button
      await user.tab()
      expect(screen.getByTestId('generate-button')).toHaveFocus()
    })
  })
})