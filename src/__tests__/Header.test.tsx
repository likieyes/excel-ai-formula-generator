import { render, screen } from '@testing-library/react'
import Header from '@/components/Header'

describe('Header Component', () => {
  it('renders the brand name correctly', () => {
    render(<Header />)
    
    expect(screen.getByText('ExcelFormula.AI')).toBeInTheDocument()
  })

  it('displays the AI logo icon', () => {
    render(<Header />)
    
    expect(screen.getByText('AI')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(<Header />)
    
    expect(screen.getAllByText('Home')).toHaveLength(2) // Desktop and mobile
    expect(screen.getAllByText('Examples')).toHaveLength(2) // Desktop and mobile
  })

  it('displays the trust badge with correct text', () => {
    render(<Header />)
    
    expect(screen.getByText('No Signup Required')).toBeInTheDocument()
    expect(screen.getByText('✅')).toBeInTheDocument()
  })

  it('has proper navigation link structure', () => {
    render(<Header />)
    
    const homeLinks = screen.getAllByRole('link', { name: /home/i })
    const exampleLinks = screen.getAllByRole('link', { name: /examples/i })
    
    expect(homeLinks).toHaveLength(2)
    expect(exampleLinks).toHaveLength(2)
    
    // Check href attributes
    homeLinks.forEach(link => {
      expect(link).toHaveAttribute('href', '/')
    })
    
    exampleLinks.forEach(link => {
      expect(link).toHaveAttribute('href', '#examples')
    })
  })

  it('applies correct CSS classes for styling', () => {
    render(<Header />)
    
    const trustBadgeContainer = screen.getByText('No Signup Required').closest('div')
    expect(trustBadgeContainer).toHaveClass('bg-green-50', 'text-excel-green')
  })
})