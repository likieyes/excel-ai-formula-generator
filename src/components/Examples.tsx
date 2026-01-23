'use client'

import React from 'react'

interface Example {
  id: string
  title: string
  description: string
  input: string
  formula: string
  platform: 'excel' | 'google-sheets'
}

const examples: Example[] = [
  {
    id: 'sum',
    title: 'Sum Calculation',
    description: 'Calculate the total of all values in a specified range',
    input: 'Calculate the sum of A1 to A10',
    formula: '=SUM(A1:A10)',
    platform: 'excel'
  },
  {
    id: 'vlookup',
    title: 'Data Lookup',
    description: 'Find corresponding data from a table',
    input: 'Find the price from a product price list',
    formula: '=VLOOKUP(A2,B:D,3,FALSE)',
    platform: 'excel'
  },
  {
    id: 'if',
    title: 'Conditional Logic',
    description: 'Display different results based on conditions',
    input: 'If score is greater than 80 show Pass, otherwise show Fail',
    formula: '=IF(A1>80,"Pass","Fail")',
    platform: 'excel'
  },
  {
    id: 'average',
    title: 'Average Calculation',
    description: 'Calculate the average value of numbers',
    input: 'Calculate the average of student grades',
    formula: '=AVERAGE(B2:B10)',
    platform: 'excel'
  },
  {
    id: 'countif',
    title: 'Conditional Count',
    description: 'Count cells that meet specific criteria',
    input: 'Count students with scores greater than 90',
    formula: '=COUNTIF(B2:B10,">90")',
    platform: 'excel'
  },
  {
    id: 'query',
    title: 'Google Sheets Query',
    description: 'Use QUERY function for data filtering',
    input: 'Query records with sales greater than 1000',
    formula: '=QUERY(A:C,"SELECT * WHERE C > 1000")',
    platform: 'google-sheets'
  }
]

export default function Examples() {
  return (
    <section id="examples" className="w-full py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Formula Examples
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Click the examples below to quickly experience AI formula generation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {examples.map((example) => (
            <div
              key={example.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {example.title}
                </h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  example.platform === 'excel' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {example.platform === 'excel' ? 'Excel' : 'Google Sheets'}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">
                {example.description}
              </p>
              
              <div className="space-y-3">
                <div>
                  <div className="text-xs font-medium text-gray-500 mb-1">Input Description:</div>
                  <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded border">
                    {example.input}
                  </div>
                </div>
                
                <div>
                  <div className="text-xs font-medium text-gray-500 mb-1">Generated Formula:</div>
                  <div className="text-sm font-mono text-excel-green bg-green-50 p-2 rounded border border-green-200">
                    {example.formula}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}