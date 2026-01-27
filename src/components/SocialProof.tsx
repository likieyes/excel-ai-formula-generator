'use client'

import React from 'react'

const stats = [
  {
    number: '10,000+',
    label: 'Formulas Generated',
    icon: '⚡'
  },
  {
    number: '5,000+',
    label: 'Happy Users',
    icon: '👥'
  },
  {
    number: '99.9%',
    label: 'Success Rate',
    icon: '✅'
  },
  {
    number: '< 3s',
    label: 'Average Response Time',
    icon: '🚀'
  }
]

const testimonials = [
  {
    text: "This tool saved me hours of searching for the right Excel formula. Amazing!",
    author: "Sarah M.",
    role: "Data Analyst"
  },
  {
    text: "Finally, I can create complex formulas without memorizing syntax. Game changer!",
    author: "Mike R.",
    role: "Financial Manager"
  },
  {
    text: "Perfect for both Excel and Google Sheets. The AI understands exactly what I need.",
    author: "Lisa K.",
    role: "Project Manager"
  }
]

export default function SocialProof() {
  return (
    <section className="w-full py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Stats Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Thousands of Users
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Join the community of professionals who save time with AI-powered formulas
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold text-excel-green mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
            What Our Users Say
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="text-gray-700 mb-4 italic">
                  &ldquo;{testimonial.text}&rdquo;
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-excel-green rounded-full flex items-center justify-center text-white font-bold mr-3">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}