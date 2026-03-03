import Link from 'next/link'

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-excel-green rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">
              AI Excel Formula
            </h1>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-excel-green transition-colors font-medium border-b-2 border-transparent hover:border-excel-green py-1"
            >
              Home
            </Link>
            <Link
              href="/formulas"
              className="text-gray-700 hover:text-excel-green transition-colors font-medium border-b-2 border-transparent hover:border-excel-green py-1"
            >
              Formulas
            </Link>
            <Link
              href="/formula-explainer"
              className="text-gray-700 hover:text-excel-green transition-colors font-medium border-b-2 border-transparent hover:border-excel-green py-1"
            >
              Explainer
            </Link>
            <Link
              href="/blog"
              className="text-gray-700 hover:text-excel-green transition-colors font-medium border-b-2 border-transparent hover:border-excel-green py-1"
            >
              Blog
            </Link>
          </nav>

          {/* Trust Badge */}
          <div className="flex items-center">
            <div className="bg-green-50 text-excel-green px-3 py-1 rounded-full text-sm font-medium border border-green-200">
              <span className="mr-1">✅</span>
              No Signup Required
            </div>
          </div>
        </div>

        {/* Mobile Navigation - Scrollable on small screens */}
        <nav className="lg:hidden mt-4 overflow-x-auto no-scrollbar border-t pt-4">
          <div className="flex items-center justify-between min-w-max space-x-6 px-2 text-sm">
            <Link href="/" className="text-gray-700 font-medium">Home</Link>
            <Link href="/formulas" className="text-gray-700 font-medium whitespace-nowrap">Formulas</Link>
            <Link href="/formula-explainer" className="text-gray-700 font-medium whitespace-nowrap">Explainer</Link>
            <Link href="/blog" className="text-gray-700 font-medium">Blog</Link>
          </div>
        </nav>
      </div>
    </header>
  )
}