import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const revalidate = 60 // 60秒間キャッシュを利用

export default async function ShopsPage(props: any) {
    const searchParams = await props.searchParams;
    const category = searchParams?.category;

    const categories = [
        { label: 'すべて', href: '/shops' },
        { label: 'ラグジュアリー・ハイブランド', href: '/shops?category=' + encodeURIComponent('ラグジュアリー・ハイブランド') },
        { label: 'ストリート・スニーカー', href: '/shops?category=' + encodeURIComponent('ストリート・スニーカー') },
        { label: 'スポーツ・アウトドア', href: '/shops?category=' + encodeURIComponent('スポーツ・アウトドア') },
        { label: '自転車・パーツ', href: '/shops?category=' + encodeURIComponent('自転車・パーツ') },
        { label: '韓国・アジアトレンド', href: '/shops?category=' + encodeURIComponent('韓国・アジアトレンド') },
        { label: 'コスメ・ビューティー', href: '/shops?category=' + encodeURIComponent('コスメ・ビューティー') },
    ]

    return (
        <>
            <Header />
            <main style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', minHeight: '100vh', background: '#f8fafc' }}>
                <style>{`
          .shop-card {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 20px;
            overflow: hidden;
            text-decoration: none;
            color: inherit;
            display: flex;
            flex-direction: column;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
            height: 100%;
          }
          .shop-card:hover {
            border-color: #111110;
            transform: translateY(-8px);
            box-shadow: 0 25px 50px -12px rgba(99, 102, 241, 0.15);
          }
          .cat-tab {
            padding: 0.6rem 1.6rem;
            border-radius: 9999px;
            text-decoration: none;
            font-size: 0.875rem;
            font-weight: 600;
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
            box-shadow: 0 4px 12px rgba(17, 17, 16, 0.15);
          }
          .cat-tab.inactive {
            background: #f1f1ef;
            color: #6b6b69;
          }
          .cat-tab.inactive:hover {
            background: #e5e5e0;
            color: #111110;
            transform: translateY(-2px) scale(1.02);
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: .5; }
          }
        `}</style>

                <section style={{
                    padding: 'clamp(8rem, 12vw, 10rem) clamp(1.5rem, 5vw, 4rem) 4rem',
                    background: '#fafaf9',
                    textAlign: 'center',
                    borderBottom: '1px solid #e2e8f0',
                }}>
                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 850,
                        letterSpacing: '-0.04em', color: '#111110', lineHeight: 1.1, marginBottom: '1.5rem',
                    }}>
                        ショップ一覧
                    </h1>

                    <div style={{
                        display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', maxWidth: '1000px', margin: '0 auto'
                    }}>
                        {categories.map((cat) => {
                            const isActive = (!category && cat.label === 'すべて') || (category === cat.label);
                            return (
                                <Link
                                    key={cat.label}
                                    href={cat.href}
                                    className={`cat-tab ${isActive ? 'active' : 'inactive'}`}
                                >
                                    {cat.label}
                                </Link>
                            );
                        })}
                    </div>
                </section>

                <section style={{ padding: '4rem clamp(1.5rem, 5vw, 4rem)', maxWidth: '1280px', margin: '0 auto' }}>
                    <Suspense fallback={
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 380px), 1fr))', gap: '2rem' }}>
                            {[1, 2, 3].map(i => (
                                <div key={i} style={{ height: '400px', background: '#f1f5f9', borderRadius: '20px', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
                            ))}
                        </div>
                    }>
                        <ShopList category={category} />
                    </Suspense>
                </section>
                <Footer />
            </main>
        </>
    )
}

async function ShopList({ category }: { category: string | string[] | undefined }) {
    // DBクエリの実行
    let query = supabase
        .from('shops')
        .select('id, name, slug, url, country, category, image_url, description, is_affiliate, ships_to_japan, popularity_score')
        .order('is_affiliate', { ascending: false })
        .order('ships_to_japan', { ascending: false })
        .order('popularity_score', { ascending: false })
        .order('name', { ascending: true })

    if (category) {
        const categoryValue = Array.isArray(category) ? category[0] : category;
        query = query.eq('category', categoryValue)
    }

    const { data: shops, error } = await query

    if (error) {
        return <div style={{ textAlign: 'center', padding: '5rem 0', color: '#ef4444' }}><p>読み込みエラーが発生しました</p></div>
    }

    if (!shops || shops.length === 0) {
        return <div style={{ textAlign: 'center', padding: '5rem 0' }}><p style={{ color: '#64748b' }}>該当するショップが見つかりませんでした。</p></div>
    }

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 380px), 1fr))',
            gap: '2rem',
        }}>
            {shops.map((shop) => (
                <div key={shop.id} className="shop-card">
                    <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: '#f1f5f9', position: 'relative', overflow: 'hidden' }}>
                        {shop.ships_to_japan === false && (
                            <div style={{
                                position: 'absolute', top: '10px', right: '10px',
                                background: 'rgba(239, 68, 68, 0.9)', color: 'white',
                                padding: '0.2rem 0.6rem', borderRadius: '6px',
                                fontSize: '0.7rem', fontWeight: 700, zIndex: 1,
                                backdropFilter: 'blur(4px)',
                            }}>直送不可</div>
                        )}
                        {shop.image_url ? (
                            <Image
                                src={shop.image_url}
                                alt={shop.name}
                                fill
                                style={{ objectFit: 'cover' }}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>🛍️</div>
                        )}
                    </div>

                    <div style={{ padding: '1.5rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#111110', background: 'rgba(17,17,16,0.06)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                                {shop.category}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>📍 {shop.country}</span>
                            <span style={{
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                color: shop.ships_to_japan === false ? '#ef4444' : '#10b981',
                                background: shop.ships_to_japan === false ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                padding: '0.2rem 0.6rem',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.2rem'
                            }}>
                                {shop.ships_to_japan === false ? '❌ 直送不可' : '✈️ 日本直送OK'}
                            </span>
                        </div>

                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>{shop.name}</h3>
                        <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6, marginBottom: '1.5rem', flexGrow: 1 }}>
                            {shop.description}
                        </p>

                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <a
                                href={shop.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    flex: 1,
                                    textAlign: 'center',
                                    background: '#0f172a',
                                    color: 'white',
                                    padding: '0.75rem',
                                    borderRadius: '12px',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    textDecoration: 'none'
                                }}
                            >
                                公式サイト
                            </a>
                            {shop.slug && (
                                <Link
                                    href={`/shops/${shop.slug}`}
                                    style={{
                                        flex: 1,
                                        textAlign: 'center',
                                        background: 'white',
                                        color: '#0f172a',
                                        padding: '0.75rem',
                                        borderRadius: '12px',
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        textDecoration: 'none',
                                        border: '1px solid #e2e8f0'
                                    }}
                                >
                                    解説ガイド
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
