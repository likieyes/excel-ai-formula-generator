'use client'

import Script from 'next/script'
import { useEffect } from 'react'
import { initGA, GA_MEASUREMENT_ID } from '@/lib/gtag'

/**
 * Google Analytics 4 component for Excel AI Formula Generator
 * Handles GA4 script loading and initialization
 */
export default function GoogleAnalytics() {
  useEffect(() => {
    if (GA_MEASUREMENT_ID) {
      initGA(GA_MEASUREMENT_ID)
    }
  }, [])

  // Don't render if no measurement ID
  if (!GA_MEASUREMENT_ID) {
    console.warn('GA4: No measurement ID found')
    return null
  }

  // Log for debugging
  console.log('GA4: Loading with ID:', GA_MEASUREMENT_ID)

  return (
    <>
      {/* Google Analytics 4 Global Site Tag */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
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
          `,
        }}
      />
    </>
  )
}