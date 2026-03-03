import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Mail, MessageSquare, Globe } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Contact Us | AI Excel Formula',
    description: 'Get in touch with the AI Excel Formula team for support or feedback.',
}

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
                        <p className="text-xl text-gray-600">
                            Have questions or feedback? We&apos;d love to hear from you.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <Mail className="text-excel-green" />
                                    Email Support
                                </h3>
                                <p className="text-gray-600 mb-2">For support, partnerships, or general inquiries:</p>
                                <a href="mailto:support@aiexcelformula.com" className="text-excel-green font-medium hover:underline text-lg">
                                    support@aiexcelformula.com
                                </a>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <MessageSquare className="text-excel-green" />
                                    Feedback
                                </h3>
                                <p className="text-gray-600">
                                    Tell us how we can improve our formula generator or suggest a new feature.
                                </p>
                            </div>

                            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                                <h4 className="font-semibold mb-2">Response Time</h4>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                    We usually respond to all inquiries within 24-48 business hours.
                                </p>
                            </div>
                        </div>

                        {/* Simple Form Placeholder or Message */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                            <h3 className="text-2xl font-bold mb-6">Quick Message</h3>
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                                    <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-excel-green focus:outline-none" placeholder="name@example.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                    <textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-excel-green focus:outline-none" placeholder="How can we help?"></textarea>
                                </div>
                                <button type="button" className="w-full bg-excel-green text-white font-bold py-3 rounded-lg hover:bg-excel-green-dark transition-colors">
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
