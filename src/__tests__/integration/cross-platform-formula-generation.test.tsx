/**
 * Integration Test: Cross-Platform Formula Generation
 * 
 * Tests formula generation across Excel and Google Sheets platforms,
 * verifying platform-specific syntax and behavior.
 * 
 * Requirements: 1.3, 1.4, 8.4
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from '@/app/page'

// Mock analytics
jest.mock('@/lib/analytics', () => ({
  initializeAnalytics: jest.fn(),
  trackFormulaGenerated: jest.fn(),
  trackFormulaCopied: jest.fn(),
  trackPlatformToggle: jest.fn(),
  createProcessingTimer: jest.fn(() => () => 1500),
  getInputLength: jest.fn((input: string) => input.length),
}))

describe('Cross-Platform Formula Generation', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Excel Platform Formulas', () => {
    beforeEach(() => {
      // Mock Excel-specific API responses
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            formula: '=VLOOKUP(A2,B:C,2,FALSE)',
            explanation: 'Excel VLOOKUP formula with FALSE for exact match.'
          }
        }),
      })
    })

    it('should generate Excel-compatible VLOOKUP formulas', async () => {
      render(<Home />)

      // Ensure Excel is selected (default)
      expect(screen.getByTestId('excel-tab')).toHaveClass('text-excel-green')

      // Generate VLOOKUP formula
      await user.type(screen.getByTestId('formula-input'), 'Find the price for product ID A2 from price list')
      await user.click(screen.getByTestId('generate-button'))

      // Wait for result
      await waitFor(() => {
        expect(screen.getByTestId('formula-code')).toBeInTheDocument()
      })

      // Verify Excel-specific syntax
      expect(screen.getByTestId('formula-code')).toHaveTextContent('=VLOOKUP(A2,B:C,2,FALSE)')
      
      // Verify API was called with Excel platform
      expect(global.fetch).toHaveBeenCalledWith('/api/generate-formula', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: 'Find the price for product ID A2 from price list',
          platform: 'excel'
        })
      })
    })

    it('should generate Excel IF statements with proper syntax', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            formula: '=IF(A1>80,"Pass","Fail")',
            explanation: 'Excel IF statement checking if A1 is greater than 80.'
          }
        }),
      })

      render(<Home />)

      await user.type(screen.getByTestId('formula-input'), 'If score in A1 is greater than 80, show Pass, otherwise Fail')
      await user.click(screen.getByTestId('generate-button'))

      await waitFor(() => {
        expect(screen.getByTestId('formula-code')).toBeInTheDocument()
      })

      expect(screen.getByTestId('formula-code')).toHaveTextContent('=IF(A1>80,"Pass","Fail")')
    })

    it('should generate Excel SUM formulas', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            formula: '=SUM(A1:A10)',
            explanation: 'Excel SUM formula for range A1 to A10.'
          }
        }),
      })

      render(<Home />)

      await user.type(screen.getByTestId('formula-input'), 'Calculate the sum of values in A1 to A10')
      await user.click(screen.getByTestId('generate-button'))

      await waitFor(() => {
        expect(screen.getByTestId('formula-code')).toBeInTheDocument()
      })

      expect(screen.getByTestId('formula-code')).toHaveTextContent('=SUM(A1:A10)')
    })
  })

  describe('Google Sheets Platform Formulas', () => {
    beforeEach(() => {
      // Mock Google Sheets-specific API responses
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            formula: '=VLOOKUP(A2,B:C,2,0)',
            explanation: 'Google Sheets VLOOKUP formula with 0 for exact match.'
          }
        }),
      })
    })

    it('should generate Google Sheets-compatible VLOOKUP formulas', async () => {
      render(<Home />)

      // Switch to Google Sheets
      await user.click(screen.getByTestId('google-sheets-tab'))
      expect(screen.getByTestId('google-sheets-tab')).toHaveClass('text-excel-green')

      // Generate VLOOKUP formula
      await user.type(screen.getByTestId('formula-input'), 'Find the price for product ID A2 from price list')
      await user.click(screen.getByTestId('generate-button'))

      await waitFor(() => {
        expect(screen.getByTestId('formula-code')).toBeInTheDocument()
      })

      // Verify Google Sheets-specific syntax (0 instead of FALSE)
      expect(screen.getByTestId('formula-code')).toHaveTextContent('=VLOOKUP(A2,B:C,2,0)')
      
      // Verify API was called with Google Sheets platform
      expect(global.fetch).toHaveBeenCalledWith('/api/generate-formula', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: 'Find the price for product ID A2 from price list',
          platform: 'google-sheets'
        })
      })
    })

    it('should generate Google Sheets QUERY functions', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            formula: '=QUERY(A:C,"SELECT A, B WHERE C > 100")',
            explanation: 'Google Sheets QUERY function to select columns A and B where column C is greater than 100.'
          }
        }),
      })

      render(<Home />)

      // Switch to Google Sheets
      await user.click(screen.getByTestId('google-sheets-tab'))

      await user.type(screen.getByTestId('formula-input'), 'Select columns A and B where column C is greater than 100')
      await user.click(screen.getByTestId('generate-button'))

      await waitFor(() => {
        expect(screen.getByTestId('formula-code')).toBeInTheDocument()
      })

      expect(screen.getByTestId('formula-code')).toHaveTextContent('=QUERY(A:C,"SELECT A, B WHERE C > 100")')
    })

    it('should generate Google Sheets ARRAYFORMULA', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            formula: '=ARRAYFORMULA(A2:A*B2:B)',
            explanation: 'Google Sheets ARRAYFORMULA to multiply corresponding values in columns A and B.'
          }
        }),
      })

      render(<Home />)

      await user.click(screen.getByTestId('google-sheets-tab'))

      await user.type(screen.getByTestId('formula-input'), 'Multiply all values in column A by corresponding values in column B')
      await user.click(screen.getByTestId('generate-button'))

      await waitFor(() => {
        expect(screen.getByTestId('formula-code')).toBeInTheDocument()
      })

      expect(screen.getByTestId('formula-code')).toHaveTextContent('=ARRAYFORMULA(A2:A*B2:B)')
    })
  })

  describe('Platform Switching Behavior', () => {
    it('should maintain input when switching platforms', async () => {
      render(<Home />)

      const testInput = 'Calculate sum of sales data'
      
      // Enter input on Excel
      await user.type(screen.getByTestId('formula-input'), testInput)
      
      // Switch to Google Sheets
      await user.click(screen.getByTestId('google-sheets-tab'))
      
      // Input should be preserved
      expect(screen.getByTestId('formula-input')).toHaveValue(testInput)
      
      // Switch back to Excel
      await user.click(screen.getByTestId('excel-tab'))
      
      // Input should still be preserved
      expect(screen.getByTestId('formula-input')).toHaveValue(testInput)
    })

    it('should generate different formulas for same input on different platforms', async () => {
      const testInput = 'Lookup value from table'

      // Test Excel version
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            formula: '=VLOOKUP(A2,B:C,2,FALSE)',
            explanation: 'Excel VLOOKUP with FALSE parameter.'
          }
        }),
      })

      render(<Home />)

      await user.type(screen.getByTestId('formula-input'), testInput)
      await user.click(screen.getByTestId('generate-button'))

      await waitFor(() => {
        expect(screen.getByTestId('formula-code')).toBeInTheDocument()
      })

      const excelFormula = screen.getByTestId('formula-code').textContent

      // Clear result and switch to Google Sheets
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            formula: '=VLOOKUP(A2,B:C,2,0)',
            explanation: 'Google Sheets VLOOKUP with 0 parameter.'
          }
        }),
      })

      await user.click(screen.getByTestId('google-sheets-tab'))
      await user.click(screen.getByTestId('generate-button'))

      await waitFor(() => {
        expect(screen.getByTestId('formula-code')).toBeInTheDocument()
      })

      const googleSheetsFormula = screen.getByTestId('formula-code').textContent

      // Formulas should be different (FALSE vs 0)
      expect(excelFormula).toContain('FALSE')
      expect(googleSheetsFormula).toContain('0')
      expect(excelFormula).not.toEqual(googleSheetsFormula)
    })

    it('should send correct platform parameter to API', async () => {
      render(<Home />)

      const testInput = 'Test formula generation'

      // Test Excel API call
      await user.type(screen.getByTestId('formula-input'), testInput)
      await user.click(screen.getByTestId('generate-button'))

      expect(global.fetch).toHaveBeenCalledWith('/api/generate-formula', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: testInput,
          platform: 'excel'
        })
      })

      // Clear and test Google Sheets API call
      jest.clearAllMocks()
      await user.clear(screen.getByTestId('formula-input'))
      await user.click(screen.getByTestId('google-sheets-tab'))
      await user.type(screen.getByTestId('formula-input'), testInput)
      await user.click(screen.getByTestId('generate-button'))

      expect(global.fetch).toHaveBeenCalledWith('/api/generate-formula', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: testInput,
          platform: 'google-sheets'
        })
      })
    })
  })

  describe('Platform-Specific Error Handling', () => {
    it('should handle Excel-specific errors appropriately', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({
          error: 'Excel formula syntax not supported for this operation'
        }),
      })

      render(<Home />)

      await user.type(screen.getByTestId('formula-input'), 'Complex Excel operation')
      await user.click(screen.getByTestId('generate-button'))

      await waitFor(() => {
        expect(screen.getByText(/AI正忙，请稍后再试|An unexpected error occurred/)).toBeInTheDocument()
      })
    })

    it('should handle Google Sheets-specific errors appropriately', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({
          error: 'Google Sheets function not available'
        }),
      })

      render(<Home />)

      await user.click(screen.getByTestId('google-sheets-tab'))
      await user.type(screen.getByTestId('formula-input'), 'Complex Google Sheets operation')
      await user.click(screen.getByTestId('generate-button'))

      await waitFor(() => {
        expect(screen.getByText(/AI正忙，请稍后再试|An unexpected error occurred/)).toBeInTheDocument()
      })
    })
  })

  describe('Quick-Fill Platform Compatibility', () => {
    it('should work with quick-fill tags on Excel platform', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            formula: '=VLOOKUP(A2,B:C,2,FALSE)',
            explanation: 'Excel VLOOKUP from quick-fill example.'
          }
        }),
      })

      render(<Home />)

      // Use VLOOKUP quick-fill tag
      await user.click(screen.getByTestId('quick-fill-vlookup'))
      await user.click(screen.getByTestId('generate-button'))

      await waitFor(() => {
        expect(screen.getByTestId('formula-code')).toBeInTheDocument()
      })

      // Should generate Excel-compatible formula
      expect(screen.getByTestId('formula-code')).toHaveTextContent('=VLOOKUP(A2,B:C,2,FALSE)')
    })

    it('should work with quick-fill tags on Google Sheets platform', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            formula: '=VLOOKUP(A2,B:C,2,0)',
            explanation: 'Google Sheets VLOOKUP from quick-fill example.'
          }
        }),
      })

      render(<Home />)

      // Switch to Google Sheets and use quick-fill
      await user.click(screen.getByTestId('google-sheets-tab'))
      await user.click(screen.getByTestId('quick-fill-vlookup'))
      await user.click(screen.getByTestId('generate-button'))

      await waitFor(() => {
        expect(screen.getByTestId('formula-code')).toBeInTheDocument()
      })

      // Should generate Google Sheets-compatible formula
      expect(screen.getByTestId('formula-code')).toHaveTextContent('=VLOOKUP(A2,B:C,2,0)')
    })
  })

  describe('Copy Functionality Across Platforms', () => {
    beforeEach(() => {
      // Mock clipboard API
      Object.assign(navigator, {
        clipboard: {
          writeText: jest.fn().mockResolvedValue(undefined),
        },
      })
    })

    it('should copy Excel formulas correctly', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            formula: '=SUM(A1:A10)',
            explanation: 'Excel SUM formula.'
          }
        }),
      })

      render(<Home />)

      await user.type(screen.getByTestId('formula-input'), 'Sum values')
      await user.click(screen.getByTestId('generate-button'))

      await waitFor(() => {
        expect(screen.getByTestId('formula-code')).toBeInTheDocument()
      })

      await user.click(screen.getByTestId('copy-button'))

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('=SUM(A1:A10)')
    })

    it('should copy Google Sheets formulas correctly', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            formula: '=ARRAYFORMULA(SUM(A1:A10))',
            explanation: 'Google Sheets ARRAYFORMULA SUM.'
          }
        }),
      })

      render(<Home />)

      await user.click(screen.getByTestId('google-sheets-tab'))
      await user.type(screen.getByTestId('formula-input'), 'Array sum values')
      await user.click(screen.getByTestId('generate-button'))

      await waitFor(() => {
        expect(screen.getByTestId('formula-code')).toBeInTheDocument()
      })

      await user.click(screen.getByTestId('copy-button'))

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('=ARRAYFORMULA(SUM(A1:A10))')
    })
  })
})