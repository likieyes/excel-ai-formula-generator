// Core data models for Excel AI Formula Generator

// Platform and Task types
export type Platform = 'excel' | 'google-sheets'
export type GenerateTask = 'formula' | 'vba' | 'explain'

// Formula Request Model
export interface FormulaRequest {
  id: string
  input: string
  platform: Platform
  timestamp: Date
  userAgent?: string
}

// Formula Response Model
export interface FormulaResponse {
  id: string
  requestId: string
  formula: string
  explanation: string
  success: boolean
  processingTime: number
  timestamp: Date
}

// API Request/Response interfaces
export interface GenerateFormulaRequest {
  input: string
  platform: Platform
  task?: GenerateTask
}

export interface GenerateFormulaResponse {
  success: boolean
  data?: {
    formula: string
    explanation: string
  }
  error?: string
}

// Analytics Event Model
export interface AnalyticsEvent {
  id: string
  event: string
  properties: Record<string, any>
  timestamp: Date
  sessionId?: string
}

// Specific analytics event types
export type AnalyticsEventType = 'formula_generated' | 'copy_formula' | 'platform_toggle'

export interface AnalyticsEventProperties {
  platform?: Platform
  input_length?: number
  success?: boolean
  error_type?: string
  processing_time?: number
  [key: string]: any // Add index signature for Vercel Analytics compatibility
}

// UI State Model
export interface AppState {
  selectedPlatform: Platform
  inputText: string
  isLoading: boolean
  currentResult: {
    formula: string
    explanation: string
  } | null
  error: string | null
}

// OpenAI Integration interfaces
export interface AIPrompt {
  role: 'system' | 'user'
  content: string
}

export interface AIResponse {
  formula: string
  explanation: string
}

// Component Props interfaces
export interface FormulaGeneratorProps {
  platform: Platform
  onGenerate: (input: string, platform: Platform) => void
  isLoading: boolean
}

export interface ResultDisplayProps {
  formula: string | null
  explanation: string | null
  isVisible: boolean
  onCopy?: () => void
}

export interface PlatformSelectorProps {
  selectedPlatform: Platform
  onPlatformChange: (platform: Platform) => void
}

// Quick-fill tag interface
export interface QuickFillTag {
  id: string
  label: string
  example: string
  category: 'math' | 'text' | 'date' | 'lookup' | 'logical'
}

// Error types
export type ErrorType = 'ai_service_error' | 'network_error' | 'validation_error' | 'rate_limit_error'

export interface AppError {
  type: ErrorType
  message: string
  details?: string
  timestamp: Date
}

// SEO and metadata interfaces
export interface SEOMetadata {
  title: string
  description: string
  keywords: string[]
  canonicalUrl: string
  ogTitle: string
  ogDescription: string
  ogImage?: string
}

// Performance metrics interface
export interface PerformanceMetrics {
  responseTime: number
  renderTime: number
  coreWebVitals: {
    lcp?: number // Largest Contentful Paint
    fid?: number // First Input Delay
    cls?: number // Cumulative Layout Shift
  }
}

// Blog types
export interface BlogPost {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  author: string
  tags: string[]
  readTime: number
}

// Formula Library types
export interface FormulaItem {
  slug: string        // e.g., "extract-email-excel"
  title: string       // H1 tag
  description: string // Meta description
  question: string    // The specific user problem
  formula: string     // The Excel formula code
  explanation: string[] // Bullet points explaining the formula
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  category: string
  published: boolean  // Control flag for staged rollout
}