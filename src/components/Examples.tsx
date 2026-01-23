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
    title: '求和计算',
    description: '计算指定范围内所有数值的总和',
    input: '计算A1到A10的总和',
    formula: '=SUM(A1:A10)',
    platform: 'excel'
  },
  {
    id: 'vlookup',
    title: '数据查找',
    description: '从表格中查找对应的数据',
    input: '查找产品价格表中的价格',
    formula: '=VLOOKUP(A2,B:D,3,FALSE)',
    platform: 'excel'
  },
  {
    id: 'if',
    title: '条件判断',
    description: '根据条件显示不同的结果',
    input: '如果分数大于80显示及格，否则显示不及格',
    formula: '=IF(A1>80,"及格","不及格")',
    platform: 'excel'
  },
  {
    id: 'average',
    title: '平均值计算',
    description: '计算数值的平均值',
    input: '计算学生成绩的平均分',
    formula: '=AVERAGE(B2:B10)',
    platform: 'excel'
  },
  {
    id: 'countif',
    title: '条件计数',
    description: '统计满足条件的单元格数量',
    input: '统计大于90分的学生人数',
    formula: '=COUNTIF(B2:B10,">90")',
    platform: 'excel'
  },
  {
    id: 'query',
    title: 'Google表格查询',
    description: '使用QUERY函数进行数据筛选',
    input: '查询销售额大于1000的记录',
    formula: '=QUERY(A:C,"SELECT * WHERE C > 1000")',
    platform: 'google-sheets'
  }
]

interface ExamplesProps {
  onExampleClick?: (input: string, platform: 'excel' | 'google-sheets') => void
}

export default function Examples({ onExampleClick }: ExamplesProps) {
  return (
    <section id="examples" className="w-full py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            公式示例
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            点击下面的示例快速体验AI公式生成功能
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {examples.map((example) => (
            <div
              key={example.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 cursor-pointer border border-gray-200 hover:border-excel-green"
              onClick={() => onExampleClick?.(example.input, example.platform)}
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
                  <div className="text-xs font-medium text-gray-500 mb-1">输入描述:</div>
                  <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded border">
                    {example.input}
                  </div>
                </div>
                
                <div>
                  <div className="text-xs font-medium text-gray-500 mb-1">生成公式:</div>
                  <div className="text-sm font-mono text-excel-green bg-green-50 p-2 rounded border border-green-200">
                    {example.formula}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center text-excel-green text-sm font-medium">
                  <span className="mr-1">→</span>
                  点击试用此示例
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}