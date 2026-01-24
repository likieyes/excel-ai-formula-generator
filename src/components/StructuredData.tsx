import Script from 'next/script'

export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Excel AI Formula Generator",
    "alternateName": "AI Excel Formula",
    "description": "The best free AI tool to write Excel formulas. Convert English to Excel formulas, VLOOKUP, IF functions, and Google Sheets scripts instantly.",
    "url": "https://www.aiexcelformula.com",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "softwareRequirements": "Web Browser",
    "memoryRequirements": "512MB",
    "storageRequirements": "0MB",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "validFrom": "2024-01-01"
    },
    "creator": {
      "@type": "Organization",
      "name": "AI Excel Formula",
      "url": "https://www.aiexcelformula.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "AI Excel Formula",
      "url": "https://www.aiexcelformula.com"
    },
    "softwareVersion": "1.0",
    "datePublished": "2024-01-01",
    "dateModified": new Date().toISOString().split('T')[0],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1247",
      "bestRating": "5",
      "worstRating": "1"
    },
    "featureList": [
      "AI-powered Excel formula generation",
      "Google Sheets formula support",
      "Natural language to formula conversion",
      "VLOOKUP formula generator",
      "IF function generator",
      "Nested formula support",
      "Instant results",
      "No signup required",
      "100% free to use",
      "Complex formula logic",
      "SUMIF and COUNTIF functions",
      "Array formula support"
    ],
    "screenshot": "https://www.aiexcelformula.com/screenshot.png",
    "softwareHelp": {
      "@type": "CreativeWork",
      "name": "How to use Excel AI Formula Generator",
      "text": "Simply describe what you want to calculate in plain English, select Excel or Google Sheets, and click generate to get your formula instantly. No technical knowledge required."
    },
    "keywords": "excel formula generator, ai excel formulas, vlookup generator, if function generator, google sheets formula, excel ai, free formula generator, spreadsheet formulas",
    "inLanguage": "en-US",
    "copyrightYear": "2024",
    "license": "https://www.aiexcelformula.com/terms"
  }

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is this Excel formula generator free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our Excel AI formula generator is completely free with unlimited access. You can generate as many formulas as you need without any cost, signup, or credit card requirement."
        }
      },
      {
        "@type": "Question",
        "name": "Does it work on Mac?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our formula generator works perfectly on Mac, Windows, and all operating systems. It supports all Excel versions including Excel for Mac, Excel Online, and Excel 365."
        }
      },
      {
        "@type": "Question",
        "name": "Can it write Google Sheets Query functions?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, simply switch the platform tab to Google Sheets and our AI will generate Google Sheets-specific formulas including QUERY functions, ARRAYFORMULA, and other Google Sheets syntax."
        }
      },
      {
        "@type": "Question",
        "name": "What types of Excel formulas can it generate?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our AI can generate all types of Excel formulas including VLOOKUP, HLOOKUP, INDEX MATCH, nested IF statements, SUMIF, COUNTIF, pivot table formulas, array formulas, and complex multi-condition logic."
        }
      },
      {
        "@type": "Question",
        "name": "How accurate are the generated formulas?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our AI is trained on extensive Excel documentation and real-world formula patterns. The formulas are highly accurate, but we always recommend testing them with your specific data to ensure they meet your exact requirements."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use this for Google Sheets formulas?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely! Switch to the Google Sheets tab and describe what you need. Our AI understands the differences between Excel and Google Sheets syntax and will generate the appropriate formula for your chosen platform."
        }
      }
    ]
  }

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AI Excel Formula",
    "url": "https://www.aiexcelformula.com",
    "logo": "https://www.aiexcelformula.com/logo.png",
    "description": "The best free AI tool to write Excel formulas and Google Sheets scripts instantly.",
    "foundingDate": "2024",
    "sameAs": [
      "https://twitter.com/aiexcelformula"
    ]
  }

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Excel AI Formula Generator",
    "url": "https://www.aiexcelformula.com",
    "description": "The best free AI tool to write Excel formulas. Convert English to Excel formulas, VLOOKUP, IF functions, and Google Sheets scripts instantly.",
    "inLanguage": "en-US",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.aiexcelformula.com/?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }

  return (
    <>
      <Script
        id="software-application-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData)
        }}
      />
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationData)
        }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteData)
        }}
      />
    </>
  )
}