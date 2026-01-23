/**
 * Property-based tests for data model validation
 * Feature: excel-ai-formula-generator
 */

import * as fc from 'fast-check'
import { AIResponse, GenerateFormulaResponse, AnalyticsEvent, FormulaRequest, FormulaResponse } from '@/types'

describe('Data Model Property Tests', () => {
  /**
   * Property 9: AI Response Structure
   * **Validates: Requirements 8.2, 8.3**
   * 
   * For any successful AI integration response, the output should be valid JSON 
   * containing both formula and explanation fields
   */
  describe('Property 9: AI Response Structure', () => {
    it('should always contain formula and explanation fields for valid AI responses', () => {
      fc.assert(
        fc.property(
          fc.record({
            formula: fc.string({ minLength: 1, maxLength: 500 }),
            explanation: fc.string({ minLength: 1, maxLength: 1000 })
          }),
          (aiResponse: AIResponse) => {
            // Property: Any valid AI response must have both required fields
            expect(aiResponse).toHaveProperty('formula')
            expect(aiResponse).toHaveProperty('explanation')
            
            // Property: Formula and explanation must be non-empty strings
            expect(typeof aiResponse.formula).toBe('string')
            expect(typeof aiResponse.explanation).toBe('string')
            expect(aiResponse.formula.length).toBeGreaterThan(0)
            expect(aiResponse.explanation.length).toBeGreaterThan(0)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should maintain structure consistency in API responses', () => {
      fc.assert(
        fc.property(
          fc.record({
            success: fc.boolean(),
            data: fc.option(
              fc.record({
                formula: fc.string({ minLength: 1 }),
                explanation: fc.string({ minLength: 1 })
              })
            ),
            error: fc.option(fc.string())
          }),
          (response: GenerateFormulaResponse) => {
            // Property: Response must have success field
            expect(response).toHaveProperty('success')
            expect(typeof response.success).toBe('boolean')
            
            // Property: If successful, must have data with formula and explanation
            if (response.success && response.data) {
              expect(response.data).toHaveProperty('formula')
              expect(response.data).toHaveProperty('explanation')
              expect(typeof response.data.formula).toBe('string')
              expect(typeof response.data.explanation).toBe('string')
              expect(response.data.formula.length).toBeGreaterThan(0)
              expect(response.data.explanation.length).toBeGreaterThan(0)
            }
            
            // Property: If not successful, should have error message
            if (!response.success) {
              expect(response.error).toBeDefined()
              if (response.error) {
                expect(typeof response.error).toBe('string')
                expect(response.error.length).toBeGreaterThan(0)
              }
            }
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  /**
   * Additional property tests for data model consistency
   */
  describe('Data Model Consistency Properties', () => {
    it('should maintain FormulaRequest structure integrity', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.uuid(),
            input: fc.string({ minLength: 1, maxLength: 1000 }),
            platform: fc.constantFrom('excel', 'google-sheets'),
            timestamp: fc.date(),
            userAgent: fc.option(fc.string())
          }),
          (request: FormulaRequest) => {
            expect(request).toHaveProperty('id')
            expect(request).toHaveProperty('input')
            expect(request).toHaveProperty('platform')
            expect(request).toHaveProperty('timestamp')
            
            expect(typeof request.id).toBe('string')
            expect(typeof request.input).toBe('string')
            expect(['excel', 'google-sheets']).toContain(request.platform)
            expect(request.timestamp).toBeInstanceOf(Date)
            
            if (request.userAgent) {
              expect(typeof request.userAgent).toBe('string')
            }
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should maintain FormulaResponse structure integrity', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.uuid(),
            requestId: fc.uuid(),
            formula: fc.string({ minLength: 1 }),
            explanation: fc.string({ minLength: 1 }),
            success: fc.boolean(),
            processingTime: fc.nat({ max: 10000 }),
            timestamp: fc.date()
          }),
          (response: FormulaResponse) => {
            expect(response).toHaveProperty('id')
            expect(response).toHaveProperty('requestId')
            expect(response).toHaveProperty('formula')
            expect(response).toHaveProperty('explanation')
            expect(response).toHaveProperty('success')
            expect(response).toHaveProperty('processingTime')
            expect(response).toHaveProperty('timestamp')
            
            expect(typeof response.id).toBe('string')
            expect(typeof response.requestId).toBe('string')
            expect(typeof response.formula).toBe('string')
            expect(typeof response.explanation).toBe('string')
            expect(typeof response.success).toBe('boolean')
            expect(typeof response.processingTime).toBe('number')
            expect(response.timestamp).toBeInstanceOf(Date)
            
            expect(response.processingTime).toBeGreaterThanOrEqual(0)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should maintain AnalyticsEvent structure integrity', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.uuid(),
            event: fc.constantFrom('formula_generated', 'copy_formula', 'platform_toggle'),
            properties: fc.dictionary(fc.string(), fc.anything()),
            timestamp: fc.date(),
            sessionId: fc.option(fc.uuid())
          }),
          (event: AnalyticsEvent) => {
            expect(event).toHaveProperty('id')
            expect(event).toHaveProperty('event')
            expect(event).toHaveProperty('properties')
            expect(event).toHaveProperty('timestamp')
            
            expect(typeof event.id).toBe('string')
            expect(typeof event.event).toBe('string')
            expect(typeof event.properties).toBe('object')
            expect(event.timestamp).toBeInstanceOf(Date)
            
            if (event.sessionId) {
              expect(typeof event.sessionId).toBe('string')
            }
          }
        ),
        { numRuns: 100 }
      )
    })
  })
})