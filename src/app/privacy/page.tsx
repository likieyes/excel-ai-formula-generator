import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
    title: 'Privacy Policy | AI Excel Formula',
    description: 'Privacy Policy for AI Excel Formula - How we handle your data.',
}

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main className="container mx-auto px-4 py-16 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
                <div className="prose prose-slate max-w-none space-y-6 text-gray-700">
                    <p>Last updated: March 03, 2026</p>
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
                        <p>At AI Excel Formula, we prioritize your privacy. We do not require users to create accounts or provide personal information to use our basic formula generation service.</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Usage Data:</strong> We collect anonymous information about how you interact with our site (e.g., pages visited, time spent) to improve user experience via Google Analytics.</li>
                            <li><strong>Input Content:</strong> The descriptions you enter for formula generation are processed to provide results but are not stored in a way that identifies you personally.</li>
                        </ul>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Information</h2>
                        <p>We use the collected data to provide the service, maintain site security, and optimize our AI models for better accuracy.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Data Security</h2>
                        <p>We implement industry-standard security measures to protect your data. Since we do not store personal profiles, the risk of personal data breach is significantly minimized.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Cookies</h2>
                        <p>We use cookies to understand site usage and remember your preferences (like choosing between Excel and Google Sheets).</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Contact Us</h2>
                        <p>If you have any questions about this Privacy Policy, please contact us at support@aiexcelformula.com.</p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    )
}
