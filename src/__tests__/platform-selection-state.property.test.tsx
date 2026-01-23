/**
 * Property-Based Tests for Platform Selection State Management
 * Feature: excel-ai-formula-generator, Property 3: Platform Selection State Management
 * **Validates: Requirements 2.2**
 */

import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import * as fc from 'fast-check'
import FormulaGenerator from '@/components/FormulaGenerator'
import { Platform } from '@/types'

// Mock function for onGenerate
const mockOnGenerate = jest.fn()

// Arbitrary for Platform type
const platformArbitrary = fc.constantFrom('excel', 'google-sheets') as fc.Arbitrary<Platform>

describe('Property 3: Platform Selection State Management', () => {
  beforeEach(() => {
    mockOnGenerate.mockClear()
  })

  afterEach(() => {
    cleanup()
  })

  it('should maintain platform selection state correctly across all platform switches', () => {
    fc.assert(
      fc.property(
        fc.array(platformArbitrary, { minLength: 1, maxLength: 10 }),
        (platformSequence) => {
          cleanup() // Clean up before each property test iteration
          
          render(
            <FormulaGenerator onGenerate={mockOnGenerate} isLoading={false} />
          )

          // Start with default Excel selection
          expect(screen.getByTestId('excel-tab')).toHaveClass('border-excel-green')
          expect(screen.getByTestId('google-sheets-tab')).toHaveClass('border-transparent')

          let currentPlatform: Platform = 'excel'

          // Apply each platform switch in sequence
          for (const targetPlatform of platformSequence) {
            const targetTab = screen.getByTestId(`${targetPlatform}-tab`)
            const otherPlatform = targetPlatform === 'excel' ? 'google-sheets' : 'excel'
            const otherTab = screen.getByTestId(`${otherPlatform}-tab`)

            // Click the target platform tab
            fireEvent.click(targetTab)
            currentPlatform = targetPlatform

            // Verify the correct tab is active
            expect(targetTab).toHaveClass('border-excel-green')
            expect(targetTab).toHaveClass('text-excel-green')
            expect(targetTab).toHaveClass('bg-green-50')

            // Verify the other tab is inactive
            expect(otherTab).toHaveClass('border-transparent')
            expect(otherTab).toHaveClass('text-gray-500')
            expect(otherTab).not.toHaveClass('bg-green-50')
          }

          // Final verification: the last selected platform should still be active
          const finalActiveTab = screen.getByTestId(`${currentPlatform}-tab`)
          expect(finalActiveTab).toHaveClass('border-excel-green')
          expect(finalActiveTab).toHaveClass('text-excel-green')
          expect(finalActiveTab).toHaveClass('bg-green-50')

          cleanup() // Clean up after test
        }
      ),
      { numRuns: 50 }
    )
  })

  it('should pass the correct platform to onGenerate when formula generation is triggered', () => {
    fc.assert(
      fc.property(
        platformArbitrary,
        fc.string({ minLength: 1, maxLength: 200 }),
        (platform, inputText) => {
          cleanup() // Clean up before each property test iteration
          
          render(<FormulaGenerator onGenerate={mockOnGenerate} isLoading={false} />)

          // Select the target platform
          const platformTab = screen.getByTestId(`${platform}-tab`)
          fireEvent.click(platformTab)

          // Enter input text
          const inputField = screen.getByTestId('formula-input')
          fireEvent.change(inputField, { target: { value: inputText } })

          // Click generate button
          const generateButton = screen.getByTestId('generate-button')
          fireEvent.click(generateButton)

          // Verify onGenerate was called with correct platform
          expect(mockOnGenerate).toHaveBeenCalledWith(inputText, platform)
          expect(mockOnGenerate).toHaveBeenCalledTimes(1)

          // Clear mock for next iteration
          mockOnGenerate.mockClear()
          cleanup() // Clean up after test
        }
      ),
      { numRuns: 50 }
    )
  })

  it('should maintain visual consistency for platform selection across all states', () => {
    fc.assert(
      fc.property(
        platformArbitrary,
        (selectedPlatform) => {
          cleanup() // Clean up before each property test iteration
          
          render(<FormulaGenerator onGenerate={mockOnGenerate} isLoading={false} />)

          // Select the platform
          const selectedTab = screen.getByTestId(`${selectedPlatform}-tab`)
          const unselectedPlatform = selectedPlatform === 'excel' ? 'google-sheets' : 'excel'
          const unselectedTab = screen.getByTestId(`${unselectedPlatform}-tab`)

          fireEvent.click(selectedTab)

          // Verify selected tab has all active styles
          expect(selectedTab).toHaveClass('border-excel-green')
          expect(selectedTab).toHaveClass('text-excel-green')
          expect(selectedTab).toHaveClass('bg-green-50')

          // Verify unselected tab has all inactive styles
          expect(unselectedTab).toHaveClass('border-transparent')
          expect(unselectedTab).toHaveClass('text-gray-500')
          expect(unselectedTab).not.toHaveClass('border-excel-green')
          expect(unselectedTab).not.toHaveClass('text-excel-green')
          expect(unselectedTab).not.toHaveClass('bg-green-50')

          // Verify tab content matches platform
          expect(selectedTab).toHaveTextContent(
            selectedPlatform === 'excel' ? 'Excel' : 'Google Sheets'
          )

          cleanup() // Clean up after test
        }
      ),
      { numRuns: 50 }
    )
  })

  it('should default to Excel platform on initial render', () => {
    fc.assert(
      fc.property(
        fc.boolean(), // Random boolean to ensure property holds regardless of other factors
        () => {
          cleanup() // Clean up before each property test iteration
          
          render(<FormulaGenerator onGenerate={mockOnGenerate} isLoading={false} />)

          // Excel tab should be active by default
          const excelTab = screen.getByTestId('excel-tab')
          const googleSheetsTab = screen.getByTestId('google-sheets-tab')

          expect(excelTab).toHaveClass('border-excel-green')
          expect(excelTab).toHaveClass('text-excel-green')
          expect(excelTab).toHaveClass('bg-green-50')

          expect(googleSheetsTab).toHaveClass('border-transparent')
          expect(googleSheetsTab).toHaveClass('text-gray-500')
          expect(googleSheetsTab).not.toHaveClass('bg-green-50')

          cleanup() // Clean up after test
        }
      ),
      { numRuns: 20 }
    )
  })
})