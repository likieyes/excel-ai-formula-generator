import { NextRequest, NextResponse } from 'next/server'
import { GenerateFormulaRequest, GenerateFormulaResponse, AIResponse } from '@/types'

// System prompts for different platforms
// System prompts for different platforms and tasks
const SYSTEM_PROMPTS: Record<string, string> = {
  'formula-excel': `You are a professional Excel formula expert. Convert natural language descriptions into valid Excel formulas.
Rules:
1. Return ONLY a valid JSON object with "formula" and "explanation" fields.
2. Use Excel-specific syntax (e.g., VLOOKUP, INDEX/MATCH, SUMIF).
3. Formulas must start with =.
4. Explanations must be in English, clear, and concise.
5. If the request is unrelated to spreadsheets, return an error message in the explanation field.`,

  'formula-google-sheets': `You are a professional Google Sheets formula expert. Convert natural language descriptions into valid Google Sheets formulas.
Rules:
1. Return ONLY a valid JSON object with "formula" and "explanation" fields.
2. Use Google Sheets specific syntax (e.g., QUERY, ARRAYFORMULA, FILTER).
3. Formulas must start with =.
4. Explanations must be in English, clear, and concise.
5. If the request is unrelated to spreadsheets, return an error message in the explanation field.`,


  'explain-excel': `You are a professional Excel formula analyst.
Rules:
1. Input is an Excel formula. First, give a one-sentence summary of what the whole formula does, then break it down and explain how it works.
2. Return ONLY a valid JSON object with "formula" (original or formatted formula) and "explanation" (summary + logic breakdown) fields.
3. Everything must be in English.
4. Ensure there is a newline between the summary and the breakdown.`,

  'explain-google-sheets': `You are a professional Google Sheets formula analyst.
Rules:
1. Input is a Google Sheets formula. First, give a one-sentence summary of what the whole formula does, then break it down and explain how it works.
2. Return ONLY a valid JSON object with "formula" (original or formatted formula) and "explanation" (summary + logic breakdown) fields.
3. Everything must be in English.
4. Ensure there is a newline between the summary and the breakdown.`
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

    // Check for ZhipuAI API key
    if (!process.env.ZHIPU_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'AI service is temporarily unavailable'
      } as GenerateFormulaResponse, { status: 503 })
    }

    try {
      // Select appropriate prompt based on task and platform
      const task = body.task || 'formula'
      const promptKey = `${task}-${body.platform}`
      const systemPrompt = SYSTEM_PROMPTS[promptKey] || SYSTEM_PROMPTS[`formula-${body.platform}`]

      const requestBody = {
        model: process.env.ZHIPU_MODEL || 'glm-4-flash',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: body.input
          }
        ],
        max_tokens: 500,
        temperature: 0.1,
      }

      const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.ZHIPU_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('ZhipuAI API error:', response.status, errorData)

        if (response.status === 429) {
          return NextResponse.json({
            success: false,
            error: 'AI正忙，请稍后再试'
          } as GenerateFormulaResponse, { status: 429 })
        }

        if (response.status === 401) {
          return NextResponse.json({
            success: false,
            error: 'AI服务暂时不可用'
          } as GenerateFormulaResponse, { status: 503 })
        }

        return NextResponse.json({
          success: false,
          error: 'AI正忙，请稍后再试'
        } as GenerateFormulaResponse, { status: 503 })
      }

      const completion = await response.json()

      // Parse AI response
      const aiResponseText = completion.choices?.[0]?.message?.content
      if (!aiResponseText) {
        throw new Error('Empty response from AI service')
      }

      console.log('Raw AI Response:', aiResponseText)

      let aiResponse: any
      try {
        // More robust JSON extraction: find the first { and last }
        let jsonText = aiResponseText.trim()
        const firstBrace = jsonText.indexOf('{')
        const lastBrace = jsonText.lastIndexOf('}')

        if (firstBrace !== -1 && lastBrace !== -1) {
          jsonText = jsonText.slice(firstBrace, lastBrace + 1)
        }

        // --- JSON REPAIR LOGIC ---
        // 1. Fix AI common mistake: ["Key": "Value"] instead of {"Key": "Value"}
        // This looks for square brackets that contain colon-separated pairs
        if (jsonText.includes('": "') || jsonText.includes('": "')) {
          // If a property value is an array starting with [ "Key":
          jsonText = jsonText.replace(/\[\s*"([^"]+)"\s*:\s*/g, '{"$1": ')
          // Close it correctly if it was meant to be an object
          // This is a bit risky but handles the specific pattern seen in logs
        }

        // 2. Fix trailing commas which AI often includes
        jsonText = jsonText.replace(/,\s*([}\]])/g, '$1')

        try {
          aiResponse = JSON.parse(jsonText)
        } catch (initialParseError) {
          // AI often returns literal newlines in JSON strings which is invalid JSON.
          // We attempt to escape them by identifying newlines that are not structural (preceded/followed by JSON syntax).
          const fixedNewlines = jsonText.split('\n').map((line: string, i: number, arr: string[]) => {
            const trimmed = line.trim()
            // If this line doesn't end with structural JSON characters and isn't the last line, escape the newline
            if (i < arr.length - 1 && !trimmed.match(/[,{[:]$/) && !arr[i + 1].trim().match(/^["}\]]/)) {
              return line + '\\n'
            }
            return line
          }).join('')

          try {
            aiResponse = JSON.parse(fixedNewlines)
          } catch (secondError) {
            // Second attempt: structural replacement for malformed objects-as-arrays
            const desperateFix = fixedNewlines
              .replace(/\[\s*"([^"]+)"\s*:/g, '{"$1":')
              .replace(/:\s*"([^"]+)"\s*\]/g, ':"$1"}')
            aiResponse = JSON.parse(desperateFix)
          }
        }
      } catch (parseError) {
        console.error('JSON parse error after repair attempts:', parseError)
        console.error('Final attempted JSON text:', aiResponseText)
        throw new Error('Invalid JSON response from AI service')
      }

      // Robust field normalization: Convert arrays or objects to strings if AI returns them
      const normalizeToString = (val: any, depth = 0): string => {
        if (typeof val === 'string') return val
        if (val === null || val === undefined) return ''

        const indent = '  '.repeat(depth)

        if (Array.isArray(val)) {
          return val.map(item => {
            const normalized = normalizeToString(item, depth + 1)
            return depth === 0 ? normalized : `${indent}• ${normalized}`
          }).join(depth === 0 ? '\n\n' : '\n')
        }

        if (typeof val === 'object') {
          return Object.entries(val)
            .map(([key, value]) => {
              const prefix = depth === 0 ? `**${key}**` : `${indent}${key}`
              const normalizedValue = normalizeToString(value, depth + 1)

              // If it's a simple value, put it on same line. If complex, put on next line.
              if (typeof value !== 'object' || value === null) {
                return `${prefix}: ${normalizedValue}`
              }
              return `${prefix}:\n${normalizedValue}`
            })
            .join(depth === 0 ? '\n\n' : '\n')
        }

        return String(val)
      }

      const formula = normalizeToString(aiResponse.formula).trim()
      const explanation = normalizeToString(aiResponse.explanation)
        .replace(/\[换行\]/g, '\n')
        .trim()

      // Validate AI response structure
      if (!formula || !explanation) {
        throw new Error('AI response missing required fields')
      }

      // Check if the response indicates an error (non-spreadsheet request)
      const lowerExplanation = explanation.toLowerCase()
      if (lowerExplanation.includes('i cannot fulfill this request') ||
        lowerExplanation.includes('not a spreadsheet calculation') ||
        lowerExplanation.includes('not related to spreadsheets') ||
        lowerExplanation.includes('无法处理该请求') ||
        lowerExplanation.includes('与电子表格无关')) {
        return NextResponse.json({
          success: false,
          error: explanation
        } as GenerateFormulaResponse, { status: 400 })
      }

      // Return successful response
      return NextResponse.json({
        success: true,
        data: {
          formula,
          explanation
        }
      } as GenerateFormulaResponse)

    } catch (zhipuError: any) {
      console.error('ZhipuAI API error:', zhipuError)

      // Handle specific ZhipuAI errors
      if (zhipuError.status === 429) {
        return NextResponse.json({
          success: false,
          error: 'AI正忙，请稍后再试'
        } as GenerateFormulaResponse, { status: 429 })
      }

      if (zhipuError.status === 401) {
        return NextResponse.json({
          success: false,
          error: 'AI服务暂时不可用'
        } as GenerateFormulaResponse, { status: 503 })
      }

      return NextResponse.json({
        success: false,
        error: 'AI正忙，请稍后再试'
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