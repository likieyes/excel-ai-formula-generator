'use client'

import Script from 'next/script'

/**
 * 百度统计组件 - 作为 Google Analytics 的替代方案
 */
export default function BaiduAnalytics() {
  // 百度统计代码 - 需要在百度统计后台获取
  const BAIDU_ANALYTICS_ID = 'your_baidu_analytics_id_here'

  return (
    <>
      <Script
        id="baidu-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            var _hmt = _hmt || [];
            (function() {
              var hm = document.createElement("script");
              hm.src = "https://hm.baidu.com/hm.js?${BAIDU_ANALYTICS_ID}";
              var s = document.getElementsByTagName("script")[0]; 
              s.parentNode.insertBefore(hm, s);
            })();
          `,
        }}
      />
    </>
  )
}