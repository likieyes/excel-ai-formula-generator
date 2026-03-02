import { Metadata } from 'next'
import Link from 'next/link'
import { getPublishedFormulas, getCategories } from '@/lib/formulas-data'

export const metadata: Metadata = {
  title: 'Excel Formula Library - Ready-to-Use Solutions | AI Excel Formula',
  description: 'Browse our comprehensive library of Excel formulas with step-by-step explanations. Find solutions for data analysis, text processing, and more.',
  keywords: ['excel formulas', 'formula library', 'excel solutions', 'spreadsheet formulas'],
  alternates: {
    canonical: 'https://www.aiexcelformula.com/formulas',
  },
  openGraph: {
    title: 'Excel Formula Library - Ready-to-Use Solutions',
    description: 'Browse our comprehensive library of Excel formulas with step-by-step explanations.',
    url: 'https://www.aiexcelformula.com/formulas',
  },
}

export default function FormulasPage() {
  const formulas = getPublishedFormulas()
  const categories = getCategories()

  // Group formulas by category
  const formulasByCategory = categories.reduce((acc, category) => {
    acc[category] = formulas.filter(formula => formula.category === category)
    return acc
  }, {} as Record<string, typeof formulas>)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'Advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Excel Formula Library
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Ready-to-use Excel formulas with step-by-step explanations.
              Copy, paste, and customize for your needs.
            </p>
            <div className="bg-excel-green/10 border border-excel-green/20 rounded-lg p-4">
              <p className="text-excel-green font-medium">
                💡 Need a custom formula? Try our{' '}
                <Link href="/" className="underline hover:no-underline">
                  AI Formula Generator
                </Link>{' '}
                for instant solutions!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-excel-green mb-2">
                {formulas.length}
              </div>
              <div className="text-gray-600">Ready-to-Use Formulas</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-excel-green mb-2">
                {categories.length}
              </div>
              <div className="text-gray-600">Categories</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-excel-green mb-2">
                100%
              </div>
              <div className="text-gray-600">Free & No Signup</div>
            </div>
          </div>

          {/* Categories */}
          {Object.entries(formulasByCategory).map(([category, categoryFormulas]) => (
            <div key={category} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categoryFormulas.map((formula) => (
                  <Link
                    key={formula.slug}
                    href={`/formulas/${formula.slug}`}
                    className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200 hover:border-excel-green/30"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
                        {formula.title}
                      </h3>
                      <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getDifficultyColor(formula.difficulty)}`}>
                        {formula.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {formula.question}
                    </p>
                    <div className="bg-gray-50 rounded p-3 mb-4">
                      <code className="text-sm text-gray-800 font-mono break-all">
                        {formula.formula.length > 60
                          ? `${formula.formula.substring(0, 60)}...`
                          : formula.formula
                        }
                      </code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-excel-green font-medium text-sm">
                        View Solution →
                      </span>
                      <span className="text-xs text-gray-500">
                        {formula.explanation.length} steps
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* CTA Section */}
          <div className="bg-excel-green rounded-lg p-8 text-center text-white mt-12">
            <h2 className="text-2xl font-bold mb-4">
              Need a Custom Formula?
            </h2>
            <p className="text-excel-green-light mb-6 max-w-2xl mx-auto">
              Can&apos;t find what you&apos;re looking for? Our AI-powered formula generator
              can create custom Excel formulas based on your specific needs.
            </p>
            <Link
              href="/"
              className="inline-block bg-white text-excel-green px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Try AI Formula Generator
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}