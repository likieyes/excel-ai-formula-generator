import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { GenerateFormulaRequest, GenerateFormulaResponse, AIResponse } from '@/types'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build',
})

// System prompts for different platforms
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
{"formula": "=QUERY(A:C,\"SELECT A,B,C WHERE B > 100\")", "explanation": "Queries data in columns A to C and returns rows where column B is greater than 100"}`
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: GenerateFormulaRequest = await request.json()
    
    // Validate request
    if (!body.input || !body.platform) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: input and platform'
      } as GenerateFormulaResponse, { status: 400 })
    }

    if (!['excel', 'google-sheets'].includes(body.platform)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid platform. Must be "excel" or "google-sheets"'
      } as GenerateFormulaResponse, { status: 400 })
    }

    if (body.input.length > 1000) {
      return NextResponse.json({
        success: false,
        error: 'Input too long. Maximum 1000 characters allowed.'
      } as GenerateFormulaResponse, { status: 400 })
    }

    // Check for OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'AI service is temporarily unavailable'
      } as GenerateFormulaResponse, { status: 503 })
    }

    const startTime = Date.now()

    try {
      // Generate formula using OpenAI
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPTS[body.platform]
          },
          {
            role: 'user',
            content: body.input
          }
        ],
        max_tokens: 500,
        temperature: 0.1, // Low temperature for consistent results
        response_format: { type: 'json_object' }
      })

      const processingTime = Date.now() - startTime

      // Parse AI response
      const aiResponseText = completion.choices[0]?.message?.content
      if (!aiResponseText) {
        throw new Error('Empty response from AI service')
      }

      let aiResponse: AIResponse
      try {
        aiResponse = JSON.parse(aiResponseText)
      } catch (parseError) {
        throw new Error('Invalid JSON response from AI service')
      }

      // Validate AI response structure
      if (!aiResponse.formula || !aiResponse.explanation) {
        throw new Error('AI response missing required fields')
      }

      if (typeof aiResponse.formula !== 'string' || typeof aiResponse.explanation !== 'string') {
        throw new Error('AI response fields must be strings')
      }

      if (aiResponse.formula.length === 0 || aiResponse.explanation.length === 0) {
        throw new Error('AI response fields cannot be empty')
      }

      // Check if the response indicates an error (non-spreadsheet request)
      if (aiResponse.explanation.toLowerCase().includes('error') || 
          aiResponse.explanation.toLowerCase().includes('not spreadsheet') ||
          aiResponse.explanation.toLowerCase().includes('cannot generate')) {
        return NextResponse.json({
          success: false,
          error: aiResponse.explanation
        } as GenerateFormulaResponse, { status: 400 })
      }

      // Return successful response
      return NextResponse.json({
        success: true,
        data: {
          formula: aiResponse.formula,
          explanation: aiResponse.explanation
        }
      } as GenerateFormulaResponse)

    } catch (openaiError: any) {
      console.error('OpenAI API error:', openaiError)
      
      // Handle specific OpenAI errors
      if (openaiError.status === 429) {
        return NextResponse.json({
          success: false,
          error: 'AI is busy, please try again in a moment'
        } as GenerateFormulaResponse, { status: 429 })
      }

      if (openaiError.status === 401) {
        return NextResponse.json({
          success: false,
          error: 'AI service is temporarily unavailable'
        } as GenerateFormulaResponse, { status: 503 })
      }

      return NextResponse.json({
        success: false,
        error: 'AI is busy, please try again'
      } as GenerateFormulaResponse, { status: 503 })
    }

  } catch (error: any) {
    console.error('API route error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'An unexpected error occurred. Please try again.'
    } as GenerateFormulaResponse, { status: 500 })
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json({
    success: false,
    error: 'Method not allowed. Use POST to generate formulas.'
  }, { status: 405 })
}