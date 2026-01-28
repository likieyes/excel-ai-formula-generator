import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { BLOG_POSTS } from '@/lib/blog-data'
import { BlogPost } from '@/types'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }))
}

// Generate metadata for each blog post
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = BLOG_POSTS.find((post) => post.slug === params.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: `${post.title} | AI Excel Formula Blog`,
    description: post.excerpt,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://www.aiexcelformula.com/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  }
}

function findPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug)
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = findPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-excel-green">Home</Link>
            <span>›</span>
            <Link href="/blog" className="hover:text-excel-green">Blog</Link>
            <span>›</span>
            <span className="text-gray-900">{post.title}</span>
          </nav>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <article className="flex-1">
              {/* Article Header */}
              <header className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  {post.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
                  <div className="flex items-center">
                    <span className="font-medium">{post.author}</span>
                  </div>
                  <span>•</span>
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                  <span>•</span>
                  <span>{post.readTime} min read</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-sm font-medium bg-excel-green/10 text-excel-green rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </header>

              {/* Article Content */}
              <div 
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-excel-green prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700 prose-blockquote:border-excel-green prose-blockquote:bg-gray-50 prose-blockquote:px-4 prose-blockquote:py-2"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Article Footer */}
              <footer className="mt-12 pt-8 border-t border-gray-200">
                <div className="bg-excel-green/5 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Need Help with Excel Formulas?
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Stop struggling with complex syntax. Our AI-powered formula generator 
                    converts plain English descriptions into perfect Excel formulas instantly.
                  </p>
                  <Link
                    href="/"
                    className="inline-block bg-excel-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-excel-green-dark transition-colors"
                  >
                    Try Free Formula Generator
                  </Link>
                </div>
              </footer>
            </article>

            {/* Sidebar */}
            <aside className="lg:w-80">
              {/* CTA Widget */}
              <div className="sticky top-8">
                <div className="bg-gradient-to-br from-excel-green to-excel-green-dark text-white rounded-lg p-6 mb-8">
                  <h3 className="text-xl font-bold mb-3">
                    🚀 Try Our Free Formula Generator
                  </h3>
                  <p className="text-excel-green-light mb-4">
                    Convert plain English to Excel formulas instantly. No signup required!
                  </p>
                  <Link
                    href="/"
                    className="block w-full bg-white text-excel-green text-center py-3 px-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Generate Formulas Now
                  </Link>
                </div>

                {/* Related Posts */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Related Articles
                  </h3>
                  <div className="space-y-4">
                    {BLOG_POSTS
                      .filter((p) => p.slug !== post.slug)
                      .slice(0, 3)
                      .map((relatedPost) => (
                        <div key={relatedPost.slug}>
                          <Link
                            href={`/blog/${relatedPost.slug}`}
                            className="block hover:text-excel-green transition-colors"
                          >
                            <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">
                              {relatedPost.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {relatedPost.readTime} min read
                            </p>
                          </Link>
                        </div>
                      ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Link
                      href="/blog"
                      className="text-excel-green hover:text-excel-green-dark font-medium text-sm"
                    >
                      View All Articles →
                    </Link>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}