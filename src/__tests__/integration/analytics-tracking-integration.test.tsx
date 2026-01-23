/**
 * Integration Test: Analytics Tracking Throughout User Journey
 * 
 * Tests comprehensive analytics tracking across all user interactions
 * and verifies data collection meets requirements.
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from '@/app/page'
import * as analytics from '@/lib/analytics'

// Mock analytics module
jest.mock('@/lib/analytics', () => ({
  initializeAnalytics: jest.fn(),
  trackFormulaGenerated: jest.fn(),
  trackFormulaCopied: jest.fn(),
  trackPlatformToggle: jest.fn(),
  createProcessingTimer: jest.fn(() => () => 1200),
  getInputLength: jest.fn((input: string) => input.length),
}))

// Mock Vercel Analytics
jest.mock('@vercel/analytics/react', () => ({
  Analytics: () => null,
}))

// Mock successful API response
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: async () => ({
    success: true,
    data: {
      formula: '=SUM(A1:A10)',
      explanation: 'This formula calculates the sum of values in range A1:A10.'
    }
  }),
})

describe('Analytics Tracking Integration', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Initialization and Setup', () => {
    it('should initialize analytics on component mount', () => {
      render(<Home />)
      
      expect(analytics.initializeAnalytics).toHaveBeenCalledTimes(1)
    })
  })

  describe('Formula Generation Analytics', () => {
    it('should track successful formula generation with correct properties', async () => {
      render(<Home />)

      const testInput = 'Calculate the sum of values in column A'
      
      // Enter input and generate
      await user.type(screen.getByTestId('formula-input'), testInput)
      await user.click(screen.getByTestId('generate-button'))

      // Wait for completion
      await waitFor(() => {
        expect(screen.getByTestId('formula-code')).toBeInTheDocument()
      })

      // Verify analytics call
      expect(analytics.trackFormulaGenerated).toHaveBeenCalledWith(
        'excel', // platform
        testInput.length, // input length
        true, // success
        1200 // processing time
      )
    })

    it('should track failed formula generation with error type', async () => {
      // Mock API failure
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: async () => ({ error: 'Rate limit exceeded' }),
      })

      render(<Home />)

      await user.type(screen.getByTestId('formula-input'), 'test input')
      await user.click(screen.getByTestId('generate-button'))

      // Wait for error
      await waitFor(() => {
        expect(screen.getByText(/AI正忙，请稍后再试|An unexpected error occurred/)).toBeInTheDocument()
      })

      // Verify error analytics
      expect(analytics.trackFormulaGenerated).toHaveBeenCalledWith(
        'excel',
        10, // 'test input'.length
        false, // failure
        1200,
        'ai_service_error' // error type
      )
    })

    it('should track processing time accurately', async () => {
      // Mock different processing times
      const mockTimer = jest.fn()
      mockTimer.mockReturnValueOnce(850) // Fast response
      ;(analytics.createProcessingTimer as jest.Mock).mockReturnValue(mockTimer)

      render(<Home />)

      await user.type(screen.getByTestId('formula-input'), 'quick test')
      await user.click(screen.getByTestId('generate-button'))

      await waitFor(() => {
        expect(screen.getByTestId('formula-code')).toBeInTheDocument()
      })

      expect(analytics.trackFormulaGenerated).toHaveBeenCalledWith(
        'excel',
        10,
        true,
        850 // Should track actual processing time
      )
    })
  })

  describe('Platform Toggle Analytics', () => {
    it('should track platform switches with correct from/to values', async () => {
      render(<Home />)

      // Initial state is Excel, switch to Google Sheets
      await user.click(screen.getByTestId('google-sheets-tab'))

      expect(analytics.trackPlatformToggle).toHaveBeenCalledWith('excel', 'google-sheets')

      // Switch back to Excel
      await user.click(screen.getByTestId('excel-tab'))

      expect(analytics.trackPlatformToggle).toHaveBeenCalledWith('google-sheets', 'excel')
    })

    it('should not track platform toggle when clicking same platform', async () => {
      render(<Home />)

      // Click Excel tab (already selected)
      await user.click(screen.getByTestId('excel-tab'))

      // Should not track since no change occurred
      expect(analytics.trackPlatformToggle).not.toHaveBeenCalled()
    })

    it('should track platform in formula generation after toggle', async () => {
      render(<Home />)

      // Switch to Google Sheets
      await user.click(screen.getByTestId('google-sheets-tab'))
      
      // Generate formula
      await user.type(screen.getByTestId('formula-input'), 'test formula')
      await user.click(screen.getByTestId('generate-button'))

      await waitFor(() => {
        expect(screen.getByTestId('formula-code')).toBeInTheDocument()
      })

      // Verify formula generation tracked with correct platform
      expect(analytics.trackFormulaGenerated).toHaveBeenCalledWith(
        'google-sheets', // Should use switched platform
        12,
        true,
        1200
      )
    })
  })

  describe('Copy Formula Analytics', () => {
    it('should track formula copy with correct properties', async () => {
      // Mock clipboard API
      Object.assign(navigator, {
        clipboard: {
          writeText: jest.fn().mockResolvedValue(undefined),
        },
      })

      render(<Home />)

      // Generate a formula first
      await user.type(screen.getByTestId('formula-input'), 'sum formula')
      await user.click(screen.getByTestId('generate-button'))

      await waitFor(() => {
        expect(screen.getByTestId('formula-code')).toBeInTheDocument()
      })

      // Copy the formula
      await user.click(screen.getByTestId('copy-button'))

      // Verify copy analytics
      expect(analytics.trackFormulaCopied).toHaveBeenCalledWith(
        'excel', // platform
        '=SUM(A1:A10)'.length // formula length
      )
    })

    it('should track copy with different platforms', async () => {
      Object.assign(navigator, {
        clipboard: {
          writeText: jest.fn().mockResolvedValue(undefined),
        },
      })

      render(<Home />)

      // Switch to Google Sheets
      await user.click(screen.getByTestId('google-sheets-tab'))

      // Generate and copy formula
      await user.type(screen.getByTestId('formula-input'), 'google sheets formula')
      await user.click(screen.getByTestId('generate-button'))

      await waitFor(() => {
        expect(screen.getByTestId('formula-code')).toBeInTheDocument()
      })

      await user.click(screen.getByTestId('copy-button'))

      // Verify platform-specific tracking
      expect(analytics.trackFormulaCopied).toHaveBeenCalledWith(
        'google-sheets',
        '=SUM(A1:A10)'.length
      )
    })
  })

  describe('Input Length Tracking', () => {
    it('should accurately measure input length for analytics', async () => {
      render(<Home />)

      const shortInput = 'SUM'
      const longInput = 'Calculate the total sum of all values in column A from row 1 to row 100, excluding any empty cells'

      // Test short input
      await user.type(screen.getByTestId('formula-input'), shortInput)
      await user.click(screen.getByTestId('generate-button'))

      await waitFor(() => {
        expect(screen.getByTestId('formula-code')).toBeInTheDocument()
      })

      expect(analytics.trackFormulaGenerated).toHaveBeenCalledWith(
        'excel',
        shortInput.length, // 3
        true,
        1200
      )

      // Clear and test long input
      await user.clear(screen.getByTestId('formula-input'))
      await user.type(screen.getByTestId('formula-input'), longInput)
      await user.click(screen.getByTestId('generate-button'))

      await waitFor(() => {
        expect(screen.getByTestId('formula-code')).toBeInTheDocument()
      })

      expect(analytics.trackFormulaGenerated).toHaveBeenLastCalledWith(
        'excel',
        longInput.length, // Much longer
        true,
        1200
      )
    })
  })

  describe('Error Scenario Analytics', () => {
    it('should track different error types correctly', async () => {
      const errorScenarios = [
        {
          mockResponse: { ok: false, status: 400, json: async () => ({ error: 'Bad request' }) },
          expectedErrorType: 'validation_error'
        },
        {
          mockResponse: { ok: false, status: 429, json: async () => ({ error: 'Rate limited' }) },
          expectedErrorType: 'ai_service_error'
        },
        {
          mockResponse: { ok: false, status: 500, json: async () => ({ error: 'Server error' }) },
          expectedErrorType: 'ai_service_error'
        }
      ]

      for (const scenario of errorScenarios) {
        jest.clearAllMocks()
        ;(global.fetch as jest.Mock).mockResolvedValueOnce(scenario.mockResponse)

        render(<Home />)

        await user.type(screen.getByTestId('formula-input'), 'error test')
        await user.click(screen.getByTestId('generate-button'))

        await waitFor(() => {
          expect(screen.getByText(/AI正忙，请稍后再试|An unexpected error occurred/)).toBeInTheDocument()
        })

        expect(analytics.trackFormulaGenerated).toHaveBeenCalledWith(
          'excel',
          10,
          false,
          1200,
          scenario.expectedErrorType
        )
      }
    })

    it('should track network errors', async () => {
      ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network failure'))

      render(<Home />)

      await user.type(screen.getByTestId('formula-input'), 'network test')
      await user.click(screen.getByTestId('generate-button'))

      await waitFor(() => {
        expect(screen.getByText(/AI正忙，请稍后再试|An unexpected error occurred/)).toBeInTheDocument()
      })

      expect(analytics.trackFormulaGenerated).toHaveBeenCalledWith(
        'excel',
        12,
        false,
        1200,
        'network_error'
      )
    })
  })

  describe('Analytics Data Quality', () => {
    it('should provide consistent data across multiple interactions', async () => {
      render(<Home />)

      // Perform multiple interactions
      const interactions = [
        { input: 'First formula', platform: 'excel' },
        { input: 'Second formula', platform: 'google-sheets' },
        { input: 'Third formula', platform: 'excel' }
      ]

      for (let i = 0; i < interactions.length; i++) {
        const interaction = interactions[i]
        
        // Switch platform if needed
        if (interaction.platform === 'google-sheets') {
          await user.click(screen.getByTestId('google-sheets-tab'))
        } else {
          await user.click(screen.getByTestId('excel-tab'))
        }

        // Clear previous input and enter new
        await user.clear(screen.getByTestId('formula-input'))
        await user.type(screen.getByTestId('formula-input'), interaction.input)
        await user.click(screen.getByTestId('generate-button'))

        await waitFor(() => {
          expect(screen.getByTestId('formula-code')).toBeInTheDocument()
        })

        // Verify each call has correct data
        expect(analytics.trackFormulaGenerated).toHaveBeenNthCalledWith(
          i + 1,
          interaction.platform,
          interaction.input.length,
          true,
          1200
        )
      }
    })

    it('should handle rapid successive interactions', async () => {
      render(<Home />)

      // Rapid platform toggles
      await user.click(screen.getByTestId('google-sheets-tab'))
      await user.click(screen.getByTestId('excel-tab'))
      await user.click(screen.getByTestId('google-sheets-tab'))

      // Should track each toggle
      expect(analytics.trackPlatformToggle).toHaveBeenCalledTimes(3)
      expect(analytics.trackPlatformToggle).toHaveBeenNthCalledWith(1, 'excel', 'google-sheets')
      expect(analytics.trackPlatformToggle).toHaveBeenNthCalledWith(2, 'google-sheets', 'excel')
      expect(analytics.trackPlatformToggle).toHaveBeenNthCalledWith(3, 'excel', 'google-sheets')
    })
  })
})