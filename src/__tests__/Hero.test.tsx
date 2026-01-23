import { render, screen } from '@testing-library/react'
import Hero from '@/components/Hero'

describe('Hero Component', () => {
  it('renders the SEO-optimized H1 headline correctly', () => {
    render(<Hero />)
    
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toHaveTextContent('Free Excel AI Formula Generator')
  })

  it('displays the sub-headline with value proposition', () => {
    render(<Hero />)
    
    expect(screen.getByText(/Stop memorizing complex syntax/)).toBeInTheDocument()
    expect(screen.getByText(/Turn plain English into Excel formulas/)).toBeInTheDocument()
  })

  it('shows all key benefit points', () => {
    render(<Hero />)
    
    expect(screen.getByText('Instant Results')).toBeInTheDocument()
    expect(screen.getByText('No Login Required')).toBeInTheDocument()
    expect(screen.getByText('100% Free')).toBeInTheDocument()
    expect(screen.getByText('Excel & Google Sheets')).toBeInTheDocument()
  })

  it('displays benefit icons correctly', () => {
    render(<Hero />)
    
    expect(screen.getByText('⚡')).toBeInTheDocument() // Instant Results
    expect(screen.getByText('🔓')).toBeInTheDocument() // No Login Required
    expect(screen.getByText('💯')).toBeInTheDocument() // 100% Free
    expect(screen.getByText('🎯')).toBeInTheDocument() // Excel & Google Sheets
  })

  it('includes call to action hint', () => {
    render(<Hero />)
    
    expect(screen.getByText(/Describe what you want to calculate in plain English below/)).toBeInTheDocument()
  })

  it('has proper heading hierarchy for SEO', () => {
    render(<Hero />)
    
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toBeInTheDocument()
    expect(h1).toHaveTextContent('Free Excel AI Formula Generator')
  })

  it('applies correct styling classes', () => {
    render(<Hero />)
    
    const section = screen.getByRole('heading', { level: 1 }).closest('section')
    expect(section).toHaveClass('bg-gradient-to-b', 'from-gray-50', 'to-white')
  })

  it('contains target keywords for SEO', () => {
    render(<Hero />)
    
    // Check for important SEO keywords
    expect(screen.getByText(/Excel AI Formula Generator/)).toBeInTheDocument()
    expect(screen.getByText(/Excel formulas/)).toBeInTheDocument()
    expect(screen.getAllByText(/Google Sheets/)).toHaveLength(2) // Appears in sub-headline and benefits
    expect(screen.getAllByText(/Free/)).toHaveLength(2) // Appears in headline and benefits
  })
})