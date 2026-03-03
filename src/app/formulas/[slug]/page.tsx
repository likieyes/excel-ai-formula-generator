import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPublishedFormulas } from '@/lib/formulas-data'
import { FormulaItem } from '@/types'
import CopyButton from '@/components/CopyButton'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface Props {
  params: { slug: string }
}

// Generate static params for all published formulas
export async function generateStaticParams() {
  const formulas = getPublishedFormulas()
  return formulas.map((formula) => ({
    slug: formula.slug,
  }))
}

// Generate metadata for each formula page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const formulas = getPublishedFormulas()
  const formula = formulas.find((f) => f.slug === params.slug)

  if (!formula) {
    return {
      title: 'Formula Not Found | AI Excel Formula',
    }
  }

  return {
    title: `${formula.title} | AI Excel Formula`,
    description: formula.description,
    keywords: [
      'excel formula',
      formula.category.toLowerCase(),
      formula.difficulty.toLowerCase(),
      'excel solution',
      'spreadsheet formula'
    ],
    alternates: {
      canonical: `https://www.aiexcelformula.com/formulas/${formula.slug}`,
    },
    openGraph: {
      title: formula.title,
      description: formula.description,
      url: `https://www.aiexcelformula.com/formulas/${formula.slug}`,
    },
  }
}

export default function FormulaDetailPage({ params }: Props) {
  const formulas = getPublishedFormulas()
  const formula = formulas.find((f) => f.slug === params.slug)

  if (!formula) {
    notFound()
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 border-green-200'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Advanced': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Get related formulas from the same category
  const relatedFormulas = formulas
    .filter(f => f.category === formula.category && f.slug !== formula.slug)
    .slice(0, 3)

  return (
    <>
      {/* HowTo Structured Data for Google rich snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: formula.title,
            description: formula.description,
            step: formula.explanation.map((step, index) => ({
              '@type': 'HowToStep',
              position: index + 1,
              text: step,
            })),
            tool: {
              '@type': 'HowToTool',
              name: 'Microsoft Excel or Google Sheets',
            },
          }),
        }}
      />
      {/* Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://www.aiexcelformula.com',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Formula Library',
                item: 'https://www.aiexcelformula.com/formulas',
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: formula.title,
                item: `https://www.aiexcelformula.com/formulas/${formula.slug}`,
              },
            ],
          }),
        }}
      />
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        {/* Breadcrumbs */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-excel-green">Home</Link>
              <span>→</span>
              <Link href="/formulas" className="hover:text-excel-green">Formulas</Link>
              <span>→</span>
              <span className="text-gray-900">{formula.title}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Header */}
                <div className="bg-white rounded-lg p-8 shadow-sm mb-8">
                  <div className="flex items-start justify-between mb-4">
                    <h1 className="text-3xl font-bold text-gray-900 flex-1">
                      {formula.title}
                    </h1>
                    <div className="ml-4 flex flex-col items-end space-y-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(formula.difficulty)}`}>
                        {formula.difficulty}
                      </span>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {formula.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-xl text-gray-600 mb-6">
                    {formula.question}
                  </p>
                </div>

                {/* Formula */}
                <div className="bg-white rounded-lg p-8 shadow-sm mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    The Formula
                  </h2>
                  <div className="bg-gray-900 rounded-lg p-6 mb-4">
                    <code className="text-green-400 font-mono text-lg break-all">
                      {formula.formula}
                    </code>
                  </div>
                  <CopyButton
                    text={formula.formula}
                    className="bg-excel-green text-white px-6 py-2 rounded-lg hover:bg-excel-green/90 transition-colors font-medium"
                  >
                    📋 Copy Formula
                  </CopyButton>
                </div>

                {/* Explanation */}
                <div className="bg-white rounded-lg p-8 shadow-sm mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    How It Works
                  </h2>
                  <div className="space-y-4">
                    {formula.explanation.map((step, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-excel-green text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 flex-1 pt-1">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Usage Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">
                    💡 Pro Tips
                  </h3>
                  <ul className="text-blue-800 space-y-2">
                    <li>• Test the formula with sample data before applying to your entire dataset</li>
                    <li>• Use absolute references ($A$1) when copying formulas to prevent reference errors</li>
                    <li>• Consider error handling with IFERROR() for more robust formulas</li>
                    <li>• Document your formulas with comments for future reference</li>
                  </ul>
                </div>

                {/* Related Formulas */}
                {relatedFormulas.length > 0 && (
                  <div className="bg-white rounded-lg p-8 shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Related Formulas
                    </h2>
                    <div className="grid grid-cols-1 gap-4">
                      {relatedFormulas.map((related) => (
                        <Link
                          key={related.slug}
                          href={`/formulas/${related.slug}`}
                          className="block p-4 border border-gray-200 rounded-lg hover:border-excel-green/30 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-1">
                                {related.title}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {related.question}
                              </p>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(related.difficulty)}`}>
                              {related.difficulty}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                {/* CTA Widget */}
                <div className="bg-excel-green rounded-lg p-6 text-white mb-6 sticky top-6">
                  <h3 className="text-xl font-bold mb-3">
                    Need a Custom Formula?
                  </h3>
                  <p className="text-excel-green-light mb-4 text-sm">
                    Can&apos;t find exactly what you need? Our AI can generate custom Excel formulas based on your specific requirements.
                  </p>
                  <Link
                    href="/"
                    className="block w-full bg-white text-excel-green text-center py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Try AI Generator
                  </Link>
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Formula Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Difficulty:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(formula.difficulty)}`}>
                        {formula.difficulty}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium">{formula.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Steps:</span>
                      <span className="font-medium">{formula.explanation.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}