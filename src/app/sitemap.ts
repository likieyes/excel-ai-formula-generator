import { MetadataRoute } from 'next'
import { BLOG_POSTS } from '@/lib/blog-data'
import { getPublishedFormulas } from '@/lib/formulas-data'

export default function sitemap(): MetadataRoute.Sitemap {
  // Main pages
  const routes = [
    {
      url: 'https://www.aiexcelformula.com',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: 'https://www.aiexcelformula.com/formulas',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: 'https://www.aiexcelformula.com/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },

  ]

  // Blog posts
  const blogRoutes = BLOG_POSTS.map((post) => ({
    url: `https://www.aiexcelformula.com/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Formula pages
  const formulaRoutes = getPublishedFormulas().map((formula) => ({
    url: `https://www.aiexcelformula.com/formulas/${formula.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...routes, ...blogRoutes, ...formulaRoutes]
}