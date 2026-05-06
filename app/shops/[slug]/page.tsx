import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { CORE_GUIDE_LINKS } from '@/lib/shopInsights'
import { formatJapaneseDate, getLastVerifiedAt } from '@/lib/utils'
import Breadcrumbs from '@/components/Breadcrumbs'
import {
    getOfficialLinks,
    getShopChecklist,
    getShopTakeaways,
    getReferenceNotes,
    getShopLead,
} from '@/lib/shopDetail'

type RelatedBrand = {
    brands: {
        name: string
        slug: string
    } | null
}

type SimilarShop = {
    name: string
    slug: string
    description?: string | null
    country?: string | null
    image_url?: string | null
}

export default async function ShopDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params

    const { data: shop } = await supabase
        .from('shops')
        .select('*')
        .eq('slug', slug)
        .single()

    if (!shop) {
        return (
            <>
                <Header />
                <main className="container" style={{ paddingTop: '10rem', minHeight: '100vh' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>ショップが見つかりません。</p>
                    <Link href="/shops" className="btn btn-secondary">← ショップ一覧に戻る</Link>
                </main>
                <Footer />
            </>
        )
    }

    const [brandResponse, similarResponse] = await Promise.all([
        supabase
            .from('shop_brands')
            .select(`
                brands:brand_id (
                    name,
                    slug
                )
            `)
            .eq('shop_id', shop.id)
            .eq('status', 'found')
            .limit(12),
        supabase
            .from('shops')
            .select('name, slug, description, country, image_url')
            .eq('category', shop.category)
            .neq('slug', shop.slug)
            .order('popularity_score', { ascending: false })
            .limit(4),
    ])

    const lead = getShopLead(shop)
    const referenceNotes = getReferenceNotes(shop)
    const officialLinks = getOfficialLinks(shop)
    const lastVerified = formatJapaneseDate(getLastVerifiedAt(shop)) || '未確認'
    
    const relatedBrands = Array.from(
        new Map(
            (((brandResponse.data as RelatedBrand[] | null) || [])
                .flatMap((item) => item.brands ? [item.brands] : []))
                .map((brand) => [brand.slug, brand])
        ).values()
    )
    const similarShops = (similarResponse.data as SimilarShop[] | null) || []
    
    // shopDetail.ts の戻り値に合わせる
    const shopTakeaways = getShopTakeaways(shop)
    const shopChecklist = getShopChecklist(shop)

    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Store',
                '@id': `https://original-price.com/shops/${shop.slug}#store`,
                name: shop.name,
                description: shop.description || lead,
                image: shop.image_url || undefined,
                url: shop.url,
                address: {
                    '@type': 'PostalAddress',
                    addressCountry: shop.country || undefined,
                },
            },
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    {
                        '@type': 'ListItem',
                        position: 1,
                        name: 'ホーム',
                        item: 'https://original-price.com',
                    },
                    {
                        '@type': 'ListItem',
                        position: 2,
                        name: 'ショップ一覧',
                        item: 'https://original-price.com/shops',
                    },
                    {
                        '@type': 'ListItem',
                        position: 3,
                        name: shop.name,
                        item: `https://original-price.com/shops/${shop.slug}`,
                    },
                ],
            },
        ],
    }

    return (
        <>
            <Header />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <main style={{ background: 'var(--bg)', color: 'var(--text-primary)', overflow: 'hidden' }}>
                <style>{`
                    .hero-section {
                        padding-top: clamp(8rem, 15vw, 12rem);
                        padding-bottom: clamp(4rem, 8vw, 6rem);
                        background: radial-gradient(circle at top right, rgba(0,0,0,0.03) 0%, transparent 70%);
                        border-bottom: 1px solid var(--border-soft);
                    }
                    .shop-header {
                        display: grid;
                        gap: 2.5rem;
                        grid-template-columns: 1fr;
                    }
                    @media (min-width: 1024px) {
                        .shop-header {
                            grid-template-columns: 1fr 1fr;
                            align-items: flex-start;
                        }
                    }
                    .visual-card {
                        position: relative;
                        background: var(--surface);
                        border: 1px solid var(--border);
                        border-radius: var(--radius-lg);
                        overflow: hidden;
                        box-shadow: 0 30px 60px -20px rgba(0,0,0,0.12);
                    }
                    .policy-grid {
                        display: grid;
                        gap: 1rem;
                        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    }
                    .policy-card {
                        background: var(--surface);
                        border: 1px solid var(--border);
                        border-radius: var(--radius-md);
                        padding: 1.75rem;
                        display: grid;
                        gap: 0.75rem;
                    }
                    .brand-tag {
                        background: var(--surface);
                        border: 1px solid var(--border);
                        padding: 0.5rem 1.25rem;
                        border-radius: var(--radius-pill);
                        font-size: 0.85rem;
                        font-weight: 600;
                        transition: all 0.2s var(--ease-out);
                    }
                    .brand-tag:hover {
                        border-color: var(--text-primary);
                        transform: translateY(-1px);
                    }
                    .verified-badge {
                        font-size: 0.7rem;
                        font-weight: 700;
                        color: #166534;
                        background: #f0fdf4;
                        border: 1px solid #bbf7d0;
                        padding: 0.25rem 0.65rem;
                        border-radius: var(--radius-pill);
                        display: inline-flex;
                        align-items: center;
                        gap: 0.3rem;
                    }
                `}</style>

                {/* Hero Section */}
                <section className="hero-section">
                    <div className="container">
                        <div className="shop-header">
                            {/* 1. Name & Meta */}
                            <div className="fade-up">
                                <Breadcrumbs items={[
                                    { label: 'ショップから探す', href: '/shops' },
                                    { label: shop.name }
                                ]} />
                                
                                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                                    <span className="tag">{shop.category || 'Shop Profile'}</span>
                                    {shop.country && <span className="tag" style={{ background: 'transparent' }}>{shop.country}</span>}
                                    <div className="verified-badge">
                                        ✨ VERIFIED: {lastVerified}
                                    </div>
                                </div>

                                <h1 style={{ 
                                    fontSize: 'clamp(2.5rem, 6vw, 4rem)', 
                                    fontWeight: 850, 
                                    lineHeight: 1.1, 
                                    letterSpacing: '-0.04em',
                                    marginBottom: '1.5rem',
                                    color: 'var(--text-primary)'
                                }}>
                                    {shop.name}
                                </h1>

                                <p style={{ 
                                    fontSize: 'clamp(1.1rem, 2vw, 1.25rem)', 
                                    lineHeight: 1.6, 
                                    color: 'var(--text-secondary)',
                                    marginBottom: '2.5rem',
                                    maxWidth: '600px'
                                }}>
                                    {lead}
                                </p>

                                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                    {officialLinks.length > 0 && (
                                        <a href={officialLinks[0].href} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '1rem 2.5rem' }}>
                                            公式サイトを見る ↗
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* 2. Visual Card */}
                            <div className="fade-up delay-1">
                                <div className="visual-card">
                                    <div style={{ aspectRatio: '16/10', position: 'relative', background: 'var(--accent-brand-soft)' }}>
                                        {shop.image_url ? (
                                            <Image 
                                                src={shop.image_url} 
                                                alt={shop.name} 
                                                fill 
                                                unoptimized
                                                style={{ objectFit: 'cover' }}
                                                sizes="(max-width: 1024px) 100vw, 500px"
                                            />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                                Preview Loading...
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', borderTop: '1px solid var(--border)' }}>
                                        <div>
                                            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Ships To</p>
                                            <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{shop.ships_to_japan ? '🇯🇵 Japan' : 'Global'}</p>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Popularity</p>
                                            <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{shop.popularity_score ? `${shop.popularity_score}/100` : 'Normal'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="container" style={{ padding: '5rem 0' }}>
                    <div style={{ display: 'grid', gap: '5rem', gridTemplateColumns: '1fr' }}>
                        {/* 3. Reference Notes */}
                        <section className="fade-up">
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '2.5rem', letterSpacing: '-0.02em' }}>Quick Takeaways</h2>
                            <div className="policy-grid">
                                {referenceNotes.map((item, i) => (
                                    <div key={i} className="policy-card">
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{item.label}</h3>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.body}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div style={{ display: 'grid', gap: '5rem', gridTemplateColumns: '1fr' }}>
                            {/* 4. Checklist */}
                            <section className="fade-up">
                                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '2rem', letterSpacing: '-0.02em' }}>Shopping Checklist</h2>
                                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '1.5rem' }}>
                                        {shopChecklist.map((item, i) => (
                                            <li key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                                <span style={{ color: 'var(--accent-brand)', fontSize: '1.25rem', lineHeight: 1 }}>✓</span>
                                                <div>
                                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{item}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </section>

                            {/* 5. Related Brands */}
                            {relatedBrands.length > 0 && (
                                <section className="fade-up">
                                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '2rem', letterSpacing: '-0.02em' }}>Available Brands at {shop.name}</h2>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                        {relatedBrands.map((brand) => (
                                            <Link key={brand.slug} href={`/brands/${brand.slug}`} className="brand-tag">
                                                {brand.name}
                                            </Link>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* 6. Similar Shops */}
                            {similarShops.length > 0 && (
                                <section className="fade-up">
                                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '2.5rem', letterSpacing: '-0.02em' }}>Similar Shops</h2>
                                    <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                                        {similarShops.map((item) => (
                                            <Link key={item.slug} href={`/shops/${item.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '100%' }}>
                                                    <div style={{ aspectRatio: '16/8', position: 'relative' }}>
                                                        {item.image_url ? (
                                                            <Image src={item.image_url} alt={item.name} fill unoptimized style={{ objectFit: 'cover' }} />
                                                        ) : (
                                                            <div style={{ width: '100%', height: '100%', background: 'var(--border-soft)' }} />
                                                        )}
                                                    </div>
                                                    <div style={{ padding: '1.25rem' }}>
                                                        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{item.name}</h3>
                                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.description}</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* 7. Reference Links */}
                            <section className="fade-up" style={{ padding: '3rem', background: '#fafaf9', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Official Guides</p>
                                <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                                    {officialLinks.map((link) => (
                                        <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 600 }}>
                                            {link.label} ↗
                                        </a>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
                <Footer />
            </main>
        </>
    )
}
