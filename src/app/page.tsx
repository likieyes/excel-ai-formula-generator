import { Metadata } from 'next'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import FormulaGeneratorSection from '@/components/FormulaGeneratorSection'
import FeatureGrid from '@/components/FeatureGrid'
import FAQ from '@/components/FAQ'
import Examples from '@/components/Examples'
import SocialProof from '@/components/SocialProof'
import Footer from '@/components/Footer'

// Homepage-specific metadata with canonical URL
export const metadata: Metadata = {
  alternates: {
    canonical: 'https://www.aiexcelformula.com',
  },
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />

      {/* Interactive Formula Generator — Client Component */}
      <FormulaGeneratorSection />

      {/* SEO Content Sections — Server Rendered for Google indexing */}
      <Examples />
      <SocialProof />
      <FeatureGrid />
      <FAQ />
      <Footer />
    </main>
  )
}