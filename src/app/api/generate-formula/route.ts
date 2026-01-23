import { NextRequest, NextResponse } from 'next/server'
import { GenerateFormulaRequest, GenerateFormulaResponse, AIResponse } from '@/types'

// System prompts for different platforms
const SYSTEM_PROMPTS = {
  excel: `你是一个专业的Excel公式生成专家。将自然语言描述转换为有效的Excel公式。

规则:
1. 只返回包含"formula"和"explanation"字段的有效JSON
2. 使用Excel特定语法 (如 VLOOKUP, INDEX/MATCH, SUMIF)
3. 公式必须以=号开头
4. 解释应该简单易懂，不超过200个字符
5. 如果请求与电子表格无关，在explanation字段返回错误信息

示例响应:
{"formula": "=VLOOKUP(A2,B:D,3,FALSE)", "explanation": "在B到D列范围内查找A2的值，返回第3列对应的值"}`,

  'google-sheets': `你是一个专业的Google表格公式生成专家。将自然语言描述转换为有效的Google表格公式。

规则:
1. 只返回包含"formula"和"explanation"字段的有效JSON
2. 使用Google表格特定语法 (如 QUERY, ARRAYFORMULA, FILTER)
3. 公式必须以=号开头
4. 解释应该简单易懂，不超过200个字符
5. 如果请求与电子表格无关，在explanation字段返回错误信息

示例响应:
{"formula": "=QUERY(A:C,\"SELECT A,B,C WHERE B > 100\")", "explanation": "查询A到C列的数据，返回B列大于100的所有行"}`
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
      // Generate formula using ZhipuAI OpenAI-compatible API
      const requestBody = {
        model: process.env.ZHIPU_MODEL || 'glm-4-flash',
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

      let aiResponse: AIResponse
      try {
        // Extract JSON from markdown code blocks if present
        let jsonText = aiResponseText.trim()
        if (jsonText.startsWith('```json') && jsonText.endsWith('```')) {
          jsonText = jsonText.slice(7, -3).trim()
        } else if (jsonText.startsWith('```') && jsonText.endsWith('```')) {
          jsonText = jsonText.slice(3, -3).trim()
        }
        
        aiResponse = JSON.parse(jsonText)
      } catch (parseError) {
        console.error('JSON parse error:', parseError)
        console.error('Response text:', aiResponseText)
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
          aiResponse.explanation.toLowerCase().includes('cannot generate') ||
          aiResponse.explanation.includes('错误') ||
          aiResponse.explanation.includes('无法生成')) {
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