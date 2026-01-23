import { render, screen } from '@testing-library/react'
import FeatureGrid from '@/components/FeatureGrid'

describe('FeatureGrid Component', () => {
  beforeEach(() => {
    render(<FeatureGrid />)
  })

  it('renders the main heading with proper SEO structure', () => {
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toHaveTextContent('Why Choose Our Excel AI Formula Generator?')
    expect(heading).toHaveAttribute('id', 'features-heading')
  })

  it('renders all three feature cards with correct content', () => {
    // Check for "Instant Results" feature
    expect(screen.getByText('Instant Results')).toBeInTheDocument()
    expect(screen.getByText('Powered by AI')).toBeInTheDocument()
    expect(screen.getByText(/Get Excel and Google Sheets formulas instantly/)).toBeInTheDocument()

    // Check for "Complex Logic" feature
    expect(screen.getByText('Complex Logic')).toBeInTheDocument()
    expect(screen.getByText('Handles nested IFs and VLOOKUPs')).toBeInTheDocument()
    expect(screen.getByText(/From simple SUM functions to complex nested IF statements/)).toBeInTheDocument()

    // Check for "100% Free" feature
    expect(screen.getByText('100% Free')).toBeInTheDocument()
    expect(screen.getByText('No credit card needed')).toBeInTheDocument()
    expect(screen.getByText(/Completely free to use with unlimited formula generation/)).toBeInTheDocument()
  })

  it('has proper semantic HTML structure', () => {
    const section = screen.getByRole('region', { name: /why choose our excel ai formula generator/i })
    expect(section).toBeInTheDocument()
    expect(section.tagName).toBe('SECTION')
  })

  it('includes SEO-optimized keywords in content', () => {
    expect(screen.getAllByText(/Excel and Google Sheets formulas/)).toHaveLength(2)
    expect(screen.getAllByText(/VLOOKUP/)).toHaveLength(2)
    expect(screen.getByText(/nested IF statements/)).toBeInTheDocument()
    expect(screen.getAllByText(/AI/)).toHaveLength(4) // AI appears in heading, subtitle, and two feature descriptions
  })

  it('renders feature icons', () => {
    // Check that icons are rendered (they should be SVG elements)
    const icons = document.querySelectorAll('svg')
    expect(icons.length).toBeGreaterThanOrEqual(3)
  })

  it('has proper styling classes for responsive design', () => {
    const gridContainer = document.querySelector('.grid')
    expect(gridContainer).toHaveClass('md:grid-cols-3')
  })
})