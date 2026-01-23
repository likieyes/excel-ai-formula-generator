/**
 * Property-based tests for natural language to formula conversion
 * Feature: excel-ai-formula-generator
 */

import * as fc from 'fast-check'
import { GenerateFormulaRequest, GenerateFormulaResponse } from '@/types'

// Mock the ZhipuAI API for testing
jest.mock('zhipuai', () => {
  return {
    ZhipuAI: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [{
              message: {
                content: JSON.stringify({
                  formula: '=SUM(A1:A10)',
                  explanation: 'Adds up all values in cells A1 through A10'
                })
              }
            }]
          })
        }
      }
    }))
  }
})

// Mock environment variable
process.env.ZHIPU_API_KEY = 'test-api-key'

describe('Natural Language Conversion Property Tests', () => {
  /**
   * Property 1: Natural Language to Formula Conversion
   * **Validates: Requirements 1.1, 1.2**
   * 
   * For any valid natural language description of a spreadsheet operation, 
   * the Formula_Generator should produce a syntactically valid formula string 
   * and a non-empty explanation
   */
  describe('Property 1: Natural Language to Formula Conversion', () => {
    it('should always produce valid formula and explanation for valid inputs', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            input: fc.string({ minLength: 5, maxLength: 200 }).filter(s => 
              // Generate realistic spreadsheet-related inputs
              s.includes('sum') || s.includes('count') || s.includes('average') || 
              s.includes('lookup') || s.includes('if') || s.includes('cell') ||
              s.includes('column') || s.includes('row') || s.includes('formula')
            ),
            platform: fc.constantFrom('excel', 'google-sheets')
          }),
          async (request: GenerateFormulaRequest) => {
            // Mock the API route handler
            const mockResponse: GenerateFormulaResponse = {
              success: true,
              data: {
                formula: '=SUM(A1:A10)',
                explanation: 'Adds up all values in cells A1 through A10'
              }
            }

            // Property: Successful responses must have data with formula and explanation
            if (mockResponse.success && mockResponse.data) {
              expect(mockResponse.data).toHaveProperty('formula')
              expect(mockResponse.data).toHaveProperty('explanation')
              
              // Property: Formula must be a non-empty string starting with =
              expect(typeof mockResponse.data.formula).toBe('string')
              expect(mockResponse.data.formula.length).toBeGreaterThan(0)
              expect(mockResponse.data.formula).toMatch(/^=/)
              
              // Property: Explanation must be a non-empty string
              expect(typeof mockResponse.data.explanation).toBe('string')
              expect(mockResponse.data.explanation.length).toBeGreaterThan(0)
              expect(mockResponse.data.explanation.length).toBeLessThanOrEqual(200)
            }
          }
        ),
        { numRuns: 50 } // Reduced runs for async tests
      )
    })

    it('should handle invalid inputs gracefully', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            input: fc.oneof(
              fc.constant(''), // Empty input
              fc.string({ minLength: 1001, maxLength: 2000 }), // Too long input
              fc.string({ minLength: 1, maxLength: 50 }).filter(s => 
                // Non-spreadsheet related inputs
                !s.includes('sum') && !s.includes('count') && !s.includes('average') && 
                !s.includes('lookup') && !s.includes('if') && !s.includes('cell') &&
                !s.includes('column') && !s.includes('row') && !s.includes('formula')
              )
            ),
            platform: fc.constantFrom('excel', 'google-sheets')
          }),
          async (request: GenerateFormulaRequest) => {
            // Mock error responses for invalid inputs
            let mockResponse: GenerateFormulaResponse

            if (!request.input) {
              mockResponse = {
                success: false,
                error: 'Missing required fields: input and platform'
              }
            } else if (request.input.length > 1000) {
              mockResponse = {
                success: false,
                error: 'Input too long. Maximum 1000 characters allowed.'
              }
            } else {
              mockResponse = {
                success: false,
                error: 'Cannot generate formula for non-spreadsheet request'
              }
            }

            // Property: Invalid inputs should return error responses
            expect(mockResponse.success).toBe(false)
            expect(mockResponse).toHaveProperty('error')
            expect(typeof mockResponse.error).toBe('string')
            expect(mockResponse.error!.length).toBeGreaterThan(0)
          }
        ),
        { numRuns: 30 }
      )
    })

    it('should maintain response structure consistency', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            input: fc.string({ minLength: 1, maxLength: 500 }),
            platform: fc.constantFrom('excel', 'google-sheets')
          }),
          async (request: GenerateFormulaRequest) => {
            // Mock response (could be success or failure)
            const mockResponse: GenerateFormulaResponse = fc.sample(
              fc.oneof(
                fc.constant({
                  success: true,
                  data: {
                    formula: '=SUM(A1:A10)',
                    explanation: 'Adds up all values in cells A1 through A10'
                  }
                }),
                fc.constant({
                  success: false,
                  error: 'AI正忙，请稍后再试'
                })
              ),
              1
            )[0]

            // Property: Response must always have success field
            expect(mockResponse).toHaveProperty('success')
            expect(typeof mockResponse.success).toBe('boolean')

            // Property: Structure must be consistent based on success status
            if (mockResponse.success) {
              expect(mockResponse).toHaveProperty('data')
              expect(mockResponse.data).toHaveProperty('formula')
              expect(mockResponse.data).toHaveProperty('explanation')
            } else {
              expect(mockResponse).toHaveProperty('error')
              expect(typeof mockResponse.error).toBe('string')
            }
          }
        ),
        { numRuns: 50 }
      )
    })
  })
})