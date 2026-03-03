import React from 'react'
import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Information */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-excel-green rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <h3 className="text-xl font-bold">AI Excel Formula</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Free AI-powered Excel formula generator that makes complex spreadsheet operations simple. Supports Excel and Google Sheets.
            </p>
            <div className="mt-4">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span className="text-excel-green">✨</span>
                <span>Powered by ZhipuAI</span>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-white transition-colors cursor-pointer">
                AI Formula Generation
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                Excel Support
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                Google Sheets Support
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                Natural Language Input
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                Quick Fill Examples
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                One-Click Copy
              </li>
            </ul>
          </div>

          {/* Popular Formulas */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Popular Formulas</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-white transition-colors cursor-pointer">
                SUM Functions
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                VLOOKUP Searches
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                IF Conditions
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                AVERAGE Calculations
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                COUNTIF Counting
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                INDEX/MATCH Advanced
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-lg font-semibold mb-4">About</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/guide" className="hover:text-white transition-colors">
                  User Guide
                </Link>
              </li>
              <li>
                <Link href="/formulas" className="hover:text-white transition-colors">
                  Formula Examples
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © {currentYear} AI Excel Formula. All rights reserved.
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Service Online</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🚀</span>
                <span>Free to Use</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🔒</span>
                <span>Data Secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}