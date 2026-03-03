import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { BookOpen, Zap, CheckCircle, HelpCircle } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'User Guide - How to use AI Excel Formula Generator',
    description: 'Learn how to generate perfect Excel and Google Sheets formulas using our AI tool.',
}

export default function GuidePage() {
    const steps = [
        {
            title: "1. Describe your goal",
            desc: "Use simple, natural English to describe what you want to calculate. For example: 'Find the average sales if region is North'.",
            icon: <Zap className="text-excel-green" />
        },
        {
            title: "2. Select your platform",
            desc: "Switch between Excel and Google Sheets tabs to ensure the syntax matches your specific software.",
            icon: <BookOpen className="text-excel-green" />
        },
        {
            title: "3. Generate and Copy",
            desc: "Click 'Generate Formula', review the result and explanation, and click 'Copy' to paste it directly into your spreadsheet.",
            icon: <CheckCircle className="text-excel-green" />
        }
    ]

    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">User Guide</h1>

                    <div className="prose prose-slate max-w-none mb-12">
                        <p className="text-xl text-gray-600 text-center mb-12">
                            Mastering spreadsheets has never been easier. Follow this guide to get the most out of our AI generator.
                        </p>

                        <div className="grid md:grid-cols-3 gap-8 mb-16">
                            {steps.map((step, i) => (
                                <div key={i} className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="mb-4">{step.icon}</div>
                                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                                </div>
                            ))}
                        </div>

                        <section className="bg-excel-green/5 p-8 rounded-2xl border border-excel-green/10 mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <HelpCircle className="text-excel-green" />
                                Tips for Best Results
                            </h2>
                            <ul className="space-y-4 text-gray-700">
                                <li className="flex gap-3">
                                    <span className="text-excel-green font-bold">✓</span>
                                    <span><strong>Be Specific:</strong> Mention cell ranges like A1:A10 instead of just &quot;the column&quot;.</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-excel-green font-bold">✓</span>
                                    <span><strong>Mention Conditions:</strong> Use words like &quot;if&quot;, &quot;and&quot;, &quot;but not&quot; to define logic clearly.</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-excel-green font-bold">✓</span>
                                    <span><strong>Reference Results:</strong> If the output isn&apos;t perfect, try rephrasing with different keywords like &quot;VLOOKUP&quot; or &quot;lookup&quot;.</span>
                                </li>
                            </ul>
                        </section>

                        <div className="text-center">
                            <Link href="/" className="inline-block bg-excel-green text-white font-bold px-10 py-4 rounded-xl hover:bg-excel-green-dark transition-all shadow-lg hover:shadow-xl">
                                Ready to Start? Generate a Formula Now
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
