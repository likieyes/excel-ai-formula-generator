import { track } from '@vercel/analytics'
import { 
  AnalyticsEventType, 
  AnalyticsEventProperties, 
  Platform 
} from '@/types'

/**
 * Analytics tracking system for Excel AI Formula Generator
 * Integrates with Vercel Analytics for user interaction tracking
 */

/**
 * Track when a formula is successfully generated
 * @param platform - The platform (Excel or Google Sheets) used
 * @param inputLength - Length of the user's natural language input
 * @param success - Whether the generation was successful
 * @param processingTime - Time taken to process the request in milliseconds
 * @param errorType - Type of error if generation failed
 */
export function trackFormulaGenerated(
  platform: Platform,
  inputLength: number,
  success: boolean,
  processingTime?: number,
  errorType?: string
): void {
  const properties: AnalyticsEventProperties = {
    platform,
    input_length: inputLength,
    success,
    ...(processingTime && { processing_time: processingTime }),
    ...(errorType && { error_type: errorType })
  }

  try {
    track('formula_generated', properties)
  } catch (error) {
    // Fail silently to not affect user experience
    console.warn('Analytics tracking failed for formula_generated:', error)
  }
}

/**
 * Track when a user copies a generated formula
 * @param platform - The platform (Excel or Google Sheets) of the copied formula
 * @param formulaLength - Length of the copied formula
 */
export function trackFormulaCopied(
  platform: Platform,
  formulaLength?: number
): void {
  const properties: AnalyticsEventProperties = {
    platform,
    success: true,
    ...(formulaLength && { input_length: formulaLength })
  }

  try {
    track('copy_formula', properties)
  } catch (error) {
    // Fail silently to not affect user experience
    console.warn('Analytics tracking failed for copy_formula:', error)
  }
}

/**
 * Track when a user switches between Excel and Google Sheets platforms
 * @param fromPlatform - The platform the user switched from
 * @param toPlatform - The platform the user switched to
 */
export function trackPlatformToggle(
  fromPlatform: Platform,
  toPlatform: Platform
): void {
  const properties: AnalyticsEventProperties = {
    platform: toPlatform,
    success: true
  }

  // Add custom property for the transition
  const customProperties = {
    ...properties,
    from_platform: fromPlatform,
    to_platform: toPlatform
  }

  try {
    track('platform_toggle', customProperties)
  } catch (error) {
    // Fail silently to not affect user experience
    console.warn('Analytics tracking failed for platform_toggle:', error)
  }
}

/**
 * Generic analytics event tracker for custom events
 * @param eventType - The type of analytics event
 * @param properties - Event properties and metadata
 */
export function trackAnalyticsEvent(
  eventType: AnalyticsEventType,
  properties: AnalyticsEventProperties
): void {
  try {
    track(eventType, properties)
  } catch (error) {
    // Fail silently to not affect user experience
    console.warn(`Analytics tracking failed for ${eventType}:`, error)
  }
}

/**
 * Track user engagement metrics
 * @param action - The engagement action (e.g., 'page_view', 'session_start')
 * @param metadata - Additional metadata for the engagement event
 */
export function trackUserEngagement(
  action: string,
  metadata?: Record<string, any>
): void {
  try {
    track('user_engagement', {
      action,
      timestamp: new Date().toISOString(),
      ...metadata
    })
  } catch (error) {
    // Fail silently to not affect user experience
    console.warn('Analytics tracking failed for user_engagement:', error)
  }
}

/**
 * Track conversion events for business metrics
 * @param conversionType - Type of conversion (e.g., 'formula_success', 'copy_success')
 * @param value - Optional value associated with the conversion
 * @param metadata - Additional conversion metadata
 */
export function trackConversion(
  conversionType: string,
  value?: number,
  metadata?: Record<string, any>
): void {
  try {
    track('conversion', {
      conversion_type: conversionType,
      ...(value && { value }),
      timestamp: new Date().toISOString(),
      ...metadata
    })
  } catch (error) {
    // Fail silently to not affect user experience
    console.warn('Analytics tracking failed for conversion:', error)
  }
}

/**
 * Initialize analytics tracking for the session
 * This should be called when the app loads
 */
export function initializeAnalytics(): void {
  try {
    // Track session start
    trackUserEngagement('session_start', {
      user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.warn('Analytics initialization failed:', error)
  }
}

/**
 * Utility function to safely get input length for analytics
 * @param input - The input string to measure
 * @returns The length of the input, or 0 if invalid
 */
export function getInputLength(input: string | null | undefined): number {
  return input?.length || 0
}

/**
 * Utility function to measure processing time
 * @returns A function that when called returns the elapsed time in milliseconds
 */
export function createProcessingTimer(): () => number {
  const startTime = Date.now()
  return () => Date.now() - startTime
}