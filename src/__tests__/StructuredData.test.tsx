import { render } from '@testing-library/react'
import StructuredData from '@/components/StructuredData'

// Mock Next.js Script component
jest.mock('next/script', () => {
  return function MockScript({ id, type, dangerouslySetInnerHTML }: any) {
    return (
      <script
        id={id}
        type={type}
        dangerouslySetInnerHTML={dangerouslySetInnerHTML}
        data-testid={id}
      />
    )
  }
})

describe('StructuredData Component', () => {
  beforeEach(() => {
    render(<StructuredData />)
  })

  it('renders software application schema with correct structure', () => {
    const softwareSchema = document.querySelector('[data-testid="software-application-schema"]')
    expect(softwareSchema).toBeInTheDocument()
    expect(softwareSchema).toHaveAttribute('type', 'application/ld+json')
    
    const schemaContent = JSON.parse(softwareSchema?.innerHTML || '{}')
    
    expect(schemaContent['@context']).toBe('https://schema.org')
    expect(schemaContent['@type']).toBe('SoftwareApplication')
    expect(schemaContent.name).toBe('Excel AI Formula Generator')
    expect(schemaContent.applicationCategory).toBe('BusinessApplication')
  })

  it('includes comprehensive software application metadata', () => {
    const softwareSchema = document.querySelector('[data-testid="software-application-schema"]')
    const schemaContent = JSON.parse(softwareSchema?.innerHTML || '{}')
    
    // Check required fields
    expect(schemaContent.description).toContain('The best free AI tool to write Excel formulas')
    expect(schemaContent.url).toBe('https://www.aiexcelformula.com')
    expect(schemaContent.operatingSystem).toBe('Web Browser')
    
    // Check offers structure
    expect(schemaContent.offers).toEqual({
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      validFrom: '2024-01-01'
    })
    
    // Check feature list includes key terms
    expect(schemaContent.featureList).toContain('AI-powered Excel formula generation')
    expect(schemaContent.featureList).toContain('VLOOKUP formula generator')
    expect(schemaContent.featureList).toContain('IF function generator')
    expect(schemaContent.featureList).toContain('Google Sheets formula support')
  })

  it('renders FAQ schema with correct structure', () => {
    const faqSchema = document.querySelector('[data-testid="faq-schema"]')
    expect(faqSchema).toBeInTheDocument()
    expect(faqSchema).toHaveAttribute('type', 'application/ld+json')
    
    const schemaContent = JSON.parse(faqSchema?.innerHTML || '{}')
    
    expect(schemaContent['@context']).toBe('https://schema.org')
    expect(schemaContent['@type']).toBe('FAQPage')
    expect(Array.isArray(schemaContent.mainEntity)).toBe(true)
    expect(schemaContent.mainEntity.length).toBeGreaterThan(0)
  })

  it('includes all required FAQ questions in schema', () => {
    const faqSchema = document.querySelector('[data-testid="faq-schema"]')
    const schemaContent = JSON.parse(faqSchema?.innerHTML || '{}')
    
    const questions = schemaContent.mainEntity.map((item: any) => item.name)
    
    expect(questions).toContain('Is this Excel formula generator free?')
    expect(questions).toContain('Does it work on Mac?')
    expect(questions).toContain('Can it write Google Sheets Query functions?')
    expect(questions).toContain('What types of Excel formulas can it generate?')
    expect(questions).toContain('How accurate are the generated formulas?')
    expect(questions).toContain('Can I use this for Google Sheets formulas?')
  })

  it('renders organization schema with correct structure', () => {
    const orgSchema = document.querySelector('[data-testid="organization-schema"]')
    expect(orgSchema).toBeInTheDocument()
    
    const schemaContent = JSON.parse(orgSchema?.innerHTML || '{}')
    
    expect(schemaContent['@context']).toBe('https://schema.org')
    expect(schemaContent['@type']).toBe('Organization')
    expect(schemaContent.name).toBe('AI Excel Formula')
    expect(schemaContent.url).toBe('https://www.aiexcelformula.com')
  })

  it('renders website schema with search action', () => {
    const websiteSchema = document.querySelector('[data-testid="website-schema"]')
    expect(websiteSchema).toBeInTheDocument()
    
    const schemaContent = JSON.parse(websiteSchema?.innerHTML || '{}')
    
    expect(schemaContent['@context']).toBe('https://schema.org')
    expect(schemaContent['@type']).toBe('WebSite')
    expect(schemaContent.name).toBe('Excel AI Formula Generator')
    
    // Check search action
    expect(schemaContent.potentialAction).toEqual({
      '@type': 'SearchAction',
      target: 'https://www.aiexcelformula.com/?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    })
  })

  it('includes SEO-optimized keywords in software schema', () => {
    const softwareSchema = document.querySelector('[data-testid="software-application-schema"]')
    const schemaContent = JSON.parse(softwareSchema?.innerHTML || '{}')
    
    const keywords = schemaContent.keywords
    expect(keywords).toContain('excel formula generator')
    expect(keywords).toContain('ai excel formulas')
    expect(keywords).toContain('vlookup generator')
    expect(keywords).toContain('if function generator')
    expect(keywords).toContain('google sheets formula')
  })

  it('includes proper rating and review data', () => {
    const softwareSchema = document.querySelector('[data-testid="software-application-schema"]')
    const schemaContent = JSON.parse(softwareSchema?.innerHTML || '{}')
    
    expect(schemaContent.aggregateRating).toEqual({
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1247',
      bestRating: '5',
      worstRating: '1'
    })
  })

  it('includes comprehensive technical specifications', () => {
    const softwareSchema = document.querySelector('[data-testid="software-application-schema"]')
    const schemaContent = JSON.parse(softwareSchema?.innerHTML || '{}')
    
    expect(schemaContent.browserRequirements).toBe('Requires JavaScript. Requires HTML5.')
    expect(schemaContent.softwareRequirements).toBe('Web Browser')
    expect(schemaContent.memoryRequirements).toBe('512MB')
    expect(schemaContent.storageRequirements).toBe('0MB')
  })
})