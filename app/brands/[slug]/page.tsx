import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { CORE_GUIDE_LINKS, getBrandShopBadges, getBrandShopReason, type ShopInsight } from '@/lib/shopInsights'
import { formatJapaneseDate, getLastVerifiedAt } from '@/lib/utils'
import Breadcrumbs from '@/components/Breadcrumbs'

type BrandRecord = {
    id: number
    name: string
    slug: string
    created_at?: string | null
    updated_at?: string | null
}

type ShopBrandRow = {
    shop_id: number
    brand_url?: string | null
    shops: (ShopInsight & {
        name: string
        slug: string
        url: string
    }) | null
}

type BrandShop = ShopInsight & {
    name: string
    slug: string
    url: string
    brand_url?: string | null
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const { data: brand } = await supabase.from('brands').select('name').eq('slug', slug).single()

    return {
        title: `${brand?.name || 'ブランド'}が買える海外通販サイト一覧 - Original Price`,
        description: `${brand?.name || 'ブランド'}を取り扱う、日本からチェックしやすい海外通販ショップを一覧化。詳細条件は公式サイト確認前提で参考情報をまとめています。`,
    }
}

export default async function BrandDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params

    const { data: brand } = await supabase
        .from('brands')
        .select('*')
        .eq('slug', slug)
        .single<BrandRecord>()

    if (!brand) return (
        <>
            <Header />
            <main style={{ padding: '10rem 2rem', textAlign: 'center', minHeight: '100vh' }}>
                <h2>ブランドが見つかりません。</h2>
                <Link href="/brands">ブランド一覧へ戻る</Link>
            </main>
            <Footer />
        </>
    )

    const { data: shopBrands } = await supabase
        .from('shop_brands')
        .select(`
      shop_id,
      brand_url,
      shops:shop_id (
        name,
        slug,
        url,
        image_url,
        description,
        is_affiliate,
        ships_to_japan,
        popularity_score,
        updated_at,
        created_at
      )
    `)
        .eq('brand_id', brand.id)
        .eq('status', 'found')

    const availableShops: BrandShop[] = ((shopBrands as ShopBrandRow[] | null)?.flatMap((sb) => {
        if (!sb.shops) return []

        return [{
            ...sb.shops,
            brand_url: sb.brand_url,
        }]
    }) || []).sort((a, b) => {
        if (a.is_affiliate !== b.is_affiliate) return b.is_affiliate ? 1 : -1
        if (a.ships_to_japan !== b.ships_to_japan) return (b.ships_to_japan !== false) ? 1 : -1
        if (a.popularity_score !== b.popularity_score) return (b.popularity_score || 0) - (a.popularity_score || 0)
        return a.name.localeCompare(b.name)
    })

    const lastVerifiedAt = getLastVerifiedAt(availableShops[0]) || getLastVerifiedAt(brand)
    const featuredShops = availableShops.slice(0, 3)

    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Brand',
                '@id': `https://original-price.com/brands/${brand.slug}#brand`,
                name: brand.name,
                url: `https://original-price.com/brands/${brand.slug}`,
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
                        name: 'ブランド一覧',
                        item: 'https://original-price.com/brands',
                    },
                    {
                        '@type': 'ListItem',
                        position: 3,
                        name: brand.name,
                        item: `https://original-price.com/brands/${brand.slug}`,
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
            <main style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', background: '#f8fafc', minHeight: '100vh' }}>

                <section style={{
                    padding: 'clamp(8rem, 12vw, 10rem) clamp(1.5rem, 5vw, 4rem) 4rem',
                    background: '#fafaf9',
                    borderBottom: '1px solid #e2e8f0',
                }}>
                    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        <Breadcrumbs items={[
                            { label: 'ブランドから探す', href: '/brands' },
                            { label: brand.name }
                        ]} />
                        <Link href="/brands" style={{ color: '#111110', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, display: 'inline-block', marginBottom: '2rem' }}>
                            ← ブランド一覧へ戻る
                        </Link>
                        <h1 style={{
                            fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 850,
                            letterSpacing: '-0.04em', color: '#0f172a', lineHeight: 1.1, marginBottom: '1rem',
                        }}>
                            {brand.name}
                        </h1>
                        <p style={{ fontSize: '1.125rem', color: '#64748b', lineHeight: 1.6, maxWidth: '720px' }}>
                            {brand.name}を日本から探しやすいショップを一覧化しています。細かい配送条件や料金は各ショップの公式案内でご確認ください。
                        </p>
                        <p style={{ marginTop: '1rem', fontSize: '0.92rem', color: '#64748b' }}>
                            最終確認 {formatJapaneseDate(lastVerifiedAt) || '未登録'}
                        </p>

                        {featuredShops.length > 0 && (
                            <div style={{ marginTop: '2rem', display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                                {featuredShops.map((shop, index) => (
                                    <div
                                        key={shop.slug}
                                        style={{
                                            background: '#ffffff',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '20px',
                                            padding: '1.15rem',
                                            boxShadow: '0 10px 24px rgba(15, 23, 42, 0.05)',
                                        }}
                                    >
                                        <p style={{ fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b', marginBottom: '0.6rem' }}>
                                            おすすめ {index + 1}
                                        </p>
                                        <h2 style={{ fontSize: '1.1rem', lineHeight: 1.4, marginBottom: '0.5rem' }}>{shop.name}</h2>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '0.75rem' }}>
                                            {getBrandShopBadges(shop).map((badge) => (
                                                <span key={badge} style={{ fontSize: '0.72rem', fontWeight: 700, color: '#111110', background: '#f3f3f1', padding: '0.28rem 0.6rem', borderRadius: '999px' }}>
                                                    {badge}
                                                </span>
                                            ))}
                                        </div>
                                        <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.65, marginBottom: '0.95rem' }}>
                                            {getBrandShopReason(shop)}
                                        </p>
                                        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                                            <a href={shop.brand_url || shop.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#111110', fontWeight: 700 }}>
                                                このブランドを見る ↗
                                            </a>
                                            <Link href={`/shops/${shop.slug}`} style={{ textDecoration: 'none', color: '#64748b', fontWeight: 600 }}>
                                                比較情報 →
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                <section style={{ padding: '4rem clamp(1.5rem, 5vw, 4rem)', maxWidth: '1000px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '2.5rem' }}>
                        取り扱いショップ一覧（{availableShops.length}件）
                    </h2>

                    {availableShops.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                            {availableShops.map((shop) => (
                                <div key={shop.slug} style={{
                                    background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0',
                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', transition: 'all 0.3s', height: '100%',
                                    display: 'flex', flexDirection: 'column', position: 'relative'
                                }}>
                                    {/* 1. カード全体をショップ公式サイト（ブランドページ）へのリンクにする */}
                                    <a 
                                        href={shop.brand_url || shop.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}
                                        aria-label={`${shop.name}で${brand.name}を見る`}
                                    />

                                    <div style={{ aspectRatio: '16/9', background: '#f1f5f9', position: 'relative', overflow: 'hidden', zIndex: 0 }}>
                                        {shop.image_url ? (
                                            <Image
                                                src={shop.image_url}
                                                alt={shop.name}
                                                fill
                                                unoptimized
                                                sizes="(max-width: 1000px) 100vw, 320px"
                                                style={{ objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>No Image</div>
                                        )}
                                    </div>

                                    <div style={{ padding: '1.5rem', flex: 1, position: 'relative', zIndex: 0 }}>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.8rem' }}>
                                            {getBrandShopBadges(shop).map((badge) => (
                                                <span key={badge} style={{ fontSize: '0.72rem', fontWeight: 700, color: '#111110', background: '#f3f3f1', padding: '0.28rem 0.6rem', borderRadius: '999px' }}>
                                                    {badge}
                                                </span>
                                            ))}
                                        </div>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>{shop.name}</h3>
                                        <p style={{
                                            fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6,
                                            display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                                            marginBottom: '1rem'
                                        }}>
                                            {shop.description}
                                        </p>
                                        <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.6, marginTop: 'auto', marginBottom: 0 }}>
                                            {getBrandShopReason(shop)}
                                        </p>
                                    </div>

                                    <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', position: 'relative', zIndex: 2, pointerEvents: 'none' }}>
                                        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111110', textDecoration: 'none' }}>このショップで{brand.name}を見る ↗</span>
                                        <span style={{ fontSize: '0.82rem', color: '#64748b' }}>最終確認 {formatJapaneseDate(getLastVerifiedAt(shop)) || '未登録'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ padding: '4rem', textAlign: 'center', background: 'white', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                            <p style={{ color: '#64748b' }}>現在、このブランドの取り扱いショップは登録されていません。</p>
                        </div>
                    )}

                    <div style={{ marginTop: '3rem', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.4rem 1.5rem', background: '#fafaf9' }}>
                        <p style={{ marginTop: 0, marginBottom: '1rem', color: '#64748b', lineHeight: 1.7, fontSize: '0.92rem' }}>
                            この一覧はショップ探しの参考用です。送料・関税・配送可否は変わることがあるため、購入前に公式サイトの最新情報をご確認ください。
                        </p>
                        <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-brand)', marginBottom: '0.85rem' }}>
                            比較の前に読むと安心
                        </p>
                        <div style={{ display: 'grid', gap: '0.8rem' }}>
                            {CORE_GUIDE_LINKS.map((guide) => (
                                <Link key={guide.href} href={guide.href} style={{ textDecoration: 'none', color: '#0f172a', fontWeight: 600 }}>
                                    {guide.title} →
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                <Footer />
            </main>
        </>
    )
}
