'use client'

import { useState, useCallback, memo } from 'react'
import { Copy, Check, ThumbsUp, ThumbsDown } from 'lucide-react'
import { ResultDisplayProps, Platform } from '@/types'
import { trackFormulaCopied } from '@/lib/analytics'

// Memoized copy button component
const CopyButton = memo(({
  copySuccess,
  onClick
}: {
  copySuccess: boolean
  onClick: () => void
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 transform-gpu focus-visible-ring ${copySuccess
        ? 'bg-green-100 text-green-700 border border-green-300'
        : 'bg-excel-green text-white hover:bg-excel-green-dark shadow-md hover:shadow-lg hover:scale-105'
      }`}
    data-testid="copy-button"
    type="button"
    aria-label={copySuccess ? 'Formula copied' : 'Copy formula to clipboard'}
  >
    {copySuccess ? (
      <>
        <Check size={16} aria-hidden="true" />
        Copied!
      </>
    ) : (
      <>
        <Copy size={16} aria-hidden="true" />
        Copy
      </>
    )}
  </button>
))

CopyButton.displayName = 'CopyButton'

// Memoized feedback button component
const FeedbackButton = memo(({
  type,
  isActive,
  onClick
}: {
  type: 'up' | 'down'
  isActive: boolean
  onClick: (type: 'up' | 'down') => void
}) => {
  const Icon = type === 'up' ? ThumbsUp : ThumbsDown
  const activeColor = type === 'up' ? 'green' : 'red'

  return (
    <button
      onClick={() => onClick(type)}
      className={`p-2 rounded-md transition-colors transform-gpu hover:scale-110 focus-visible-ring ${isActive
          ? `bg-${activeColor}-100 text-${activeColor}-600`
          : `text-gray-400 hover:text-${activeColor}-600 hover:bg-${activeColor}-50`
        }`}
      data-testid={`thumbs-${type}-button`}
      aria-label={`This was ${type === 'up' ? '' : 'not '}helpful`}
      type="button"
    >
      <Icon size={16} aria-hidden="true" />
    </button>
  )
})

FeedbackButton.displayName = 'FeedbackButton'

// Memoized toast notification
const CopyToast = memo(({ show }: { show: boolean }) => {
  if (!show) return null

  return (
    <div
      className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg z-50 animate-fade-in transform-gpu"
      data-testid="copy-toast"
      role="alert"
      aria-live="polite"
    >
      Formula copied to clipboard!
    </div>
  )
})

CopyToast.displayName = 'CopyToast'

function ResultDisplay({
  formula,
  explanation,
  isVisible,
  onCopy,
  platform,
  task = 'formula'
}: ResultDisplayProps & { platform?: Platform, task?: string }) {
  const [copySuccess, setCopySuccess] = useState(false)
  const [feedbackGiven, setFeedbackGiven] = useState<'up' | 'down' | null>(null)

  const handleCopyClick = useCallback(async () => {
    if (!formula) return

    try {
      await navigator.clipboard.writeText(formula)
      setCopySuccess(true)
      onCopy?.()

      // Track copy analytics
      if (platform) {
        trackFormulaCopied(platform, formula.length)
      }

      // Reset copy success state after 2 seconds
      setTimeout(() => {
        setCopySuccess(false)
      }, 2000)
    } catch (error) {
      console.error('Failed to copy formula:', error)

      // Fallback: Try to select the text for manual copying
      try {
        const codeElement = document.querySelector('[data-testid="formula-code"]')
        if (codeElement) {
          const range = document.createRange()
          range.selectNodeContents(codeElement)
          const selection = window.getSelection()
          selection?.removeAllRanges()
          selection?.addRange(range)
        }
      } catch (fallbackError) {
        console.error('Fallback copy method also failed:', fallbackError)
      }

      setCopySuccess(false)
    }
  }, [formula, onCopy, platform])

  const handleFeedback = useCallback((type: 'up' | 'down') => {
    setFeedbackGiven(type)
    // TODO: Implement analytics tracking for feedback
  }, [])

  if (!isVisible || !formula) {
    return null
  }

  return (
    <>
      <div className="w-full max-w-4xl mx-auto mt-6 bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        {/* Formula Display with Code Block Styling */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">
              {task === 'explain' ? 'Formula Breakdown' : task === 'vba' ? 'Generated Script' : 'Generated Formula'}
            </h3>
            <div className="flex items-center gap-2">
              <CopyButton copySuccess={copySuccess} onClick={handleCopyClick} />
            </div>
          </div>

          {/* Code Block for Formula */}
          <div className="relative">
            <pre className="bg-gray-100 border border-gray-300 rounded-md p-4 overflow-x-auto">
              <code
                className="text-sm font-mono text-gray-900 whitespace-pre-wrap break-all"
                data-testid="formula-code"
              >
                {formula}
              </code>
            </pre>
            {!copySuccess && (
              <div className="absolute top-2 right-2 bg-excel-green text-white text-xs px-2 py-1 rounded animate-pulse">
                👆 Click Copy to use this formula
              </div>
            )}
          </div>
        </div>

        {/* Explanation Display */}
        {explanation && (
          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-900 mb-2">How it works</h4>
            <div
              className="text-gray-700 leading-relaxed whitespace-pre-wrap space-y-2"
              data-testid="formula-explanation"
            >
              {explanation}
            </div>
          </div>
        )}

        {/* Feedback Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <span className="text-sm text-gray-600">Was this helpful?</span>
          <div className="flex items-center gap-2">
            <FeedbackButton
              type="up"
              isActive={feedbackGiven === 'up'}
              onClick={handleFeedback}
            />
            <FeedbackButton
              type="down"
              isActive={feedbackGiven === 'down'}
              onClick={handleFeedback}
            />
          </div>
        </div>
      </div>

      {/* Toast Notification for Copy Success */}
      <CopyToast show={copySuccess} />
    </>
  )
}

export default memo(ResultDisplay)