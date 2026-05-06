import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { SHOP_CATEGORIES } from '@/lib/shopCategories'
import Breadcrumbs from '@/components/Breadcrumbs'

export const metadata: Metadata = {
    title: '海外通販サイト一覧 | 日本から安心・安く買える人気ショップ200選以上【完全版】',
    description: '日本発送に対応した世界中の有力海外通販サイトを一覧でまとめて紹介。ファッション、自転車、コスメ、アウトドア等、カテゴリー別に送料や関税の扱いを専門家が徹底調査。日本語ガイド付きで初めての個人輸入も安心です。',
    openGraph: {
        title: '海外通販サイト一覧 | Original Price',
        description: '専門家が厳選した日本から買える海外ショップ200選以上。関税・送料の不安を解消する詳細ガイド付き。',
    }
}

export const revalidate = 60 
export const dynamic = 'force-dynamic'

type ShopsPageProps = {
    searchParams?: Promise<{
        category?: string | string[]
    }>
}

function getSingleParam(value: string | string[] | undefined) {
    return Array.isArray(value) ? value[0] : value
}

function buildShopHref(categoryLabel: string) {
    const params = new URLSearchParams()
    if (categoryLabel !== 'すべて') {
        params.set('category', categoryLabel)
    }
    return params.toString() ? `/shops?${params.toString()}` : '/shops'
}

export default async function ShopsPage(props: ShopsPageProps) {
    const searchParams = await props.searchParams;
    const category = getSingleParam(searchParams?.category);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'CollectionPage',
                '@id': `https://original-price.com/shops${category ? `?category=${encodeURIComponent(category)}` : ''}#collection`,
                name: category ? `${category}の海外通販サイト一覧` : '海外通販サイト一覧',
                description: '日本発送に対応した世界中の有力海外通販サイトを一覧でまとめて紹介。',
                url: `https://original-price.com/shops${category ? `?category=${encodeURIComponent(category)}` : ''}`,
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
                    ...(category ? [{
                        '@type': 'ListItem',
                        position: 3,
                        name: category,
                        item: `https://original-price.com/shops?category=${encodeURIComponent(category)}`,
                    }] : []),
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
            <main style={{ fontFamily: 'var(--font-sans)', minHeight: '100vh', background: 'var(--bg)' }}>
                <style>{`
          .cat-tab {
            padding: 0.6rem 2rem;
            border-radius: 9999px;
            text-decoration: none;
            font-size: 0.875rem;
            font-weight: 700;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            white-space: nowrap;
            letter-spacing: -0.01em;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
          .cat-tab.active {
            background: #111110;
            color: #fafaf9;
            box-shadow: 0 4px 12px rgba(17, 17, 16, 0.2);
          }
          .cat-tab.inactive {
            background: #ffffff;
            color: var(--text-secondary);
            border: 1px solid var(--border);
          }
          .cat-tab.inactive:hover {
            border-color: #111110;
            background: #ffffff;
            color: #111110;
            transform: translateY(-2px);
          }
          .shop-card {
            background: white;
            border: 1px solid var(--border);
            border-radius: 20px;
            overflow: hidden;
            text-decoration: none;
            color: inherit;
            display: flex;
            flex-direction: column;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            position: relative;
            height: 100%;
          }
          .shop-card:hover {
            border-color: #111110;
            transform: translateY(-8px);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.12);
          }
        `}</style>

                <section style={{
                    padding: 'clamp(8rem, 12vw, 10rem) clamp(1.5rem, 5vw, 4rem) 4rem',
                    background: 'transparent',
                    textAlign: 'left',
                }}>
                    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        <Breadcrumbs items={[
                            { label: category ? 'カテゴリから探す' : 'ショップから探す', href: '/shops' },
                            ...(category ? [{ label: category }] : [])
                        ]} />
                        <div style={{ maxWidth: '800px', textAlign: 'center', margin: '0 auto' }}>
                            <h1 style={{
                                fontSize: 'clamp(2.5rem, 5vw, 4.2rem)', fontWeight: 850,
                                letterSpacing: '-0.04em', color: '#111110', lineHeight: 1.1, marginBottom: '1.2rem',
                            }}>
                                海外通販サイト一覧
                            </h1>
                            <p style={{ 
                                fontSize: 'clamp(0.9rem, 1.1vw, 1rem)', 
                                color: 'var(--text-muted)',
                                fontFamily: 'var(--font-serif)',
                                fontStyle: 'italic',
                                marginBottom: '4rem',
                                letterSpacing: '0.02em'
                            }}>
                                200+ premium merchants curated for your high-end shopping experience.
                            </p>
                        </div>

                        <div style={{
                            display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', maxWidth: '1000px', margin: '0 auto'
                        }}>
                            {SHOP_CATEGORIES.map((cat) => {
                                const isActive = (!category && cat.label === 'すべて') || (category === cat.label);
                                return (
                                    <Link
                                        key={cat.label}
                                        href={buildShopHref(cat.label)}
                                        className={`cat-tab ${isActive ? 'active' : 'inactive'}`}
                                    >
                                        {cat.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section style={{ padding: '0 clamp(1.5rem, 5vw, 4rem) 8rem', maxWidth: '1280px', margin: '0 auto' }}>
                    <Suspense fallback={
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 380px), 1fr))', gap: '2rem' }}>
                            {[1, 2, 3].map(i => (
                                <div key={i} style={{ height: '400px', background: '#ffffff', border: '1px solid var(--border)', borderRadius: '20px' }} />
                            ))}
                        </div>
                    }>
                        <ShopList category={category} />
                    </Suspense>

                    <div style={{ marginTop: '8rem', padding: '4rem 2rem', background: '#fafaf9', borderRadius: '40px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 850, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
                            お探しのショップが見つかりませんか？
                        </h2>
                        <p style={{ color: '#64748b', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
                            特定のブランドがどのショップで買えるか知りたい場合は、ブランド一覧から検索することも可能です。
                        </p>
                        <Link href="/brands" className="cat-tab active" style={{ padding: '1rem 3rem' }}>
                            ブランド一覧を見る
                        </Link>
                    </div>
                </section>

                <Footer />
            </main>
        </>
    );
}

async function ShopList({ category }: { category?: string }) {
    let query = supabase
        .from('shops')
        .select('*')
        .order('is_affiliate', { ascending: false })
        .order('popularity_score', { ascending: false })

    if (category && category !== 'すべて') {
        query = query.eq('category', category)
    }

    const { data: shops } = await query

    if (!shops || shops.length === 0) {
        return <div style={{ textAlign: 'center', padding: '4rem' }}>ショップが見つかりませんでした。</div>
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 380px), 1fr))', gap: '2.5rem' }}>
            {shops.map((shop) => (
                <Link key={shop.slug} href={`/shops/${shop.slug}`} className="shop-card">
                    <div style={{ 
                        aspectRatio: '16/9', 
                        background: '#f1f5f9', 
                        position: 'relative', 
                        overflow: 'hidden' 
                    }}>
                        {!shop.ships_to_japan && (
                            <div style={{
                                position: 'absolute', top: '10px', right: '10px',
                                background: 'rgba(239, 68, 68, 0.9)', color: 'white',
                                padding: '0.2rem 0.6rem', borderRadius: '6px',
                                fontSize: '0.7rem', fontWeight: 700, zIndex: 2,
                                backdropFilter: 'blur(4px)',
                            }}>直送不可</div>
                        )}
                        {shop.image_url ? (
                                <Image
                                    src={shop.image_url}
                                    alt={shop.name}
                                    fill
                                    unoptimized
                                    style={{ objectFit: 'cover' }}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>🛍️</div>
                        )}
                    </div>
                    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.05em' }}>
                                {shop.category}
                            </span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>
                                {shop.country}
                            </span>
                        </div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111110', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
                            {shop.name}
                        </h2>
                        <p style={{ 
                            fontSize: '0.9rem', 
                            color: '#64748b', 
                            lineHeight: 1.6,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            marginBottom: '1rem'
                        }}>
                            {shop.description}
                        </p>
                        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#111110' }}>VIEW DETAILS</span>
                            <span style={{ fontSize: '1rem' }}>→</span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}
