/**
 * SEO Metadata Tests
 * 
 * These tests validate that the application includes proper SEO metadata
 * as specified in the requirements. Since Next.js metadata is generated
 * at build time, we test the metadata configuration directly.
 */

// Mock the Vercel Analytics import to avoid module resolution issues
jest.mock('@vercel/analytics/react', () => ({
  Analytics: () => null
}))

import { metadata } from '@/app/layout'

describe('SEO Metadata Configuration', () => {
  it('has the exact title specified in requirements', () => {
    expect(metadata.title).toBe('Free Excel AI Formula Generator - No Signup (Instant)')
  })

  it('has the exact meta description specified in requirements', () => {
    expect(metadata.description).toBe(
      'The best free AI tool to write Excel formulas. Convert English to Excel formulas, VLOOKUP, IF functions, and Google Sheets scripts instantly.'
    )
  })

  it('includes comprehensive SEO keywords', () => {
    const keywords = metadata.keywords as string
    const keywordArray = keywords.split(', ')
    
    // Check for primary target keywords
    expect(keywordArray).toContain('excel formula generator')
    expect(keywordArray).toContain('ai excel formulas')
    expect(keywordArray).toContain('vlookup generator')
    expect(keywordArray).toContain('if function generator')
    expect(keywordArray).toContain('google sheets formula')
    expect(keywordArray).toContain('excel ai')
    expect(keywordArray).toContain('free formula generator')
    expect(keywordArray).toContain('spreadsheet formulas')
  })

  it('has proper Open Graph metadata', () => {
    expect(metadata.openGraph).toBeDefined()
    expect(metadata.openGraph?.title).toBe('Free Excel AI Formula Generator - No Signup (Instant)')
    expect(metadata.openGraph?.description).toBe(
      'The best free AI tool to write Excel formulas. Convert English to Excel formulas, VLOOKUP, IF functions, and Google Sheets scripts instantly.'
    )
    expect(metadata.openGraph?.url).toBe('https://excelformula.ai')
    expect(metadata.openGraph?.siteName).toBe('ExcelFormula.AI')
    expect(metadata.openGraph?.type).toBe('website')
    expect(metadata.openGraph?.locale).toBe('en_US')
  })

  it('has proper Twitter Card metadata', () => {
    expect(metadata.twitter).toBeDefined()
    expect(metadata.twitter?.card).toBe('summary_large_image')
    expect(metadata.twitter?.title).toBe('Free Excel AI Formula Generator - No Signup (Instant)')
    expect(metadata.twitter?.description).toBe(
      'The best free AI tool to write Excel formulas. Convert English to Excel formulas, VLOOKUP, IF functions, and Google Sheets scripts instantly.'
    )
    expect(metadata.twitter?.creator).toBe('@excelformulaai')
  })

  it('includes proper canonical URL', () => {
    expect(metadata.alternates?.canonical).toBe('https://excelformula.ai')
  })

  it('has proper robots directive', () => {
    expect(metadata.robots).toBe('index, follow')
  })

  it('includes proper author and publisher information', () => {
    expect(metadata.authors).toEqual([{ name: 'ExcelFormula.AI' }])
    expect(metadata.creator).toBe('ExcelFormula.AI')
    expect(metadata.publisher).toBe('ExcelFormula.AI')
  })

  it('includes proper Open Graph and Twitter metadata', () => {
    expect(metadata.openGraph?.title).toBe('Free Excel AI Formula Generator - No Signup (Instant)')
    expect(metadata.openGraph?.description).toContain('The best free AI tool to write Excel formulas')
    expect(metadata.openGraph?.type).toBe('website')
    expect(metadata.openGraph?.siteName).toBe('ExcelFormula.AI')
    
    expect(metadata.twitter?.card).toBe('summary_large_image')
    expect(metadata.twitter?.title).toBe('Free Excel AI Formula Generator - No Signup (Instant)')
    expect(metadata.twitter?.creator).toBe('@excelformulaai')
  })

  it('includes proper category classification', () => {
    expect(metadata.category).toBe('Business Tools')
    expect(metadata.classification).toBe('Business Application')
  })

  it('has Open Graph images configured', () => {
    expect(metadata.openGraph?.images).toBeDefined()
    expect(Array.isArray(metadata.openGraph?.images)).toBe(true)
    
    const images = metadata.openGraph?.images as any[]
    expect(images.length).toBeGreaterThan(0)
    expect(images[0]).toEqual({
      url: 'https://excelformula.ai/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Excel AI Formula Generator - Free Tool'
    })
  })

  it('has Twitter images configured', () => {
    expect(metadata.twitter?.images).toBeDefined()
    expect(Array.isArray(metadata.twitter?.images)).toBe(true)
    
    const images = metadata.twitter?.images as string[]
    expect(images).toContain('https://excelformula.ai/og-image.png')
  })
})

describe('SEO Content Structure', () => {
  it('validates that required SEO keywords are present in metadata', () => {
    const title = metadata.title as string
    const description = metadata.description as string
    const keywords = metadata.keywords as string
    
    // Check title includes primary keyword
    expect(title.toLowerCase()).toContain('excel ai formula generator')
    expect(title.toLowerCase()).toContain('free')
    expect(title.toLowerCase()).toContain('no signup')
    
    // Check description includes target keywords
    expect(description.toLowerCase()).toContain('excel formulas')
    expect(description.toLowerCase()).toContain('vlookup')
    expect(description.toLowerCase()).toContain('if functions')
    expect(description.toLowerCase()).toContain('google sheets')
    expect(description.toLowerCase()).toContain('ai tool')
    
    // Check keywords include all target terms
    expect(keywords.toLowerCase()).toContain('excel formula generator')
    expect(keywords.toLowerCase()).toContain('vlookup')
    expect(keywords.toLowerCase()).toContain('google sheets')
  })

  it('validates meta description length is SEO-optimized', () => {
    const description = metadata.description as string
    
    // Meta descriptions should be between 120-160 characters for optimal SEO
    expect(description.length).toBeGreaterThan(120)
    expect(description.length).toBeLessThan(160)
  })

  it('validates title length is SEO-optimized', () => {
    const title = metadata.title as string
    
    // Page titles should be under 60 characters for optimal SEO
    expect(title.length).toBeLessThan(60)
  })
})