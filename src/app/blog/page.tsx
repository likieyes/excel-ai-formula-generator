import { Metadata } from 'next'
import Link from 'next/link'
import { BLOG_POSTS } from '@/lib/blog-data'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Excel & Google Sheets Blog - Tips, Tutorials & Guides | AI Excel Formula',
  description: 'Learn Excel and Google Sheets with our comprehensive tutorials, tips, and guides. Master formulas, pivot tables, data analysis, and productivity techniques.',
  keywords: ['Excel blog', 'Google Sheets tutorials', 'spreadsheet tips', 'Excel formulas', 'data analysis'],
  alternates: {
    canonical: 'https://www.aiexcelformula.com/blog',
  },
  openGraph: {
    title: 'Excel & Google Sheets Blog - Expert Tips and Tutorials',
    description: 'Master Excel and Google Sheets with our expert tutorials and guides',
    url: 'https://www.aiexcelformula.com/blog',
    type: 'website',
  },
}

export default function BlogPage() {
  // Sort posts by date (newest first)
  const sortedPosts = [...BLOG_POSTS].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      {/* Header Banner */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Excel & Google Sheets Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Master spreadsheets with our expert tutorials, tips, and guides.
              From basic formulas to advanced data analysis techniques.
            </p>
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedPosts.map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
              >
                <div className="p-6">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs font-medium bg-excel-green/10 text-excel-green rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-excel-green transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h2>

                  {/* Excerpt */}
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Meta info */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span>{post.author}</span>
                      <span>•</span>
                      <span>{post.readTime} min read</span>
                    </div>
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </time>
                  </div>

                  {/* Read More Button */}
                  <div className="mt-4">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center text-excel-green hover:text-excel-green-dark font-medium transition-colors"
                    >
                      Read More
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-excel-green text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Create Your Own Formulas?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Stop struggling with complex syntax. Describe what you need in plain English
            and get perfect Excel formulas instantly.
          </p>
          <Link
            href="/"
            className="inline-block bg-white text-excel-green px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Try Our Free AI Formula Generator
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}