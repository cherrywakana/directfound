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
            url: `${baseUrl}/brands`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/shops`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.3,
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

    // Get dynamic articles from DB (posts table)
    const { data: posts } = await supabase
        .from('posts')
        .select('slug, updated_at')

    if (posts) {
        const postRoutes = posts.map((post) => ({
            url: `${baseUrl}/articles/${post.slug}`,
            lastModified: new Date(post.updated_at || new Date()),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        }))
        routes.push(...postRoutes)
    }

    // Get dynamic brands from DB
    const { data: brands } = await supabase
        .from('brands')
        .select('slug, created_at')

    if (brands) {
        const brandRoutes = brands.map((brand) => ({
            url: `${baseUrl}/brands/${brand.slug}`,
            lastModified: new Date(brand.created_at || new Date()),
            changeFrequency: 'daily' as const,
            priority: 0.8,
        }))
        routes.push(...brandRoutes)
    }

    return routes
}
