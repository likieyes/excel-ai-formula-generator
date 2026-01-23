'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const faqData = [
  {
    question: "Is this Excel formula generator free?",
    answer: "Yes, our Excel AI formula generator is completely free with unlimited access. You can generate as many formulas as you need without any cost, signup, or credit card requirement."
  },
  {
    question: "Does it work on Mac?",
    answer: "Yes, our formula generator works perfectly on Mac, Windows, and all operating systems. It supports all Excel versions including Excel for Mac, Excel Online, and Excel 365."
  },
  {
    question: "Can it write Google Sheets Query functions?",
    answer: "Yes, simply switch the platform tab to Google Sheets and our AI will generate Google Sheets-specific formulas including QUERY functions, ARRAYFORMULA, and other Google Sheets syntax."
  },
  {
    question: "What types of Excel formulas can it generate?",
    answer: "Our AI can generate all types of Excel formulas including VLOOKUP, HLOOKUP, INDEX MATCH, nested IF statements, SUMIF, COUNTIF, pivot table formulas, array formulas, and complex multi-condition logic."
  },
  {
    question: "How accurate are the generated formulas?",
    answer: "Our AI is trained on extensive Excel documentation and real-world formula patterns. The formulas are highly accurate, but we always recommend testing them with your specific data to ensure they meet your exact requirements."
  },
  {
    question: "Can I use this for Google Sheets formulas?",
    answer: "Absolutely! Switch to the Google Sheets tab and describe what you need. Our AI understands the differences between Excel and Google Sheets syntax and will generate the appropriate formula for your chosen platform."
  }
]

interface FAQItemProps {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className="border border-gray-200 rounded-lg mb-4">
      <button
        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-inset"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <h3 className="text-lg font-medium text-gray-900 pr-4">
          {question}
        </h3>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
        )}
      </button>
      
      {isOpen && (
        <div className="px-6 pb-4">
          <p className="text-gray-600 leading-relaxed">
            {answer}
          </p>
        </div>
      )}
    </div>
  )
}

export default function FAQ() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }

  return (
    <section className="py-16 bg-white" aria-labelledby="faq-heading">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 id="faq-heading" className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about our Excel AI formula generator
            </p>
          </div>
          
          <div className="space-y-0">
            {faqData.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openItems.has(index)}
                onToggle={() => toggleItem(index)}
              />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-600">
              Have more questions? Our Excel AI formula generator is designed to be intuitive and easy to use. 
              Simply describe what you need in plain English and get instant results.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}