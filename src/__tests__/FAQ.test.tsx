import { render, screen, fireEvent } from '@testing-library/react'
import FAQ from '@/components/FAQ'

describe('FAQ Component', () => {
  beforeEach(() => {
    render(<FAQ />)
  })

  it('renders the main heading with proper SEO structure', () => {
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toHaveTextContent('Frequently Asked Questions')
    expect(heading).toHaveAttribute('id', 'faq-heading')
  })

  it('renders all FAQ questions', () => {
    expect(screen.getByText('Is this Excel formula generator free?')).toBeInTheDocument()
    expect(screen.getByText('Does it work on Mac?')).toBeInTheDocument()
    expect(screen.getByText('Can it write Google Sheets Query functions?')).toBeInTheDocument()
    expect(screen.getByText('What types of Excel formulas can it generate?')).toBeInTheDocument()
    expect(screen.getByText('How accurate are the generated formulas?')).toBeInTheDocument()
    expect(screen.getByText('Can I use this for Google Sheets formulas?')).toBeInTheDocument()
  })

  it('has proper semantic HTML structure', () => {
    const section = screen.getByRole('region', { name: /frequently asked questions/i })
    expect(section).toBeInTheDocument()
    expect(section.tagName).toBe('SECTION')
  })

  it('includes SEO-optimized long-tail keywords in questions and answers', () => {
    // Check for target keywords in questions
    expect(screen.getByText(/Excel formula generator/)).toBeInTheDocument()
    expect(screen.getByText(/Google Sheets Query/)).toBeInTheDocument()
    expect(screen.getByText(/Google Sheets formulas/)).toBeInTheDocument()
    
    // Expand first FAQ to check answer content
    const firstQuestion = screen.getByText('Is this Excel formula generator free?')
    fireEvent.click(firstQuestion)
    
    expect(screen.getByText(/completely free with unlimited access/)).toBeInTheDocument()
    expect(screen.getByText(/without any cost, signup, or credit card requirement/)).toBeInTheDocument()
  })

  it('implements accordion functionality correctly', () => {
    const firstQuestion = screen.getByText('Is this Excel formula generator free?')
    const firstButton = firstQuestion.closest('button')
    
    // Initially closed
    expect(firstButton).toHaveAttribute('aria-expanded', 'false')
    
    // Click to open
    fireEvent.click(firstButton!)
    expect(firstButton).toHaveAttribute('aria-expanded', 'true')
    
    // Answer should be visible
    expect(screen.getByText(/completely free with unlimited access/)).toBeInTheDocument()
    
    // Click to close
    fireEvent.click(firstButton!)
    expect(firstButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('allows multiple FAQs to be open simultaneously', () => {
    const firstQuestion = screen.getByText('Is this Excel formula generator free?')
    const secondQuestion = screen.getByText('Does it work on Mac?')
    
    // Open first FAQ
    fireEvent.click(firstQuestion)
    expect(firstQuestion.closest('button')).toHaveAttribute('aria-expanded', 'true')
    
    // Open second FAQ
    fireEvent.click(secondQuestion)
    expect(secondQuestion.closest('button')).toHaveAttribute('aria-expanded', 'true')
    
    // Both should remain open
    expect(firstQuestion.closest('button')).toHaveAttribute('aria-expanded', 'true')
    expect(secondQuestion.closest('button')).toHaveAttribute('aria-expanded', 'true')
  })

  it('includes comprehensive formula type coverage in answers', () => {
    // Expand the formula types question
    const formulaTypesQuestion = screen.getByText('What types of Excel formulas can it generate?')
    fireEvent.click(formulaTypesQuestion)
    
    // Check for comprehensive formula coverage
    expect(screen.getByText(/VLOOKUP/)).toBeInTheDocument()
    expect(screen.getByText(/HLOOKUP/)).toBeInTheDocument()
    expect(screen.getByText(/INDEX MATCH/)).toBeInTheDocument()
    expect(screen.getByText(/nested IF statements/)).toBeInTheDocument()
    expect(screen.getByText(/SUMIF/)).toBeInTheDocument()
    expect(screen.getByText(/COUNTIF/)).toBeInTheDocument()
    expect(screen.getByText(/array formulas/)).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    const buttons = screen.getAllByRole('button')
    
    buttons.forEach(button => {
      expect(button).toHaveAttribute('aria-expanded')
    })
  })

  it('includes platform-specific information', () => {
    // Expand Mac compatibility question
    const macQuestion = screen.getByText('Does it work on Mac?')
    fireEvent.click(macQuestion)
    
    expect(screen.getByText(/Excel for Mac/)).toBeInTheDocument()
    expect(screen.getByText(/Excel Online/)).toBeInTheDocument()
    expect(screen.getByText(/Excel 365/)).toBeInTheDocument()
    
    // Expand Google Sheets question
    const googleSheetsQuestion = screen.getByText('Can it write Google Sheets Query functions?')
    fireEvent.click(googleSheetsQuestion)
    
    expect(screen.getByText(/QUERY functions/)).toBeInTheDocument()
    expect(screen.getByText(/ARRAYFORMULA/)).toBeInTheDocument()
  })
})