/**
 * Google Analytics 4 (GA4) integration for Excel AI Formula Generator
 * Provides comprehensive user behavior tracking and conversion analytics
 */

// Google Analytics Measurement ID - hardcoded for immediate testing
export const GA_MEASUREMENT_ID = 'G-F4PGJV6XDF'

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date | Record<string, any>,
      config?: Record<string, any>
    ) => void
  }
}

/**
 * Initialize Google Analytics
 * @param measurementId - GA4 Measurement ID
 */
export function initGA(measurementId: string): void {
  if (typeof window !== 'undefined' && measurementId) {
    window.gtag('config', measurementId, {
      page_title: document.title,
      page_location: window.location.href,
    })
  }
}

/**
 * Track page views in GA4
 * @param url - The page URL
 * @param title - The page title
 */
export function trackPageView(url: string, title?: string): void {
  if (typeof window !== 'undefined' && GA_MEASUREMENT_ID) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_title: title || document.title,
      page_location: url,
    })
  }
}

/**
 * Track custom events in GA4
 * @param eventName - Name of the event
 * @param parameters - Event parameters
 */
export function trackEvent(
  eventName: string, 
  parameters: Record<string, any> = {}
): void {
  if (typeof window !== 'undefined' && GA_MEASUREMENT_ID) {
    window.gtag('event', eventName, {
      ...parameters,
      send_to: GA_MEASUREMENT_ID,
    })
  }
}

/**
 * Track formula generation events for GA4
 * @param platform - Excel or Google Sheets
 * @param success - Whether generation was successful
 * @param inputLength - Length of user input
 * @param processingTime - Time taken to generate
 */
export function trackFormulaGeneration(
  platform: string,
  success: boolean,
  inputLength: number,
  processingTime?: number
): void {
  trackEvent('formula_generated', {
    event_category: 'Formula Generation',
    event_label: platform,
    value: success ? 1 : 0,
    custom_parameter_1: inputLength,
    custom_parameter_2: processingTime || 0,
    success: success,
    platform: platform,
  })
}

/**
 * Track formula copy events for GA4
 * @param platform - Excel or Google Sheets
 * @param formulaType - Type of formula copied
 */
export function trackFormulaCopy(
  platform: string,
  formulaType?: string
): void {
  trackEvent('formula_copied', {
    event_category: 'User Engagement',
    event_label: platform,
    value: 1,
    platform: platform,
    formula_type: formulaType || 'unknown',
  })
}

/**
 * Track platform switching for GA4
 * @param fromPlatform - Previous platform
 * @param toPlatform - New platform
 */
export function trackPlatformSwitch(
  fromPlatform: string,
  toPlatform: string
): void {
  trackEvent('platform_switch', {
    event_category: 'User Behavior',
    event_label: `${fromPlatform}_to_${toPlatform}`,
    from_platform: fromPlatform,
    to_platform: toPlatform,
  })
}

/**
 * Track conversion events for GA4
 * @param conversionType - Type of conversion
 * @param value - Conversion value
 */
export function trackConversion(
  conversionType: string,
  value: number = 1
): void {
  trackEvent('conversion', {
    event_category: 'Conversions',
    event_label: conversionType,
    value: value,
    conversion_type: conversionType,
  })
}

/**
 * Track user engagement events for GA4
 * @param action - Engagement action
 * @param category - Event category
 * @param label - Event label
 */
export function trackEngagement(
  action: string,
  category: string = 'User Engagement',
  label?: string
): void {
  trackEvent('engagement', {
    event_category: category,
    event_label: label || action,
    engagement_action: action,
  })
}

/**
 * Track errors for GA4
 * @param errorType - Type of error
 * @param errorMessage - Error message
 * @param fatal - Whether error is fatal
 */
export function trackError(
  errorType: string,
  errorMessage: string,
  fatal: boolean = false
): void {
  trackEvent('exception', {
    description: errorMessage,
    fatal: fatal,
    error_type: errorType,
  })
}

/**
 * Set user properties in GA4
 * @param properties - User properties to set
 */
export function setUserProperties(properties: Record<string, any>): void {
  if (typeof window !== 'undefined' && GA_MEASUREMENT_ID) {
    window.gtag('set', properties)
  }
}