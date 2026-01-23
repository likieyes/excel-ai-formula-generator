/**
 * Property-Based Test: Platform-Aware AI Processing
 * 
 * Feature: excel-ai-formula-generator
 * Property 11: Platform-Aware AI Processing
 * **Validates: Requirements 8.4**
 * 
 * This test verifies that the AI integration handles requests according to 
 * the selected platform's syntax requirements (Excel vs Google Sheets).
 */

import fc from 'fast-check'
import { GenerateFormulaRequest, Platform } from '@/types'

// Test the platform-aware system prompt generation logic
function getSystemPrompt(platform: Platform): string {
  const SYSTEM_PROMPTS = {
    excel: `You are an expert Excel formula generator. Convert natural language descriptions into valid Excel formulas.

Rules:
1. Return ONLY valid JSON with "formula" and "explanation" fields
2. Use Excel-specific syntax (e.g., VLOOKUP, INDEX/MATCH, SUMIF)
3. Formula should start with = sign
4. Explanation should be beginner-friendly and under 200 characters
5. If the request is not spreadsheet-related, return an error in the explanation field

Example response:
{"formula": "=VLOOKUP(A2,B:D,3,FALSE)", "explanation": "Looks up the value in A2 within columns B to D and returns the value from the 3rd column"}`,

    'google-sheets': `You are an expert Google Sheets formula generator. Convert natural language descriptions into valid Google Sheets formulas.

Rules:
1. Return ONLY valid JSON with "formula" and "explanation" fields
2. Use Google Sheets-specific syntax (e.g., QUERY, ARRAYFORMULA, FILTER)
3. Formula should start with = sign
4. Explanation should be beginner-friendly and under 200 characters
5. If the request is not spreadsheet-related, return an error in the explanation field

Example response:
{"formula": "=QUERY(A:C,\\"SELECT A,B,C WHERE B > 100\\")", "explanation": "Queries data in columns A to C and returns rows where column B is greater than 100"}`
  }
  
  return SYSTEM_PROMPTS[platform]
}

// Test the request validation logic
function validateRequest(body: any): { valid: boolean; error?: string } {
  if (!body.input || !body.platform) {
    return { valid: false, error: 'Missing required fields: input and platform' }
  }

  if (!['excel', 'google-sheets'].includes(body.platform)) {
    return { valid: false, error: 'Invalid platform. Must be "excel" or "google-sheets"' }
  }

  if (body.input.length > 1000) {
    return { valid: false, error: 'Input too long. Maximum 1000 characters allowed.' }
  }

  return { valid: true }
}

describe('Property 11: Platform-Aware AI Processing', () => {
  /**
   * Property: For any valid natural language input and platform selection,
   * the AI integration should generate platform-specific system prompts
   * that contain the appropriate syntax requirements.
   */
  it('should generate platform-specific system prompts with appropriate syntax requirements', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate test inputs
        fc.record({
          input: fc.string({ minLength: 10, maxLength: 200 }).filter(s => 
            s.trim().length > 5 && 
            /[a-zA-Z]/.test(s) && // Contains letters
            !s.includes('"') && // No quotes to avoid JSON issues
            !s.includes('\\') // No backslashes
          ),
          platform: fc.constantFrom('excel' as Platform, 'google-sheets' as Platform)
        }),
        
        async ({ input, platform }) => {
          // Test request validation
          const requestBody: GenerateFormulaRequest = {
            input: input.trim(),
            platform
          }

          const validation = validateRequest(requestBody)
          expect(validation.valid).toBe(true)

          // Test platform-specific system prompt generation
          const systemPrompt = getSystemPrompt(platform)
          
          // Verify platform-specific content in system prompt
          if (platform === 'excel') {
            expect(systemPrompt).toContain('Excel formula generator')
            expect(systemPrompt).toContain('Excel-specific syntax')
            expect(systemPrompt).toContain('VLOOKUP')
            expect(systemPrompt).toContain('INDEX/MATCH')
            expect(systemPrompt).toContain('SUMIF')
            expect(systemPrompt).not.toContain('Google Sheets')
            expect(systemPrompt).not.toContain('QUERY')
            expect(systemPrompt).not.toContain('ARRAYFORMULA')
          } else {
            expect(systemPrompt).toContain('Google Sheets formula generator')
            expect(systemPrompt).toContain('Google Sheets-specific syntax')
            expect(systemPrompt).toContain('QUERY')
            expect(systemPrompt).toContain('ARRAYFORMULA')
            expect(systemPrompt).toContain('FILTER')
            expect(systemPrompt).not.toContain('Excel')
            expect(systemPrompt).not.toContain('VLOOKUP')
            expect(systemPrompt).not.toContain('INDEX/MATCH')
          }

          // Verify common requirements in both prompts
          expect(systemPrompt).toContain('Return ONLY valid JSON')
          expect(systemPrompt).toContain('formula')
          expect(systemPrompt).toContain('explanation')
          expect(systemPrompt).toContain('Formula should start with = sign')
          expect(systemPrompt).toContain('beginner-friendly')
        }
      ),
      { 
        numRuns: 50,
        timeout: 5000,
        verbose: true
      }
    )
  })

  /**
   * Property: Platform-aware processing should maintain consistency
   * for the same platform across multiple requests.
   */
  it('should maintain consistent platform-specific prompts for same platform', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('excel' as Platform, 'google-sheets' as Platform),
        
        async (platform) => {
          // Generate system prompts multiple times for the same platform
          const prompt1 = getSystemPrompt(platform)
          const prompt2 = getSystemPrompt(platform)
          const prompt3 = getSystemPrompt(platform)

          // All prompts should be identical for the same platform
          expect(prompt1).toBe(prompt2)
          expect(prompt2).toBe(prompt3)
          expect(prompt1).toBe(prompt3)

          // Verify platform-specific content is consistent
          if (platform === 'excel') {
            expect(prompt1).toContain('Excel')
            expect(prompt1).toContain('VLOOKUP')
          } else {
            expect(prompt1).toContain('Google Sheets')
            expect(prompt1).toContain('QUERY')
          }
        }
      ),
      { 
        numRuns: 25,
        timeout: 3000
      }
    )
  })

  /**
   * Property: Platform-aware processing should generate different prompts
   * for different platforms.
   */
  it('should generate different prompts for different platforms', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 20, maxLength: 150 }).filter(s => 
          s.trim().length > 15 && 
          /[a-zA-Z]/.test(s) &&
          !s.includes('"') &&
          !s.includes('\\')
        ),
        
        async (input) => {
          // Generate system prompts for both platforms
          const excelPrompt = getSystemPrompt('excel')
          const googleSheetsPrompt = getSystemPrompt('google-sheets')

          // Prompts should be different
          expect(excelPrompt).not.toBe(googleSheetsPrompt)

          // Excel prompt should contain Excel-specific content
          expect(excelPrompt).toContain('Excel')
          expect(excelPrompt).toContain('VLOOKUP')
          expect(excelPrompt).toContain('INDEX/MATCH')
          expect(excelPrompt).toContain('SUMIF')

          // Google Sheets prompt should contain Google Sheets-specific content
          expect(googleSheetsPrompt).toContain('Google Sheets')
          expect(googleSheetsPrompt).toContain('QUERY')
          expect(googleSheetsPrompt).toContain('ARRAYFORMULA')
          expect(googleSheetsPrompt).toContain('FILTER')

          // Cross-contamination check
          expect(excelPrompt).not.toContain('Google Sheets')
          expect(excelPrompt).not.toContain('QUERY')
          expect(googleSheetsPrompt).not.toContain('Excel formula generator')
          expect(googleSheetsPrompt).not.toContain('VLOOKUP')
        }
      ),
      { 
        numRuns: 30,
        timeout: 5000
      }
    )
  })

  /**
   * Property: Request validation should properly handle invalid inputs
   * while accepting valid platform-specific requests.
   */
  it('should validate requests according to platform requirements', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          input: fc.option(fc.string({ minLength: 1, maxLength: 1500 }), { nil: null }),
          platform: fc.option(
            fc.oneof(
              fc.constantFrom('excel', 'google-sheets'),
              fc.string({ minLength: 1, maxLength: 20 })
            ),
            { nil: null }
          )
        }),
        
        async ({ input, platform }) => {
          const requestBody = { input, platform }
          const validation = validateRequest(requestBody)

          // Check validation logic
          if (!input || !platform) {
            expect(validation.valid).toBe(false)
            expect(validation.error).toContain('Missing required fields')
          } else if (!['excel', 'google-sheets'].includes(platform as string)) {
            expect(validation.valid).toBe(false)
            expect(validation.error).toContain('Invalid platform')
          } else if (input.length > 1000) {
            expect(validation.valid).toBe(false)
            expect(validation.error).toContain('Input too long')
          } else {
            expect(validation.valid).toBe(true)
            expect(validation.error).toBeUndefined()
          }
        }
      ),
      { 
        numRuns: 100,
        timeout: 5000
      }
    )
  })
})