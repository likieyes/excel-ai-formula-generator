/**
 * Property-Based Tests for Analytics Event Tracking
 * Feature: excel-ai-formula-generator, Property 7: Analytics Event Tracking
 * **Validates: Requirements 6.1, 6.2, 6.3**
 */

import * as fc from 'fast-check'
import { 
  trackFormulaGenerated, 
  trackFormulaCopied, 
  trackPlatformToggle,
  getInputLength,
  createProcessingTimer
} from '@/lib/analytics'
import { Platform } from '@/types'
import { track } from '@vercel/analytics'

const mockTrack = track as jest.MockedFunction<typeof track>

describe('Property 7: Analytics Event Tracking', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('trackFormulaGenerated records events with correct properties', () => {
    fc.assert(fc.property(
      fc.constantFrom('excel' as Platform, 'google-sheets' as Platform),
      fc.integer({ min: 0, max: 1000 }),
      fc.boolean(),
      (platform: Platform, inputLength: number, success: boolean) => {
        mockTrack.mockClear()
        trackFormulaGenerated(platform, inputLength, success)
        expect(mockTrack).toHaveBeenCalledTimes(1)
        expect(mockTrack).toHaveBeenCalledWith('formula_generated', expect.objectContaining({
          platform,
          input_length: inputLength,
          success
        }))
      }
    ), { numRuns: 50 })
  })

  test('trackFormulaCopied records events with correct properties', () => {
    fc.assert(fc.property(
      fc.constantFrom('excel' as Platform, 'google-sheets' as Platform),
      fc.option(fc.integer({ min: 1, max: 500 })),
      (platform: Platform, formulaLength: number | null) => {
        mockTrack.mockClear()
        trackFormulaCopied(platform, formulaLength || undefined)
        expect(mockTrack).toHaveBeenCalledTimes(1)
        expect(mockTrack).toHaveBeenCalledWith('copy_formula', expect.objectContaining({
          platform,
          success: true,
          ...(formulaLength && { input_length: formulaLength })
        }))
      }
    ), { numRuns: 50 })
  })

  test('trackPlatformToggle records platform transitions correctly', () => {
    fc.assert(fc.property(
      fc.constantFrom('excel' as Platform, 'google-sheets' as Platform),
      fc.constantFrom('excel' as Platform, 'google-sheets' as Platform),
      (fromPlatform: Platform, toPlatform: Platform) => {
        mockTrack.mockClear()
        trackPlatformToggle(fromPlatform, toPlatform)
        expect(mockTrack).toHaveBeenCalledTimes(1)
        expect(mockTrack).toHaveBeenCalledWith('platform_toggle', expect.objectContaining({
          platform: toPlatform,
          success: true,
          from_platform: fromPlatform,
          to_platform: toPlatform
        }))
      }
    ), { numRuns: 50 })
  })

  test('analytics tracking fails gracefully when Vercel Analytics throws', () => {
    fc.assert(fc.property(
      fc.constantFrom('excel' as Platform, 'google-sheets' as Platform),
      fc.integer({ min: 0, max: 1000 }),
      fc.boolean(),
      (platform: Platform, inputLength: number, success: boolean) => {
        mockTrack.mockClear()
        mockTrack.mockImplementationOnce(() => {
          throw new Error('Analytics service unavailable')
        })
        expect(() => {
          trackFormulaGenerated(platform, inputLength, success)
        }).not.toThrow()
        expect(console.warn).toHaveBeenCalledWith(
          'Analytics tracking failed for formula_generated:',
          expect.any(Error)
        )
      }
    ), { numRuns: 25 })
  })

  test('getInputLength handles all input types safely', () => {
    fc.assert(fc.property(
      fc.option(fc.string()),
      (input: string | null) => {
        const result = getInputLength(input)
        expect(typeof result).toBe('number')
        expect(result).toBeGreaterThanOrEqual(0)
        if (input) {
          expect(result).toBe(input.length)
        } else {
          expect(result).toBe(0)
        }
      }
    ), { numRuns: 50 })
  })

  test('createProcessingTimer returns positive timing measurements', () => {
    fc.assert(fc.property(
      fc.integer({ min: 1, max: 10 }),
      (iterations: number) => {
        const timer = createProcessingTimer()
        for (let i = 0; i < iterations * 1000; i++) {
          Math.random()
        }
        const elapsedTime = timer()
        expect(elapsedTime).toBeGreaterThanOrEqual(0)
        expect(typeof elapsedTime).toBe('number')
      }
    ), { numRuns: 25 })
  })

  test('basic analytics functions work correctly', () => {
    trackFormulaGenerated('excel', 50, true, 1500)
    expect(mockTrack).toHaveBeenCalledWith('formula_generated', {
      platform: 'excel',
      input_length: 50,
      success: true,
      processing_time: 1500
    })

    mockTrack.mockClear()

    trackFormulaCopied('google-sheets', 25)
    expect(mockTrack).toHaveBeenCalledWith('copy_formula', {
      platform: 'google-sheets',
      success: true,
      input_length: 25
    })

    mockTrack.mockClear()

    trackPlatformToggle('excel', 'google-sheets')
    expect(mockTrack).toHaveBeenCalledWith('platform_toggle', {
      platform: 'google-sheets',
      success: true,
      from_platform: 'excel',
      to_platform: 'google-sheets'
    })
  })

  test('utility functions work correctly', () => {
    expect(getInputLength('hello')).toBe(5)
    expect(getInputLength('')).toBe(0)
    expect(getInputLength(null)).toBe(0)
    expect(getInputLength(undefined)).toBe(0)

    const timer = createProcessingTimer()
    const elapsed = timer()
    expect(elapsed).toBeGreaterThanOrEqual(0)
    expect(typeof elapsed).toBe('number')
  })
})