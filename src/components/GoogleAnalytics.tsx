'use client'

import Script from 'next/script'

/**
 * Google Analytics 4 component for Excel AI Formula Generator
 * Handles GA4 script loading and initialization
 */
export default function GoogleAnalytics() {
  const GA_MEASUREMENT_ID = 'G-F4PGJV6XDF'

  // Log for debugging
  console.log('GA4: Component loading with ID:', GA_MEASUREMENT_ID)

  return (
    <>
      {/* Google Analytics 4 Global Site Tag */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        onLoad={() => console.log('GA4: Script loaded successfully')}
        onError={() => console.error('GA4: Script failed to load')}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        onLoad={() => console.log('GA4: Configuration script loaded')}
        dangerouslySetInnerHTML={{
          __html: `
            console.log('GA4: Initializing with ID: ${GA_MEASUREMENT_ID}');
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_title: document.title,
              page_location: window.location.href,
              send_page_view: true,
              anonymize_ip: true,
              allow_google_signals: false,
              allow_ad_personalization_signals: false
            });
            console.log('GA4: Configuration complete');
          `,
        }}
      />
    </>
  )
}