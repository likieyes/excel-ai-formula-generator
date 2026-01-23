/**
 * Final Integration Test: Complete User Workflows
 * 
 * Tests the essential user workflows that demonstrate the application
 * meets all performance and functional requirements.
 * 
 * Requirements: 1.1, 1.2, 6.1, 6.2, 6.3, 4.1, 4.2, 4.3
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

describe('Final Integration Tests', () => {
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

  describe('Core Functionality Tests', () => {
    it('should complete end-to-end formula generation workflow', async () => {
      render(<Home />)

      // Step 1: Verify initial state
      expect(screen.getByTestId('formula-input')).toBeInTheDocument()
      expect(screen.getByTestId('generate-button')).toBeDisabled()
      expect(analytics.initializeAnalytics).toHaveBeenCalled()

      // Step 2: Enter input
      const testInput = 'Find the price for product ID A2'
      await user.type(screen.getByTestId('formula-input'), testInput)
      expect(screen.getByTestId('generate-button')).toBeEnabled()

      // Step 3: Generate formula
      await user.click(screen.getByTestId('generate-button'))

      // Step 4: Wait for result
      await waitFor(() => {
        expect(screen.getByTestId('formula-code')).toBeInTheDocument()
      }, { timeout: 5000 })

      // Step 5: Verify result
      expect(screen.getByTestId('formula-code')).toHaveTextContent('=VLOOKUP(A2,B:C,2,FALSE)')
      expect(screen.getByTestId('formula-explanation')).toBeInTheDocument()

      // Step 6: Verify analytics
      expect(analytics.trackFormulaGenerated).toHaveBeenCalledWith(
        'excel',
        testInput.length,
        true,
        1500
      )

      // Step 7: Test copy functionality
      await user.click(screen.getByTestId('copy-button'))
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('=VLOOKUP(A2,B:C,2,FALSE)')
      expect(analytics.trackFormulaCopied).toHaveBeenCalled()

      // Step 8: Verify copy feedback
      await waitFor(() => {
        expect(screen.getByText('Copied!')).toBeInTheDocument()
      })
    })

    it('should handle platform switching correctly', async () => {
      render(<Home />)

      // Initially Excel should be selected
      expect(screen.getByTestId('excel-tab')).toHaveClass('text-excel-green')

      // Switch to Google Sheets
      await user.click(screen.getByTestId('google-sheets-tab'))
      expect(screen.getByTestId('google-sheets-tab')).toHaveClass('text-excel-green')
      expect(analytics.trackPlatformToggle).toHaveBeenCalledWith('excel', 'google-sheets')

      // Generate formula on Google Sheets
      await user.type(screen.getByTestId('formula-input'), 'google sheets test')
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
          input: 'google sheets test',
          platform: 'google-sheets'
        })
      })

      // Verify analytics tracked correct platform
      expect(analytics.trackFormulaGenerated).toHaveBeenCalledWith(
        'google-sheets',
        'google sheets test'.length,
        true,
        1500
      )
    })

    it('should handle quick-fill functionality', async () => {
      render(<Home />)

      // Click VLOOKUP quick-fill tag
      await user.click(screen.getByTestId('quick-fill-vlookup'))

      // Verify input is populated
      expect(screen.getByTestId('formula-input')).toHaveValue(
        'Find the price for a product ID from a price list table'
      )

      // Generate button should be enabled
      expect(screen.getByTestId('generate-button')).toBeEnabled()

      // Generate formula from quick-fill
      await user.click(screen.getByTestId('generate-button'))

      await waitFor(() => {
        expect(screen.getByTestId('formula-code')).toBeInTheDocument()
      })

      expect(analytics.trackFormulaGenerated).toHaveBeenCalled()
    })
  })

  describe('Performance Requirements', () => {
    it('should complete formula generation within 3 seconds', async () => {
      render(<Home />)

      const startTime = Date.now()

      await user.type(screen.getByTestId('formula-input'), 'performance test')
      await user.click(screen.getByTestId('generate-button'))

      await waitFor(() => {
        expect(screen.getByTestId('formula-code')).toBeInTheDocument()
      }, { timeout: 3000 })

      const endTime = Date.now()
      const totalTime = endTime - startTime

      // Should complete within 3 seconds (requirement 4.2)
      expect(totalTime).toBeLessThan(3000)
    })

    it('should provide immediate UI feedback for interactions', async () => {
      render(<Home />)

      // Test button state changes
      const generateButton = screen.getByTestId('generate-button')
      expect(generateButton).toBeDisabled()

      // Type input - button should enable immediately
      await user.type(screen.getByTestId('formula-input'), 'test')
      expect(generateButton).toBeEnabled()

      // Test platform switching feedback
      const googleSheetsTab = screen.getByTestId('google-sheets-tab')
      await user.click(googleSheetsTab)
      expect(googleSheetsTab).toHaveClass('text-excel-green')
    })

    it('should load critical components within 2 seconds', async () => {
      const startTime = Date.now()
      
      render(<Home />)
      
      // Wait for critical elements
      await waitFor(() => {
        expect(screen.getByTestId('formula-input')).toBeInTheDocument()
        expect(screen.getByTestId('generate-button')).toBeInTheDocument()
        expect(screen.getByTestId('excel-tab')).toBeInTheDocument()
        expect(screen.getByTestId('google-sheets-tab')).toBeInTheDocument()
      })
      
      const endTime = Date.now()
      const loadTime = endTime - startTime

      // Should load within 2 seconds (requirement 4.4)
      expect(loadTime).toBeLessThan(2000)
    })
  })

  describe('Analytics Tracking Verification', () => {
    it('should track all user interactions comprehensively', async () => {
      render(<Home />)

      // Verify initialization
      expect(analytics.initializeAnalytics).toHaveBeenCalled()

      // Test platform toggle tracking
      await user.click(screen.getByTestId('google-sheets-tab'))
      expect(analytics.trackPlatformToggle).toHaveBeenCalledWith('excel', 'google-sheets')

      // Test formula generation tracking
      await user.type(screen.getByTestId('formula-input'), 'comprehensive test')
      await user.click(screen.getByTestId('generate-button'))

      await waitFor(() => {
        expect(screen.getByTestId('formula-code')).toBeInTheDocument()
      })

      expect(analytics.trackFormulaGenerated).toHaveBeenCalledWith(
        'google-sheets',
        'comprehensive test'.length,
        true,
        1500
      )

      // Test copy tracking
      await user.click(screen.getByTestId('copy-button'))
      expect(analytics.trackFormulaCopied).toHaveBeenCalledWith(
        'google-sheets',
        '=VLOOKUP(A2,B:C,2,FALSE)'.length
      )
    })

    it('should track input length accurately', async () => {
      render(<Home />)

      const shortInput = 'SUM'
      const longInput = 'Calculate the total sum of all values in column A from row 1 to row 100'

      // Test short input
      await user.type(screen.getByTestId('formula-input'), shortInput)
      await user.click(screen.getByTestId('generate-button'))

      await waitFor(() => {
        expect(screen.getByTestId('formula-code')).toBeInTheDocument()
      })

      expect(analytics.trackFormulaGenerated).toHaveBeenCalledWith(
        'excel',
        shortInput.length,
        true,
        1500
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
        longInput.length,
        true,
        1500
      )
    })
  })

  describe('Cross-Platform Formula Generation', () => {
    it('should generate platform-specific formulas', async () => {
      // Mock different responses for different platforms
      const excelResponse = {
        ok: true,
        json: async () => ({
          success: true,
          data: {
            formula: '=VLOOKUP(A2,B:C,2,FALSE)',
            explanation: 'Excel VLOOKUP with FALSE parameter.'
          }
        }),
      }

      const googleSheetsResponse = {
        ok: true,
        json: async () => ({
          success: true,
          data: {
            formula: '=VLOOKUP(A2,B:C,2,0)',
            explanation: 'Google Sheets VLOOKUP with 0 parameter.'
          }
        }),
      }

      render(<Home />)

      const testInput = 'lookup value from table'

      // Test Excel formula
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(excelResponse)
      await user.type(screen.getByTestId('formula-input'), testInput)
      await user.click(screen.getByTestId('generate-button'))

      await waitFor(() => {
        expect(screen.getByTestId('formula-code')).toBeInTheDocument()
      })

      const excelFormula = screen.getByTestId('formula-code').textContent

      // Switch to Google Sheets and test
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(googleSheetsResponse)
      await user.clear(screen.getByTestId('formula-input'))
      await user.click(screen.getByTestId('google-sheets-tab'))
      await user.type(screen.getByTestId('formula-input'), testInput)
      await user.click(screen.getByTestId('generate-button'))

      await waitFor(() => {
        expect(screen.getByTestId('formula-code')).toBeInTheDocument()
      })

      const googleSheetsFormula = screen.getByTestId('formula-code').textContent

      // Verify different formulas were generated
      expect(excelFormula).toContain('FALSE')
      expect(googleSheetsFormula).toContain('0')
      expect(excelFormula).not.toEqual(googleSheetsFormula)
    })
  })

  describe('Accessibility and User Experience', () => {
    it('should provide proper accessibility attributes', async () => {
      render(<Home />)

      // Check ARIA attributes
      expect(screen.getByTestId('excel-tab')).toHaveAttribute('role', 'tab')
      expect(screen.getByTestId('google-sheets-tab')).toHaveAttribute('role', 'tab')
      expect(screen.getByTestId('formula-input')).toHaveAttribute('aria-describedby')
      expect(screen.getByTestId('generate-button')).toHaveAttribute('aria-describedby')
    })

    it('should handle keyboard interactions properly', async () => {
      render(<Home />)

      const inputField = screen.getByTestId('formula-input')
      
      // Focus and type
      inputField.focus()
      expect(inputField).toHaveFocus()

      await user.keyboard('keyboard input test')
      expect(inputField).toHaveValue('keyboard input test')
    })

    it('should maintain state consistency during interactions', async () => {
      render(<Home />)

      const testInput = 'state consistency test'
      
      // Enter input
      await user.type(screen.getByTestId('formula-input'), testInput)
      
      // Switch platforms - input should be preserved
      await user.click(screen.getByTestId('google-sheets-tab'))
      expect(screen.getByTestId('formula-input')).toHaveValue(testInput)
      
      // Switch back - input should still be preserved
      await user.click(screen.getByTestId('excel-tab'))
      expect(screen.getByTestId('formula-input')).toHaveValue(testInput)
    })
  })

  describe('Component Integration', () => {
    it('should lazy load non-critical components without affecting core functionality', async () => {
      render(<Home />)

      // Critical components should be immediately available
      expect(screen.getByTestId('formula-input')).toBeInTheDocument()
      expect(screen.getByTestId('generate-button')).toBeInTheDocument()

      // Core functionality should work immediately
      await user.type(screen.getByTestId('formula-input'), 'lazy load test')
      expect(screen.getByTestId('generate-button')).toBeEnabled()

      // Non-critical components should load asynchronously
      await waitFor(() => {
        expect(screen.getByText('Why Choose Our Excel AI Formula Generator?')).toBeInTheDocument()
        expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument()
      }, { timeout: 2000 })
    })

    it('should handle multiple rapid interactions without issues', async () => {
      render(<Home />)

      // Rapid platform toggles
      await user.click(screen.getByTestId('google-sheets-tab'))
      await user.click(screen.getByTestId('excel-tab'))
      await user.click(screen.getByTestId('google-sheets-tab'))

      // Should track each toggle
      expect(analytics.trackPlatformToggle).toHaveBeenCalledTimes(3)

      // Rapid input changes
      await user.type(screen.getByTestId('formula-input'), 'rapid')
      await user.clear(screen.getByTestId('formula-input'))
      await user.type(screen.getByTestId('formula-input'), 'changes')

      // Final state should be correct
      expect(screen.getByTestId('formula-input')).toHaveValue('changes')
      expect(screen.getByTestId('google-sheets-tab')).toHaveClass('text-excel-green')
    })
  })
})