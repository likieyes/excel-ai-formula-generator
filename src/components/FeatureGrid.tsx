import { Zap, Brain, CreditCard } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: "Instant Results",
    description: "Powered by AI",
    details: "Get Excel and Google Sheets formulas instantly. No waiting, no delays - just fast, accurate results powered by advanced AI technology."
  },
  {
    icon: Brain,
    title: "Complex Logic",
    description: "Handles nested IFs and VLOOKUPs",
    details: "From simple SUM functions to complex nested IF statements and VLOOKUP formulas. Our AI understands advanced spreadsheet logic and syntax."
  },
  {
    icon: CreditCard,
    title: "100% Free",
    description: "No credit card needed",
    details: "Completely free to use with unlimited formula generation. No signup required, no hidden fees, no credit card needed. Just pure functionality."
  }
]

export default function FeatureGrid() {
  return (
    <section className="py-16 bg-gray-50" aria-labelledby="features-heading">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 id="features-heading" className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Excel AI Formula Generator?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The most powerful and user-friendly way to generate Excel and Google Sheets formulas using natural language.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div 
                  key={index}
                  className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-green-100 p-3 rounded-lg mr-4">
                      <IconComponent className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-green-600 font-medium">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.details}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}