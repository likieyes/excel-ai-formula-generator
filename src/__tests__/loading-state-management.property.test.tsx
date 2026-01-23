/**
 * Property-Based Tests for Loading State Management
 * Feature: excel-ai-formula-generator, Property 6: Loading State Management
 * **Validates: Requirements 3.5**
 */

import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import * as fc from 'fast-check'
import FormulaGenerator from '@/components/FormulaGenerator'
import { Platform } from '@/types'

// Mock function for onGenerate
const mockOnGenerate = jest.fn()

// Arbitrary for Platform type
const platformArbitrary = fc.constantFrom('excel', 'google-sheets') as fc.Arbitrary<Platform>

describe('Property 6: Loading State Management', () => {
  beforeEach(() => {
    mockOnGenerate.mockClear()
  })

  afterEach(() => {
    cleanup()
  })

  it('should display loading state correctly when isLoading is true', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0), // Ensure non-empty after trim
        platformArbitrary,
        (inputText, platform) => {
          cleanup() // Clean up before each property test iteration
          
          render(<FormulaGenerator onGenerate={mockOnGenerate} isLoading={true} />)

          // Set up input text and platform
          const inputField = screen.getByTestId('formula-input')
          fireEvent.change(inputField, { target: { value: inputText } })
          
          const platformTab = screen.getByTestId(`${platform}-tab`)
          fireEvent.click(platformTab)

          const generateButton = screen.getByTestId('generate-button')

          // Verify loading state styling
          expect(generateButton).toBeDisabled()
          expect(generateButton).toHaveClass('bg-gray-400', 'cursor-not-allowed')
          expect(generateButton).not.toHaveClass('bg-excel-green')

          // Verify loading text and spinner are present
          expect(generateButton).toHaveTextContent('Generating...')
          
          // Check for spinner element (div with animate-spin class)
          const spinner = generateButton.querySelector('.animate-spin')
          expect(spinner).toBeInTheDocument()
          expect(spinner).toHaveClass('rounded-full', 'border-b-2', 'border-white')

          cleanup() // Clean up after test
        }
      ),
      { numRuns: 50 }
    )
  })

  it('should display normal state correctly when isLoading is false', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0), // Ensure non-empty after trim
        platformArbitrary,
        (inputText, platform) => {
          cleanup() // Clean up before each property test iteration
          
          render(<FormulaGenerator onGenerate={mockOnGenerate} isLoading={false} />)

          // Set up input text and platform
          const inputField = screen.getByTestId('formula-input')
          fireEvent.change(inputField, { target: { value: inputText } })
          
          const platformTab = screen.getByTestId(`${platform}-tab`)
          fireEvent.click(platformTab)

          const generateButton = screen.getByTestId('generate-button')

          // Verify normal state styling (enabled with input)
          expect(generateButton).not.toBeDisabled()
          expect(generateButton).toHaveClass('bg-excel-green')
          expect(generateButton).not.toHaveClass('bg-gray-400', 'cursor-not-allowed')

          // Verify normal button text
          expect(generateButton).toHaveTextContent('Generate Formula ✨')
          expect(generateButton).not.toHaveTextContent('Generating...')

          // Verify no spinner is present
          const spinner = generateButton.querySelector('.animate-spin')
          expect(spinner).not.toBeInTheDocument()

          cleanup() // Clean up after test
        }
      ),
      { numRuns: 50 }
    )
  })

  it('should prevent button clicks when in loading state', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0), // Ensure non-empty after trim
        platformArbitrary,
        (inputText, platform) => {
          cleanup() // Clean up before each property test iteration
          
          render(<FormulaGenerator onGenerate={mockOnGenerate} isLoading={true} />)

          // Set up input text and platform
          const inputField = screen.getByTestId('formula-input')
          fireEvent.change(inputField, { target: { value: inputText } })
          
          const platformTab = screen.getByTestId(`${platform}-tab`)
          fireEvent.click(platformTab)

          const generateButton = screen.getByTestId('generate-button')

          // Attempt to click the disabled button
          fireEvent.click(generateButton)

          // Verify onGenerate was not called due to disabled state
          expect(mockOnGenerate).not.toHaveBeenCalled()

          cleanup() // Clean up after test
        }
      ),
      { numRuns: 50 }
    )
  })

  it('should allow button clicks when not in loading state', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0), // Ensure non-empty after trim
        platformArbitrary,
        (inputText, platform) => {
          cleanup() // Clean up before each property test iteration
          
          render(<FormulaGenerator onGenerate={mockOnGenerate} isLoading={false} />)

          // Set up input text and platform
          const inputField = screen.getByTestId('formula-input')
          fireEvent.change(inputField, { target: { value: inputText } })
          
          const platformTab = screen.getByTestId(`${platform}-tab`)
          fireEvent.click(platformTab)

          const generateButton = screen.getByTestId('generate-button')

          // Click the enabled button
          fireEvent.click(generateButton)

          // Verify onGenerate was called with correct parameters
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

  it('should maintain loading state regardless of platform selection', () => {
    fc.assert(
      fc.property(
        fc.array(platformArbitrary, { minLength: 1, maxLength: 5 }),
        fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0), // Ensure non-empty after trim
        (platformSequence, inputText) => {
          cleanup() // Clean up before each property test iteration
          
          render(<FormulaGenerator onGenerate={mockOnGenerate} isLoading={true} />)

          // Set up input text
          const inputField = screen.getByTestId('formula-input')
          fireEvent.change(inputField, { target: { value: inputText } })

          // Switch between platforms while in loading state
          for (const platform of platformSequence) {
            const platformTab = screen.getByTestId(`${platform}-tab`)
            fireEvent.click(platformTab)

            const generateButton = screen.getByTestId('generate-button')

            // Verify loading state is maintained regardless of platform
            expect(generateButton).toBeDisabled()
            expect(generateButton).toHaveClass('bg-gray-400', 'cursor-not-allowed')
            expect(generateButton).toHaveTextContent('Generating...')
            
            const spinner = generateButton.querySelector('.animate-spin')
            expect(spinner).toBeInTheDocument()
          }

          cleanup() // Clean up after test
        }
      ),
      { numRuns: 50 }
    )
  })

  it('should disable button when loading even with valid input', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0), // Ensure non-empty after trim
        (inputText) => {
          cleanup() // Clean up before each property test iteration
          
          render(<FormulaGenerator onGenerate={mockOnGenerate} isLoading={true} />)

          // Set up valid input text
          const inputField = screen.getByTestId('formula-input')
          fireEvent.change(inputField, { target: { value: inputText } })

          const generateButton = screen.getByTestId('generate-button')

          // Even with valid input, button should be disabled when loading
          expect(generateButton).toBeDisabled()
          expect(generateButton).toHaveClass('bg-gray-400', 'cursor-not-allowed')
          expect(generateButton).not.toHaveClass('bg-excel-green')

          cleanup() // Clean up after test
        }
      ),
      { numRuns: 50 }
    )
  })

  it('should handle loading state transitions correctly', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0), // Ensure non-empty after trim
        platformArbitrary,
        (inputText, platform) => {
          cleanup() // Clean up before each property test iteration
          
          // Start with loading state
          const { rerender } = render(
            <FormulaGenerator onGenerate={mockOnGenerate} isLoading={true} />
          )

          // Set up input and platform
          const inputField = screen.getByTestId('formula-input')
          fireEvent.change(inputField, { target: { value: inputText } })
          
          const platformTab = screen.getByTestId(`${platform}-tab`)
          fireEvent.click(platformTab)

          let generateButton = screen.getByTestId('generate-button')

          // Verify loading state
          expect(generateButton).toBeDisabled()
          expect(generateButton).toHaveTextContent('Generating...')

          // Transition to non-loading state
          rerender(<FormulaGenerator onGenerate={mockOnGenerate} isLoading={false} />)

          // Re-setup after rerender (component state resets)
          const newInputField = screen.getByTestId('formula-input')
          fireEvent.change(newInputField, { target: { value: inputText } })
          
          const newPlatformTab = screen.getByTestId(`${platform}-tab`)
          fireEvent.click(newPlatformTab)

          generateButton = screen.getByTestId('generate-button')

          // Verify non-loading state
          expect(generateButton).not.toBeDisabled()
          expect(generateButton).toHaveTextContent('Generate Formula ✨')
          expect(generateButton).toHaveClass('bg-excel-green')

          cleanup() // Clean up after test
        }
      ),
      { numRuns: 30 } // Reduced runs for rerender tests
    )
  })
})