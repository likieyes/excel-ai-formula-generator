'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/gtag'

export default function TestGA() {
  useEffect(() => {
    // 测试 GA4 是否正常工作
    console.log('GA Measurement ID:', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID)
    
    // 检查 gtag 是否已加载
    if (typeof window !== 'undefined') {
      console.log('Window gtag:', typeof window.gtag)
      
      // 发送测试事件
      trackEvent('test_page_view', {
        page_title: 'GA4 Test Page',
        page_location: window.location.href
      })
    }
  }, [])

  const handleTestEvent = () => {
    trackEvent('test_button_click', {
      button_name: 'Test Button',
      timestamp: new Date().toISOString()
    })
    alert('测试事件已发送！检查 GA4 实时报告。')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Google Analytics 4 测试页面</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-semibold mb-4">GA4 配置检查</h2>
          
          <div className="space-y-4">
            <div>
              <strong>Measurement ID:</strong> 
              <code className="ml-2 bg-gray-100 px-2 py-1 rounded">
                G-F4PGJV6XDF
              </code>
            </div>
            
            <div>
              <strong>gtag 函数状态:</strong>
              <span className="ml-2">
                {typeof window !== 'undefined' && typeof window.gtag === 'function' ? '✅ 已加载' : '❌ 未加载'}
              </span>
            </div>
            
            <div>
              <strong>当前页面:</strong>
              <code className="ml-2 bg-gray-100 px-2 py-1 rounded">
                {typeof window !== 'undefined' ? window.location.href : '服务端渲染'}
              </code>
            </div>
          </div>
          
          <div className="mt-8">
            <button
              onClick={handleTestEvent}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
            >
              发送测试事件到 GA4
            </button>
          </div>
          
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">使用说明：</h3>
            <ol className="list-decimal list-inside space-y-1 text-yellow-700">
              <li>打开浏览器开发者工具控制台 (F12)</li>
              <li>查看控制台输出的 GA 配置信息</li>
              <li>点击&quot;发送测试事件&quot;按钮</li>
              <li>在 GA4 实时报告中查看是否收到事件</li>
            </ol>
          </div>
          
          <div className="mt-6">
            <a 
              href="/"
              className="text-blue-500 hover:text-blue-600 underline"
            >
              ← 返回主页
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}