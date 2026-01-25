'use client'

import { useEffect, useState } from 'react'

export default function GATest() {
  const [gaStatus, setGaStatus] = useState({
    measurementId: 'G-F4PGJV6XDF',
    gtagLoaded: false,
    dataLayerExists: false
  })

  useEffect(() => {
    const checkGA = () => {
      setGaStatus({
        measurementId: 'G-F4PGJV6XDF',
        gtagLoaded: typeof window.gtag === 'function',
        dataLayerExists: Array.isArray(window.dataLayer)
      })
    }

    // Check immediately
    checkGA()

    // Check again after a delay to allow scripts to load
    const timer = setTimeout(checkGA, 3000)

    return () => clearTimeout(timer)
  }, [])

  const sendTestEvent = () => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'test_button_click', {
        event_category: 'Test',
        event_label: 'Manual Test',
        value: 1
      })
      alert('测试事件已发送！请检查 GA4 实时报告。')
    } else {
      alert('gtag 函数未加载，无法发送事件。')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">GA4 简单测试</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">状态检查</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Measurement ID:</span>
              <code className="bg-gray-100 px-2 py-1 rounded">{gaStatus.measurementId}</code>
            </div>
            
            <div className="flex justify-between">
              <span>gtag 函数:</span>
              <span className={gaStatus.gtagLoaded ? 'text-green-600' : 'text-red-600'}>
                {gaStatus.gtagLoaded ? '✅ 已加载' : '❌ 未加载'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span>dataLayer:</span>
              <span className={gaStatus.dataLayerExists ? 'text-green-600' : 'text-red-600'}>
                {gaStatus.dataLayerExists ? '✅ 存在' : '❌ 不存在'}
              </span>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              onClick={sendTestEvent}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium"
            >
              发送测试事件
            </button>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p>如果 gtag 函数显示&quot;未加载&quot;，请：</p>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>等待 3-5 秒让脚本加载</li>
              <li>刷新页面</li>
              <li>检查浏览器控制台是否有错误</li>
              <li>确认网络连接正常</li>
            </ol>
          </div>
          
          <div className="mt-4">
            <a href="/" className="text-blue-500 hover:text-blue-600 underline">
              ← 返回主页
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

// 声明全局类型
declare global {
  interface Window {
    dataLayer: any[]
  }
}