import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FormulaGeneratorSection from '@/components/FormulaGeneratorSection'
import { BrainCircuit } from 'lucide-react'

export const metadata: Metadata = {
    title: 'AI Excel Formula Explainer - Understand Any Formula | AI Excel Formula',
    description: 'Paste any complex Excel formula and our AI will explain exactly how it works step-by-step.',
    keywords: ['excel formula explainer', 'understand excel formulas', 'formula breakdown', 'excel help'],
}

export default function ExplainerPage() {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main>
                <section className="bg-green-50 py-16">
                    <div className="container mx-auto px-4 text-center">
                        <div className="inline-flex p-3 bg-white rounded-2xl shadow-sm mb-6">
                            <BrainCircuit className="h-8 w-8 text-excel-green" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Formula Explainer</h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Stuck with a complex formula from a colleague? Paste it below and our AI will translate it into plain, easy-to-understand English.
                        </p>
                    </div>
                </section>

                <div className="py-12">
                    {/* We use the same component for now, but the prompt on the backend should be handled based on context */}
                    <FormulaGeneratorSection task="explain" />
                </div>

                <section className="py-16 bg-white border-t">
                    <div className="container mx-auto px-4 max-w-4xl text-center">
                        <h2 className="text-3xl font-bold mb-6">Why use the Formula Explainer?</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div>
                                <div className="text-excel-green text-3xl font-bold mb-2">01</div>
                                <h3 className="font-bold mb-2">Learn Faster</h3>
                                <p className="text-gray-600 text-sm line-clamp-2">Understand the &quot;why&quot; behind every function and nesting level.</p>
                            </div>
                            <div>
                                <div className="text-excel-green text-3xl font-bold mb-2">02</div>
                                <h3 className="font-bold mb-2">Debug Errors</h3>
                                <p className="text-gray-600 text-sm line-clamp-2">Easily spot where a logic chain is broken in a long formula.</p>
                            </div>
                            <div>
                                <div className="text-excel-green text-3xl font-bold mb-2">03</div>
                                <h3 className="font-bold mb-2">Verify Accuracy</h3>
                                <p className="text-gray-600 text-sm line-clamp-2">Confirm that the formula you found online actually does what you think it does.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
