import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
    title: 'Terms of Service | AI Excel Formula',
    description: 'Terms of Service for using AI Excel Formula tool.',
}

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main className="container mx-auto px-4 py-16 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
                <div className="prose prose-slate max-w-none space-y-6 text-gray-700">
                    <p>Last updated: March 03, 2026</p>
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                        <p>By accessing AI Excel Formula, you agree to be bound by these Terms of Service. If you do not agree, please do not use the service.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use of Service</h2>
                        <p>Our tool is provided to help you generate spreadsheet formulas. You agree to use it for lawful purposes only. You are responsible for verifying the accuracy of any generated formula before using it in critical business environments.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Intellectual Property</h2>
                        <p>The AI models and website interface are the property of AI Excel Formula. Users retain ownership of the specific input descriptions they provide.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Limitation of Liability</h2>
                        <p>AI Excel Formula is provided "as is" without warranties. We are not liable for any data loss, financial loss, or errors resulting from the use of generated formulas.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Changes to Terms</h2>
                        <p>We reserve the right to modify these terms at any time. Continued use of the site constitutes acceptance of updated terms.</p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    )
}
