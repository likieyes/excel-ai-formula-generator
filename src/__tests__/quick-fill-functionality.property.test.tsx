/**
 * Property-Based Tests for Quick-Fill Tag Functionality
 * Feature: excel-ai-formula-generator, Property 5: Quick-Fill Tag Functionality
 * **Validates: Requirements 3.4**
 */

import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import * as fc from 'fast-check'
import FormulaGenerator from '@/components/FormulaGenerator'
import { QuickFillTag } from '@/types'

// Mock function for onGenerate
const mockOnGenerate = jest.fn()

// Define the expected quick-fill tags (matching the component implementation)
const EXPECTED_QUICK_FILL_TAGS: QuickFillTag[] = [
  {
    id: 'vlookup',
    label: 'VLOOKUP',
    example: 'Find the price for a product ID from a price list table',
    category: 'lookup'
  },
  {
    id: 'if-statement',
    label: 'IF Statement',
    example: 'If the score is greater than 80, show "Pass", otherwise show "Fail"',
    category: 'logical'
  },
  {
    id: 'extract-email',
    label: 'Extract Email',
    example: 'Extract email addresses from a text string containing contact information',
    category: 'text'
  }
]

// Arbitrary for selecting quick-fill tags
const quickFillTagArbitrary = fc.constantFrom(...EXPECTED_QUICK_FILL_TAGS)

describe('Property 5: Quick-Fill Tag Functionality', () => {
  beforeEach(() => {
    mockOnGenerate.mockClear()
  })

  afterEach(() => {
    cleanup()
  })

  it('should populate input field with correct example text when any quick-fill tag is clicked', () => {
    fc.assert(
      fc.property(
        quickFillTagArbitrary,
        (selectedTag) => {
          cleanup() // Clean up before each property test iteration
          
          render(<FormulaGenerator onGenerate={mockOnGenerate} isLoading={false} />)

          // Get the input field and verify it starts empty
          const inputField = screen.getByTestId('formula-input') as HTMLTextAreaElement
          expect(inputField.value).toBe('')

          // Click the quick-fill tag
          const tagButton = screen.getByTestId(`quick-fill-${selectedTag.id}`)
          fireEvent.click(tagButton)

          // Verify the input field is populated with the correct example text
          expect(inputField.value).toBe(selectedTag.example)

          cleanup() // Clean up after test
        }
      ),
      { numRuns: 50 }
    )
  })

  it('should display all expected quick-fill tags with correct labels', () => {
    fc.assert(
      fc.property(
        fc.boolean(), // Random boolean to ensure property holds regardless of other factors
        () => {
          cleanup() // Clean up before each property test iteration
          
          render(<FormulaGenerator onGenerate={mockOnGenerate} isLoading={false} />)

          // Verify all expected tags are present with correct labels
          EXPECTED_QUICK_FILL_TAGS.forEach(tag => {
            const tagButton = screen.getByTestId(`quick-fill-${tag.id}`)
            expect(tagButton).toBeInTheDocument()
            expect(tagButton).toHaveTextContent(tag.label)
          })

          cleanup() // Clean up after test
        }
      ),
      { numRuns: 20 }
    )
  })

  it('should allow multiple quick-fill tag clicks and always use the most recent selection', () => {
    fc.assert(
      fc.property(
        fc.array(quickFillTagArbitrary, { minLength: 2, maxLength: 5 }),
        (tagSequence) => {
          cleanup() // Clean up before each property test iteration
          
          render(<FormulaGenerator onGenerate={mockOnGenerate} isLoading={false} />)

          const inputField = screen.getByTestId('formula-input') as HTMLTextAreaElement

          // Click each tag in sequence
          for (const tag of tagSequence) {
            const tagButton = screen.getByTestId(`quick-fill-${tag.id}`)
            fireEvent.click(tagButton)

            // Verify the input field contains the current tag's example
            expect(inputField.value).toBe(tag.example)
          }

          // Final verification: input should contain the last tag's example
          const lastTag = tagSequence[tagSequence.length - 1]
          expect(inputField.value).toBe(lastTag.example)

          cleanup() // Clean up after test
        }
      ),
      { numRuns: 50 }
    )
  })

  it('should preserve quick-fill functionality when platform is switched', () => {
    fc.assert(
      fc.property(
        quickFillTagArbitrary,
        fc.constantFrom('excel', 'google-sheets'),
        (selectedTag, platform) => {
          cleanup() // Clean up before each property test iteration
          
          render(<FormulaGenerator onGenerate={mockOnGenerate} isLoading={false} />)

          // Switch to the specified platform
          const platformTab = screen.getByTestId(`${platform}-tab`)
          fireEvent.click(platformTab)

          // Click the quick-fill tag
          const tagButton = screen.getByTestId(`quick-fill-${selectedTag.id}`)
          fireEvent.click(tagButton)

          // Verify the input field is populated correctly regardless of platform
          const inputField = screen.getByTestId('formula-input') as HTMLTextAreaElement
          expect(inputField.value).toBe(selectedTag.example)

          cleanup() // Clean up after test
        }
      ),
      { numRuns: 50 }
    )
  })

  it('should enable generate button when quick-fill tag populates input field', () => {
    fc.assert(
      fc.property(
        quickFillTagArbitrary,
        (selectedTag) => {
          cleanup() // Clean up before each property test iteration
          
          render(<FormulaGenerator onGenerate={mockOnGenerate} isLoading={false} />)

          // Initially, generate button should be disabled (empty input)
          const generateButton = screen.getByTestId('generate-button')
          expect(generateButton).toBeDisabled()
          expect(generateButton).toHaveClass('bg-gray-400', 'cursor-not-allowed')

          // Click the quick-fill tag
          const tagButton = screen.getByTestId(`quick-fill-${selectedTag.id}`)
          fireEvent.click(tagButton)

          // After quick-fill, generate button should be enabled
          expect(generateButton).not.toBeDisabled()
          expect(generateButton).toHaveClass('bg-excel-green')
          expect(generateButton).not.toHaveClass('bg-gray-400', 'cursor-not-allowed')

          cleanup() // Clean up after test
        }
      ),
      { numRuns: 50 }
    )
  })

  it('should maintain quick-fill tag styling and interactivity', () => {
    fc.assert(
      fc.property(
        quickFillTagArbitrary,
        (selectedTag) => {
          cleanup() // Clean up before each property test iteration
          
          render(<FormulaGenerator onGenerate={mockOnGenerate} isLoading={false} />)

          const tagButton = screen.getByTestId(`quick-fill-${selectedTag.id}`)

          // Verify tag has correct styling classes
          expect(tagButton).toHaveClass(
            'px-3',
            'py-1.5',
            'text-sm',
            'bg-gray-100',
            'text-gray-700',
            'rounded-full',
            'transition-colors',
            'border',
            'border-gray-300'
          )

          // Verify tag is clickable (not disabled)
          expect(tagButton).not.toBeDisabled()

          // Verify tag content
          expect(tagButton).toHaveTextContent(selectedTag.label)

          cleanup() // Clean up after test
        }
      ),
      { numRuns: 50 }
    )
  })

  it('should handle quick-fill tag clicks when input field already has content', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 100 }),
        quickFillTagArbitrary,
        (initialText, selectedTag) => {
          cleanup() // Clean up before each property test iteration
          
          render(<FormulaGenerator onGenerate={mockOnGenerate} isLoading={false} />)

          const inputField = screen.getByTestId('formula-input') as HTMLTextAreaElement

          // Set initial text in input field
          fireEvent.change(inputField, { target: { value: initialText } })
          expect(inputField.value).toBe(initialText)

          // Click the quick-fill tag
          const tagButton = screen.getByTestId(`quick-fill-${selectedTag.id}`)
          fireEvent.click(tagButton)

          // Verify the input field is replaced with the tag's example (not appended)
          expect(inputField.value).toBe(selectedTag.example)
          expect(inputField.value).not.toContain(initialText)

          cleanup() // Clean up after test
        }
      ),
      { numRuns: 50 }
    )
  })
})