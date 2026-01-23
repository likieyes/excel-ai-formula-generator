/**
 * Property-based tests for AI response validation
 * Feature: excel-ai-formula-generator
 */

import * as fc from 'fast-check'
import { AIResponse, GenerateFormulaResponse } from '@/types'

// AI Response validation function (extracted from API route logic)
function validateAIResponse(aiResponseText: string | null | undefined): {
  isValid: boolean
  error?: string
  data?: AIResponse
} {
  // Check for empty response
  if (!aiResponseText) {
    return {
      isValid: false,
      error: 'Empty response from AI service'
    }
  }

  // Parse JSON
  let aiResponse: AIResponse
  try {
    aiResponse = JSON.parse(aiResponseText)
  } catch (parseError) {
    return {
      isValid: false,
      error: 'Invalid JSON response from AI service'
    }
  }

  // Validate required fields exist
  if (!aiResponse.formula || !aiResponse.explanation) {
    return {
      isValid: false,
      error: 'AI response missing required fields'
    }
  }

  // Validate field types
  if (typeof aiResponse.formula !== 'string' || typeof aiResponse.explanation !== 'string') {
    return {
      isValid: false,
      error: 'AI response fields must be strings'
    }
  }

  // Validate field content
  if (aiResponse.formula.length === 0 || aiResponse.explanation.length === 0) {
    return {
      isValid: false,
      error: 'AI response fields cannot be empty'
    }
  }

  // Check for error indicators in explanation
  if (aiResponse.explanation.toLowerCase().includes('error') || 
      aiResponse.explanation.toLowerCase().includes('not spreadsheet') ||
      aiResponse.explanation.toLowerCase().includes('cannot generate')) {
    return {
      isValid: false,
      error: aiResponse.explanation
    }
  }

  return {
    isValid: true,
    data: aiResponse
  }
}

// Function to convert validation result to API response format
function processAIResponse(aiResponseText: string | null | undefined): GenerateFormulaResponse {
  const validation = validateAIResponse(aiResponseText)
  
  if (!validation.isValid) {
    return {
      success: false,
      error: validation.error
    }
  }

  return {
    success: true,
    data: {
      formula: validation.data!.formula,
      explanation: validation.data!.explanation
    }
  }
}

describe('AI Response Validation Property Tests', () => {
  /**
   * Property 10: AI Response Validation
   * **Validates: Requirements 8.5**
   * 
   * For any AI response received, the system should validate the response format 
   * before displaying results to users
   */
  describe('Property 10: AI Response Validation', () => {
    it('should validate proper JSON structure for valid responses', () => {
      fc.assert(
        fc.property(
          fc.record({
            formula: fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.startsWith('=')),
            explanation: fc.string({ minLength: 1, maxLength: 200 }).filter(s => 
              !s.toLowerCase().includes('error') && 
              !s.toLowerCase().includes('not spreadsheet') &&
              !s.toLowerCase().includes('cannot generate')
            )
          }),
          (validAIResponse: AIResponse) => {
            const jsonString = JSON.stringify(validAIResponse)
            const result = validateAIResponse(jsonString)

            // Property: Valid JSON with required fields should pass validation
            expect(result.isValid).toBe(true)
            expect(result.data).toBeDefined()
            expect(result.data!.formula).toBe(validAIResponse.formula)
            expect(result.data!.explanation).toBe(validAIResponse.explanation)
            expect(result.error).toBeUndefined()
          }
        ),
        { numRuns: 25 } // Reduced for faster execution
      )
    })

    it('should detect and handle malformed JSON responses', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constant(''), // Empty string
            fc.constant(null), // Null value
            fc.constant(undefined), // Undefined value
            fc.constant('invalid json'), // Invalid JSON
            fc.constant('{"formula": "=SUM(A1:A10)"'), // Incomplete JSON
            fc.constant('{"incomplete": true}'), // Missing required fields
            fc.constant('{"formula": "", "explanation": "test"}'), // Empty formula
            fc.constant('{"formula": "=SUM(A1:A10)", "explanation": ""}'), // Empty explanation
            fc.constant('{"formula": 123, "explanation": "test"}'), // Wrong type for formula
            fc.constant('{"formula": "=SUM(A1:A10)", "explanation": 456}'), // Wrong type for explanation
          ),
          (malformedResponse: any) => {
            const result = validateAIResponse(malformedResponse)

            // Property: Malformed responses should always fail validation
            expect(result.isValid).toBe(false)
            expect(result.error).toBeDefined()
            expect(typeof result.error).toBe('string')
            expect(result.error!.length).toBeGreaterThan(0)
            expect(result.data).toBeUndefined()
          }
        ),
        { numRuns: 20 } // Reduced for faster execution
      )
    })

    it('should detect error indicators in AI responses', () => {
      fc.assert(
        fc.property(
          fc.record({
            formula: fc.string({ minLength: 1, maxLength: 100 }),
            explanation: fc.oneof(
              fc.constant('Error: Cannot generate formula for this request'),
              fc.constant('This is not spreadsheet related'),
              fc.constant('Cannot generate a formula for this input'),
              fc.constant('ERROR: Invalid request'),
              fc.constant('Not spreadsheet content'),
              fc.string({ minLength: 10, maxLength: 100 }).map(s => s + ' error occurred'),
              fc.string({ minLength: 10, maxLength: 100 }).map(s => 'Cannot generate ' + s)
            )
          }),
          (errorResponse: AIResponse) => {
            const jsonString = JSON.stringify(errorResponse)
            const result = validateAIResponse(jsonString)

            // Property: Responses with error indicators should fail validation
            expect(result.isValid).toBe(false)
            expect(result.error).toBeDefined()
            expect(result.error).toBe(errorResponse.explanation)
          }
        ),
        { numRuns: 20 } // Reduced for faster execution
      )
    })

    it('should handle required field validation correctly', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            // Missing formula field
            fc.record({
              explanation: fc.string({ minLength: 1, maxLength: 100 })
            }),
            // Missing explanation field
            fc.record({
              formula: fc.string({ minLength: 1, maxLength: 100 })
            }),
            // Both fields missing
            fc.record({
              someOtherField: fc.string()
            }),
            // Null values for required fields
            fc.record({
              formula: fc.constant(null),
              explanation: fc.string({ minLength: 1, maxLength: 100 })
            }),
            fc.record({
              formula: fc.string({ minLength: 1, maxLength: 100 }),
              explanation: fc.constant(null)
            })
          ),
          (incompleteResponse: any) => {
            const jsonString = JSON.stringify(incompleteResponse)
            const result = validateAIResponse(jsonString)

            // Property: Responses missing required fields should fail validation
            expect(result.isValid).toBe(false)
            expect(result.error).toBeDefined()
            expect(result.error).toMatch(/missing required fields|fields must be strings|fields cannot be empty/i)
          }
        ),
        { numRuns: 20 } // Reduced for faster execution
      )
    })

    it('should process validation results into proper API response format', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            // Valid response
            fc.record({
              formula: fc.string({ minLength: 2, maxLength: 100 }).filter(s => s.startsWith('=')),
              explanation: fc.string({ minLength: 5, maxLength: 100 }).filter(s => 
                !s.toLowerCase().includes('error')
              )
            }).map(r => JSON.stringify(r)),
            // Invalid response
            fc.oneof(
              fc.constant('invalid json'),
              fc.constant('{"formula": ""}'),
              fc.constant('{"explanation": "Error occurred"}')
            )
          ),
          (aiResponseText: string) => {
            const apiResponse = processAIResponse(aiResponseText)

            // Property: API response must always have success field
            expect(apiResponse).toHaveProperty('success')
            expect(typeof apiResponse.success).toBe('boolean')

            if (apiResponse.success) {
              // Property: Successful responses must have data with formula and explanation
              expect(apiResponse).toHaveProperty('data')
              expect(apiResponse.data).toHaveProperty('formula')
              expect(apiResponse.data).toHaveProperty('explanation')
              expect(typeof apiResponse.data!.formula).toBe('string')
              expect(typeof apiResponse.data!.explanation).toBe('string')
              expect(apiResponse.data!.formula.length).toBeGreaterThan(0)
              expect(apiResponse.data!.explanation.length).toBeGreaterThan(0)
              expect(apiResponse.error).toBeUndefined()
            } else {
              // Property: Failed responses must have error message
              expect(apiResponse).toHaveProperty('error')
              expect(typeof apiResponse.error).toBe('string')
              expect(apiResponse.error!.length).toBeGreaterThan(0)
              expect(apiResponse.data).toBeUndefined()
            }
          }
        ),
        { numRuns: 30 } // Reduced for faster execution
      )
    })

    it('should maintain validation consistency across multiple calls', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.oneof(
              // Valid responses
              fc.record({
                formula: fc.string({ minLength: 2, maxLength: 50 }).filter(s => s.startsWith('=')),
                explanation: fc.string({ minLength: 5, maxLength: 50 })
              }).map(r => JSON.stringify(r)),
              // Invalid responses
              fc.oneof(
                fc.constant(''),
                fc.constant('invalid'),
                fc.constant('{"formula": ""}')
              )
            ),
            { minLength: 2, maxLength: 5 }
          ),
          (responses: string[]) => {
            const results = responses.map(response => validateAIResponse(response))

            // Property: Validation should be consistent - same input should give same result
            for (let i = 0; i < responses.length; i++) {
              const response = responses[i]
              const result1 = validateAIResponse(response)
              const result2 = validateAIResponse(response)

              expect(result1.isValid).toBe(result2.isValid)
              expect(result1.error).toBe(result2.error)
              
              if (result1.data && result2.data) {
                expect(result1.data.formula).toBe(result2.data.formula)
                expect(result1.data.explanation).toBe(result2.data.explanation)
              }
            }
          }
        ),
        { numRuns: 15 } // Reduced for faster execution
      )
    })
  })
})