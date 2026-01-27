export default function Hero() {
  return (
    <section className="w-full bg-gradient-to-b from-gray-50 to-white py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
        {/* SEO-optimized H1 headline */}
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Free Excel AI Formula Generator
        </h1>
        
        {/* Sub-headline with value proposition */}
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
          Stop memorizing complex syntax. Turn plain English into Excel formulas & Google Sheets scripts instantly.
        </p>

        {/* Key benefits */}
        <div className="flex flex-wrap justify-center items-center gap-6 mb-12 text-gray-700">
          <div className="flex items-center space-x-2">
            <span className="text-excel-green">⚡</span>
            <span className="font-medium">Instant Results</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-excel-green">🔓</span>
            <span className="font-medium">No Login Required</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-excel-green">💯</span>
            <span className="font-medium">100% Free</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-excel-green">🎯</span>
            <span className="font-medium">Excel & Google Sheets</span>
          </div>
        </div>

        {/* Call to action hint with urgency */}
        <div className="text-gray-500 text-lg">
          <p>Describe what you want to calculate in plain English below ↓</p>
          <p className="text-sm mt-2 text-excel-green font-medium">
            ✨ Try it now - No signup required, get results in seconds!
          </p>
        </div>
      </div>
    </section>
  )
}