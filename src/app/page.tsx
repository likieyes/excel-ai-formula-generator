'use client'

import { useState, useEffect, lazy, Suspense } from 'react'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import FormulaGenerator from '@/components/FormulaGenerator'
import ResultDisplay from '@/components/ResultDisplay'
import ErrorBoundary from '@/components/ErrorBoundary'
import ErrorDisplay from '@/components/ErrorDisplay'
import { Platform, GenerateFormulaRequest, GenerateFormulaResponse, AppError } from '@/types'
import { 
  trackFormulaGenerated, 
  initializeAnalytics, 
  createProcessingTimer,
  getInputLength,
  trackExampleClick
} from '@/lib/analytics'
import {
  createAppError,
  categorizeError,
  getUserFriendlyErrorMessage,
  logError,
  RetryManager,
  StatePreserver,
  isAIErrorResponse
} from '@/lib/errorHandling'

// Lazy load non-critical components for better performance
const FeatureGrid = lazy(() => import('@/components/FeatureGrid'))
const FAQ = lazy(() => import('@/components/FAQ'))
const Examples = lazy(() => import('@/components/Examples'))
const SocialProof = lazy(() => import('@/components/SocialProof'))
const Footer = lazy(() => import('@/components/Footer'))

// Loading component for lazy-loaded sections
function SectionSkeleton() {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-8"></div>
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [currentResult, setCurrentResult] = useState<{
    formula: string
    explanation: string
  } | null>(null)
  const [error, setError] = useState<AppError | null>(null)
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('excel')
  const [inputText, setInputText] = useState('')
  
  const retryManager = new RetryManager()

  // Initialize analytics and restore state on component mount
  useEffect(() => {
    initializeAnalytics()
    
    // Restore preserved state if available
    const preservedState = StatePreserver.restoreState()
    if (preservedState) {
      setInputText(preservedState.inputText)
      setSelectedPlatform(preservedState.selectedPlatform as Platform)
      StatePreserver.clearState() // Clear after restoration
    }
  }, [])

  // Preserve state when there's an error
  useEffect(() => {
    if (error && inputText) {
      StatePreserver.preserveState({
        inputText,
        selectedPlatform,
        timestamp: Date.now()
      })
    }
  }, [error, inputText, selectedPlatform])

  const handleGenerate = async (input: string, platform: Platform) => {
    setIsLoading(true)
    setError(null)
    setCurrentResult(null)
    setSelectedPlatform(platform)
    setInputText(input)

    const timer = createProcessingTimer()
    const inputLength = getInputLength(input)

    try {
      const result = await retryManager.executeWithRetry(async () => {
        const requestBody: GenerateFormulaRequest = {
          input: input.trim(),
          platform
        }

        const response = await fetch('/api/generate-formula', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          const error = new Error(errorData.error || `HTTP ${response.status}`)
          ;(error as any).status = response.status
          throw error
        }

        return response.json()
      })

      const data: GenerateFormulaResponse = result
      const processingTime = timer()

      if (data.success && data.data) {
        // Check if AI response indicates an error (non-spreadsheet content)
        if (isAIErrorResponse(data.data.explanation)) {
          const appError = createAppError(
            'validation_error',
            data.data.explanation,
            'AI detected non-spreadsheet content'
          )
          setError(appError)
          logError(appError, { context: 'ai_content_validation', input: input.substring(0, 100) })
          
          trackFormulaGenerated(
            platform,
            inputLength,
            false,
            processingTime,
            'validation_error'
          )
          return
        }

        // Success - show result and track analytics
        setCurrentResult({
          formula: data.data.formula,
          explanation: data.data.explanation
        })

        // Clear preserved state on success
        StatePreserver.clearState()

        trackFormulaGenerated(
          platform,
          inputLength,
          true,
          processingTime
        )
      } else {
        // Error from API
        const errorType = categorizeError({ status: 400 })
        const appError = createAppError(
          errorType,
          data.error || 'Failed to generate formula',
          JSON.stringify(data)
        )
        setError(appError)
        logError(appError, { context: 'api_response', input: input.substring(0, 100) })

        trackFormulaGenerated(
          platform,
          inputLength,
          false,
          timer(),
          'api_error'
        )
      }
    } catch (networkError: any) {
      // Categorize and handle the error
      const errorType = categorizeError(networkError)
      const userMessage = getUserFriendlyErrorMessage(networkError, 'generation')
      
      const appError = createAppError(
        errorType,
        userMessage,
        networkError.message || 'Unknown error'
      )
      
      setError(appError)
      logError(appError, { 
        context: 'network_request', 
        input: input.substring(0, 100),
        status: networkError.status 
      })

      const processingTime = timer()
      trackFormulaGenerated(
        platform,
        inputLength,
        false,
        processingTime,
        errorType
      )
    } finally {
      setIsLoading(false)
      retryManager.reset()
    }
  }

  const handleCopy = () => {
    // Copy callback - analytics tracking is handled in ResultDisplay component
    console.log('Formula copied to clipboard')
  }

  const handleRetry = () => {
    if (inputText) {
      handleGenerate(inputText, selectedPlatform)
    }
  }

  const handleErrorDismiss = () => {
    setError(null)
  }

  const handleExampleClick = (input: string, platform: Platform) => {
    // Track example click analytics
    const exampleId = input.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 20)
    trackExampleClick(exampleId, platform)
    
    // Scroll to the generator section
    const generatorElement = document.querySelector('#formula-generator')
    if (generatorElement) {
      generatorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    
    // Set the input and platform, then generate
    setInputText(input)
    setSelectedPlatform(platform)
    
    // Small delay to allow UI to update before generating
    setTimeout(() => {
      handleGenerate(input, platform)
    }, 500)
  }

  const handleComponentError = (error: Error, errorInfo: React.ErrorInfo) => {
    const appError = createAppError(
      'ai_service_error',
      'A component error occurred. Please refresh the page.',
      `${error.message}\n${errorInfo.componentStack}`
    )
    logError(appError, { context: 'component_error' })
  }

  return (
    <ErrorBoundary onError={handleComponentError}>
      <main className="min-h-screen bg-white">
        <Header />
        <Hero />
        
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <ErrorBoundary 
              onError={handleComponentError}
              fallback={
                <div className="w-full max-w-4xl mx-auto bg-red-50 border border-red-200 rounded-lg p-6">
                  <p className="text-red-800">
                    The formula generator encountered an error. Please refresh the page to continue.
                  </p>
                </div>
              }
            >
              <FormulaGenerator 
                onGenerate={handleGenerate}
                isLoading={isLoading}
              />
            </ErrorBoundary>

            {/* Error Display */}
            <ErrorDisplay
              error={error}
              onRetry={handleRetry}
              onDismiss={handleErrorDismiss}
              showRetryButton={!!inputText}
            />

            {/* Result Display */}
            <ErrorBoundary 
              onError={handleComponentError}
              fallback={
                <div className="w-full max-w-4xl mx-auto mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800">
                    Unable to display results. Your formula was generated successfully - please try refreshing the page.
                  </p>
                </div>
              }
            >
              <ResultDisplay
                formula={currentResult?.formula || null}
                explanation={currentResult?.explanation || null}
                isVisible={!!currentResult}
                onCopy={handleCopy}
                platform={selectedPlatform}
              />
            </ErrorBoundary>
          </div>
        </div>
        
        {/* SEO Content Sections - Lazy loaded for better performance */}
        <Suspense fallback={<SectionSkeleton />}>
          <Examples onExampleClick={handleExampleClick} />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton />}>
          <SocialProof />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton />}>
          <FeatureGrid />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton />}>
          <FAQ />
        </Suspense>
        
        {/* Footer */}
        <Suspense fallback={<SectionSkeleton />}>
          <Footer />
        </Suspense>
      </main>
    </ErrorBoundary>
  )
}