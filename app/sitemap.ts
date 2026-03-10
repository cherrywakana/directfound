import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://directfound.com'

    // Default static pages
    const routes = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1.0,
        },
        {
            url: `${baseUrl}/guide`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/shops`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        },
    ]

    // Get dynamic shops from DB
    const { data: shops } = await supabase
        .from('shops')
        .select('slug, updated_at')

    if (shops) {
        const shopRoutes = shops.map((shop) => ({
            url: `${baseUrl}/shops/${shop.slug}`,
            lastModified: new Date(shop.updated_at || new Date()),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }))
        routes.push(...shopRoutes)
    }

    // Get dynamic articles from DB (if applicable, using 'articles' table)
    // Just in case we have active articles
    const { data: articles } = await supabase
        .from('articles')
        .select('slug, updated_at')

    if (articles) {
        const articleRoutes = articles.map((article) => ({
            url: `${baseUrl}/articles/${article.slug}`,
            lastModified: new Date(article.updated_at || new Date()),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        }))
        routes.push(...articleRoutes)
    }

    return routes
}
