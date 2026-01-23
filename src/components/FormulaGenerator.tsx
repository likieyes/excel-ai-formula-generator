'use client'

import { useState, useCallback, memo } from 'react'
import { Platform, QuickFillTag } from '@/types'
import { trackPlatformToggle } from '@/lib/analytics'

interface FormulaGeneratorProps {
  onGenerate: (input: string, platform: Platform) => void
  isLoading: boolean
}

// Quick-fill tags for common formula types
const QUICK_FILL_TAGS: QuickFillTag[] = [
  {
    id: 'vlookup',
    label: 'VLOOKUP',
    example: 'Find the price for a product ID from a price list table',
    category: 'lookup'
  },
  {
    id: 'if-statement',
    label: 'IF Statement',
    example: 'If the score is greater than 80, show "Pass", otherwise show "Fail"',
    category: 'logical'
  },
  {
    id: 'extract-email',
    label: 'Extract Email',
    example: 'Extract email addresses from a text string containing contact information',
    category: 'text'
  }
]

// Memoized platform tab component for better performance
const PlatformTab = memo(({ 
  platform, 
  isSelected, 
  onClick, 
  children 
}: { 
  platform: Platform
  isSelected: boolean
  onClick: (platform: Platform) => void
  children: React.ReactNode
}) => (
  <button
    onClick={() => onClick(platform)}
    className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors transform-gpu ${
      isSelected
        ? 'border-excel-green text-excel-green bg-green-50'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`}
    data-testid={`${platform}-tab`}
    aria-selected={isSelected}
    role="tab"
  >
    {children}
  </button>
))

PlatformTab.displayName = 'PlatformTab'

// Memoized quick-fill tag component
const QuickFillTagButton = memo(({ 
  tag, 
  onClick 
}: { 
  tag: QuickFillTag
  onClick: (tag: QuickFillTag) => void
}) => (
  <button
    onClick={() => onClick(tag)}
    className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors border border-gray-300 transform-gpu hover:scale-105"
    data-testid={`quick-fill-${tag.id}`}
    type="button"
  >
    {tag.label}
  </button>
))

QuickFillTagButton.displayName = 'QuickFillTagButton'

function FormulaGenerator({ onGenerate, isLoading }: FormulaGeneratorProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('excel')
  const [inputText, setInputText] = useState('')

  const handlePlatformChange = useCallback((platform: Platform) => {
    const previousPlatform = selectedPlatform
    setSelectedPlatform(platform)
    
    // Track platform toggle analytics
    if (previousPlatform !== platform) {
      trackPlatformToggle(previousPlatform, platform)
    }
  }, [selectedPlatform])

  const handleQuickFillClick = useCallback((tag: QuickFillTag) => {
    setInputText(tag.example)
  }, [])

  const handleGenerate = useCallback(() => {
    if (inputText.trim()) {
      onGenerate(inputText, selectedPlatform)
    }
  }, [inputText, selectedPlatform, onGenerate])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value)
  }, [])

  const isGenerateDisabled = !inputText.trim() || isLoading

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      {/* Platform Selector Tabs */}
      <div className="mb-6">
        <div className="flex border-b border-gray-200" role="tablist">
          <PlatformTab
            platform="excel"
            isSelected={selectedPlatform === 'excel'}
            onClick={handlePlatformChange}
          >
            Excel
          </PlatformTab>
          <PlatformTab
            platform="google-sheets"
            isSelected={selectedPlatform === 'google-sheets'}
            onClick={handlePlatformChange}
          >
            Google Sheets
          </PlatformTab>
        </div>
      </div>

      {/* Input Area */}
      <div className="mb-6">
        <label htmlFor="formula-input" className="block text-sm font-medium text-gray-700 mb-2">
          Describe what you want to calculate:
        </label>
        <textarea
          id="formula-input"
          value={inputText}
          onChange={handleInputChange}
          placeholder="e.g., Calculate the difference between Date A and Date B, excluding weekends..."
          className="w-full h-32 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-excel-green focus:border-transparent resize-none text-gray-900 placeholder-gray-500 focus-visible-ring"
          data-testid="formula-input"
          aria-describedby="input-help"
        />
        <div id="input-help" className="sr-only">
          Describe your formula requirements in plain English
        </div>
      </div>

      {/* Quick-Fill Tags */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-3">Quick examples:</p>
        <div className="flex flex-wrap gap-2">
          {QUICK_FILL_TAGS.map((tag) => (
            <QuickFillTagButton
              key={tag.id}
              tag={tag}
              onClick={handleQuickFillClick}
            />
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerateDisabled}
        className={`w-full py-4 px-6 text-white font-semibold text-lg rounded-md transition-all duration-200 transform-gpu focus-visible-ring ${
          isGenerateDisabled
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-excel-green hover:bg-excel-green-dark shadow-lg hover:shadow-xl hover:-translate-y-0.5'
        }`}
        data-testid="generate-button"
        type="button"
        aria-describedby="generate-help"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" aria-hidden="true"></div>
            <span>Generating...</span>
          </div>
        ) : (
          'Generate Formula ✨'
        )}
      </button>
      <div id="generate-help" className="sr-only">
        Click to generate a formula based on your description
      </div>
    </div>
  )
}

export default memo(FormulaGenerator)