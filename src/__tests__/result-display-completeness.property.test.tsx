/**
 * Property-Based Tests for Result Display Completeness
 * Feature: excel-ai-formula-generator, Property 4: Result Display Completeness
 * **Validates: Requirements 2.3, 2.4, 2.5**
 */

import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import * as fc from 'fast-check'
import ResultDisplay from '@/components/ResultDisplay'

// Mock clipboard API
const mockClipboard = {
  writeText: jest.fn()
}

Object.assign(navigator, {
  clipboard: mockClipboard
})

// Generators for test data
const formulaArbitrary = fc.string({ minLength: 1, maxLength: 200 })
  .filter(s => s.trim().length > 0)

const explanationArbitrary = fc.string({ minLength: 10, maxLength: 500 })
  .filter(s => s.trim().length > 0)

const resultDataArbitrary = fc.record({
  formula: formulaArbitrary,
  explanation: explanationArbitrary,
  isVisible: fc.boolean()
})

describe('Property 4: Result Display Completeness', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockClipboard.writeText.mockResolvedValue(undefined)
    cleanup()
  })

  afterEach(() => {
    cleanup()
  })

  it('should display formula in code block when visible and formula exists', () => {
    fc.assert(fc.property(
      resultDataArbitrary.filter(data => data.isVisible),
      (data) => {
        cleanup() // Ensure clean state before each iteration
        
        const { container } = render(
          <ResultDisplay
            formula={data.formula}
            explanation={data.explanation}
            isVisible={data.isVisible}
          />
        )

        // Should display the formula in a code block
        const codeElements = container.querySelectorAll('[data-testid="formula-code"]')
        expect(codeElements).toHaveLength(1)
        
        const codeElement = codeElements[0]
        expect(codeElement).toBeInTheDocument()
        expect(codeElement.textContent?.trim()).toBe(data.formula.trim())
        
        // Code block should have monospaced font styling
        expect(codeElement).toHaveClass('font-mono')
        
        // Should be wrapped in a pre element for proper formatting
        expect(codeElement.closest('pre')).toBeInTheDocument()
        expect(codeElement.closest('pre')).toHaveClass('bg-gray-100')

        cleanup()
      }
    ), { numRuns: 30 })
  })

  it('should provide copy button that copies formula to clipboard', async () => {
    const testData = fc.sample(resultDataArbitrary.filter(data => data.isVisible), 10)
    
    for (const data of testData) {
      cleanup() // Clean before each iteration
      
      const onCopyMock = jest.fn()
      
      const { container } = render(
        <ResultDisplay
          formula={data.formula}
          explanation={data.explanation}
          isVisible={data.isVisible}
          onCopy={onCopyMock}
        />
      )

      // Should have a copy button
      const copyButtons = container.querySelectorAll('[data-testid="copy-button"]')
      expect(copyButtons).toHaveLength(1)
      
      const copyButton = copyButtons[0]
      expect(copyButton).toBeInTheDocument()
      expect(copyButton).toHaveTextContent('Copy')

      // Click the copy button
      fireEvent.click(copyButton)

      // Wait for async operations to complete
      await waitFor(() => {
        expect(mockClipboard.writeText).toHaveBeenCalledWith(data.formula)
      })
      
      // Should call onCopy callback if provided
      await waitFor(() => {
        expect(onCopyMock).toHaveBeenCalled()
      })

      // Should show success state
      await waitFor(() => {
        expect(copyButton).toHaveTextContent('Copied!')
      })

      cleanup()
      jest.clearAllMocks()
      mockClipboard.writeText.mockResolvedValue(undefined)
    }
  })

  it('should show toast notification when copy is successful', async () => {
    const testData = fc.sample(resultDataArbitrary.filter(data => data.isVisible), 10)
    
    for (const data of testData) {
      cleanup() // Clean before each iteration
      
      const { container } = render(
        <ResultDisplay
          formula={data.formula}
          explanation={data.explanation}
          isVisible={data.isVisible}
        />
      )

      const copyButtons = container.querySelectorAll('[data-testid="copy-button"]')
      const copyButton = copyButtons[0]
      fireEvent.click(copyButton)

      // Should show toast notification
      await waitFor(() => {
        const toasts = container.querySelectorAll('[data-testid="copy-toast"]')
        expect(toasts).toHaveLength(1)
        expect(toasts[0]).toHaveTextContent('Formula copied to clipboard!')
      })

      cleanup()
    }
  })

  it('should display explanation when provided', () => {
    fc.assert(fc.property(
      resultDataArbitrary.filter(data => data.isVisible && !!data.explanation),
      (data) => {
        cleanup() // Ensure clean state before each iteration
        
        const { container } = render(
          <ResultDisplay
            formula={data.formula}
            explanation={data.explanation}
            isVisible={data.isVisible}
          />
        )

        // Should display the explanation
        const explanationElements = container.querySelectorAll('[data-testid="formula-explanation"]')
        expect(explanationElements).toHaveLength(1)
        
        const explanationElement = explanationElements[0]
        expect(explanationElement).toBeInTheDocument()
        expect(explanationElement.textContent?.trim()).toBe(data.explanation.trim())
        
        // Should have beginner-friendly styling
        expect(explanationElement).toHaveClass('text-gray-700', 'leading-relaxed')

        cleanup()
      }
    ), { numRuns: 30 })
  })

  it('should provide feedback buttons for data quality', () => {
    fc.assert(fc.property(
      resultDataArbitrary.filter(data => data.isVisible),
      (data) => {
        cleanup() // Ensure clean state before each iteration
        
        const { container } = render(
          <ResultDisplay
            formula={data.formula}
            explanation={data.explanation}
            isVisible={data.isVisible}
          />
        )

        // Should have thumbs up button
        const thumbsUpButtons = container.querySelectorAll('[data-testid="thumbs-up-button"]')
        expect(thumbsUpButtons).toHaveLength(1)
        const thumbsUpButton = thumbsUpButtons[0]
        expect(thumbsUpButton).toBeInTheDocument()
        expect(thumbsUpButton).toHaveAttribute('aria-label', 'This was helpful')

        // Should have thumbs down button
        const thumbsDownButtons = container.querySelectorAll('[data-testid="thumbs-down-button"]')
        expect(thumbsDownButtons).toHaveLength(1)
        const thumbsDownButton = thumbsDownButtons[0]
        expect(thumbsDownButton).toBeInTheDocument()
        expect(thumbsDownButton).toHaveAttribute('aria-label', 'This was not helpful')

        // Buttons should be interactive
        fireEvent.click(thumbsUpButton)
        expect(thumbsUpButton).toHaveClass('bg-green-100', 'text-green-600')

        fireEvent.click(thumbsDownButton)
        expect(thumbsDownButton).toHaveClass('bg-red-100', 'text-red-600')

        cleanup()
      }
    ), { numRuns: 20 })
  })

  it('should not render when not visible or no formula', () => {
    fc.assert(fc.property(
      fc.record({
        formula: fc.oneof(fc.constant(null), fc.constant(''), formulaArbitrary),
        explanation: fc.option(explanationArbitrary),
        isVisible: fc.boolean()
      }),
      (data) => {
        cleanup() // Ensure clean state before each iteration
        
        const { container } = render(
          <ResultDisplay
            formula={data.formula}
            explanation={data.explanation}
            isVisible={data.isVisible}
          />
        )

        if (!data.isVisible || !data.formula) {
          // Should not render anything
          expect(container.firstChild).toBeNull()
        } else {
          // Should render the component
          expect(container.firstChild).not.toBeNull()
        }

        cleanup()
      }
    ), { numRuns: 30 })
  })

  it('should maintain proper component structure and styling', () => {
    fc.assert(fc.property(
      resultDataArbitrary.filter(data => data.isVisible),
      (data) => {
        cleanup() // Ensure clean state before each iteration
        
        const { container } = render(
          <ResultDisplay
            formula={data.formula}
            explanation={data.explanation}
            isVisible={data.isVisible}
          />
        )

        // Should have proper container styling
        const mainContainer = container.firstChild as HTMLElement
        expect(mainContainer).toHaveClass('w-full', 'max-w-4xl', 'mx-auto', 'bg-white', 'rounded-lg', 'shadow-lg')

        // Should have proper section organization
        expect(container.querySelector('h3')).toHaveTextContent('Generated Formula')
        if (data.explanation) {
          expect(container.querySelector('h4')).toHaveTextContent('How it works')
        }
        expect(container).toHaveTextContent('Was this helpful?')

        cleanup()
      }
    ), { numRuns: 20 })
  })
})