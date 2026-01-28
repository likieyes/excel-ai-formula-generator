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
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-excel-green transition-colors font-medium"
            >
              Home
            </Link>
            <Link 
              href="/blog" 
              className="text-gray-700 hover:text-excel-green transition-colors font-medium"
            >
              Blog
            </Link>
            <Link 
              href="#examples" 
              className="text-gray-700 hover:text-excel-green transition-colors font-medium"
            >
              Examples
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

        {/* Mobile Navigation */}
        <nav className="md:hidden mt-4 flex items-center justify-center space-x-6">
          <Link 
            href="/" 
            className="text-gray-700 hover:text-excel-green transition-colors font-medium"
          >
            Home
          </Link>
          <Link 
            href="/blog" 
            className="text-gray-700 hover:text-excel-green transition-colors font-medium"
          >
            Blog
          </Link>
          <Link 
            href="#examples" 
            className="text-gray-700 hover:text-excel-green transition-colors font-medium"
          >
            Examples
          </Link>
        </nav>
      </div>
    </header>
  )
}