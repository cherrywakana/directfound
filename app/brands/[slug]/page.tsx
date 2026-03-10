import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const { data: brand } = await supabase.from('brands').select('name').eq('slug', slug).single()

    return {
        title: `${brand?.name || 'ブランド'}が買える海外通販サイト一覧 - Direct Found`,
        description: `${brand?.name || 'ブランド'}を取り扱っている、日本発送対応の海外通販サイトを厳選。送料や関税の情報もまとめています。`,
    }
}

export default async function BrandDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params

    // 1. ブランド情報の取得
    const { data: brand } = await supabase
        .from('brands')
        .select('*')
        .eq('slug', slug)
        .single()

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

    // 2. そのブランドを取り扱うショップを取得
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
        is_affiliate
      )
    `)
        .eq('brand_id', brand.id)
        .eq('status', 'found')

    const availableShops = shopBrands?.map((sb: any) => ({
        ...sb.shops,
        brand_url: sb.brand_url
    })) || []

    return (
        <>
            <Header />
            <main style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', background: '#f8fafc', minHeight: '100vh' }}>

                {/* Header Section */}
                <section style={{
                    padding: 'clamp(8rem, 12vw, 10rem) clamp(1.5rem, 5vw, 4rem) 4rem',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f7ff 40%, #ede9fe 100%)',
                    borderBottom: '1px solid #e2e8f0',
                }}>
                    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        <Link href="/brands" style={{ color: '#6366f1', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, display: 'inline-block', marginBottom: '2rem' }}>
                            ← ブランド一覧へ戻る
                        </Link>
                        <h1 style={{
                            fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 850,
                            letterSpacing: '-0.04em', color: '#0f172a', lineHeight: 1.1, marginBottom: '1rem',
                        }}>
                            {brand.name}
                        </h1>
                        <p style={{ fontSize: '1.125rem', color: '#64748b', lineHeight: 1.6, maxWidth: '600px' }}>
                            {brand.name}（{brand.name}）を日本から買える、おすすめの海外通販サイトを厳選しました。
                        </p>
                    </div>
                </section>

                {/* Shop List */}
                <section style={{ padding: '4rem clamp(1.5rem, 5vw, 4rem)', maxWidth: '1000px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '2.5rem' }}>
                        取り扱いショップ一覧（{availableShops.length}件）
                    </h2>

                    {availableShops.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                            {availableShops.map((shop: any) => (
                                <a key={shop.slug} href={shop.brand_url || shop.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div style={{
                                        background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0',
                                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', transition: 'all 0.3s', height: '100%',
                                        display: 'flex', flexDirection: 'column'
                                    }}>
                                        <div style={{ aspectRatio: '16/9', background: '#f1f5f9', position: 'relative', overflow: 'hidden' }}>
                                            {shop.image_url ? (
                                                <img src={shop.image_url} alt={shop.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>No Image</div>
                                            )}
                                        </div>
                                        <div style={{ padding: '1.5rem', flex: 1 }}>
                                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>{shop.name}</h3>
                                            <p style={{
                                                fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6,
                                                display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                                            }}>
                                                {shop.description}
                                            </p>
                                        </div>
                                        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.4rem' }}>
                                            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#6366f1' }}>ショップへ移動</span>
                                            <span style={{ fontSize: '0.75rem' }}>↗️</span>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <div style={{ padding: '4rem', textAlign: 'center', background: 'white', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                            <p style={{ color: '#64748b' }}>現在、このブランドの取り扱いショップは登録されていません。</p>
                        </div>
                    )}
                </section>

                <Footer />
            </main>
        </>
    )
}
