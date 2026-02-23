import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Link from 'next/link'

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

    if (!shop) return (
        <>
            <Header />
            <main style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', padding: 'clamp(8rem, 12vw, 10rem) clamp(1.5rem, 5vw, 4rem)', minHeight: '100vh', background: '#f8fafc' }}>
                <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>ショップが見つかりません。</p>
                <Link href="/shops" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>← ショップ一覧に戻る</Link>
            </main>
        </>
    )

    return (
        <>
            <Header />
            <main style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', background: 'white' }}>
                <style>{`
          .back-link { color: #6366f1; text-decoration: none; font-weight: 500; font-size: 0.875rem; transition: opacity 0.2s; }
          .back-link:hover { opacity: 0.7; }
          
          .info-card {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 2rem;
            margin-bottom: 2rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
            transition: transform 0.3s ease;
          }
          .info-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
          }
          
          .info-icon {
            font-size: 2rem;
            margin-bottom: 1rem;
            display: inline-block;
            background: #f8f7ff;
            padding: 1rem;
            border-radius: 12px;
          }

          .info-title {
            font-size: 1.25rem;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .info-body {
            font-size: 1rem;
            color: #334155;
            line-height: 1.8;
          }

          /* CTA Button */
          .article-cta {
            margin-top: 4rem;
            margin-bottom: 2rem;
            text-align: center;
            padding: 3rem;
            background: linear-gradient(135deg, #f8f7ff 0%, #ede9fe 100%);
            border-radius: 24px;
            border: 1px solid rgba(99,102,241,0.15);
          }
          .article-cta-btn {
            display: inline-block;
            background-color: #0a0a0a;
            color: #ffffff;
            padding: 1.2rem 3rem;
            border-radius: 9999px;
            font-weight: 600;
            text-decoration: none;
            letter-spacing: 0.05em;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            font-size: 1.1rem;
          }
          .article-cta-btn:hover {
            background-color: #333333;
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          }
        `}</style>

                {/* Hero */}
                <section style={{
                    padding: 'clamp(8rem, 12vw, 10rem) clamp(1.5rem, 5vw, 4rem) clamp(3rem, 6vw, 5rem)',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f7ff 40%, #ede9fe 100%)',
                    borderBottom: '1px solid #e2e8f0'
                }}>
                    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'center' }}>

                        <div style={{ flex: '1 1 min(400px, 100%)' }}>
                            <Link href="/shops" className="back-link" style={{ display: 'inline-block', marginBottom: '2rem' }}>← ショップ一覧に戻る</Link>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                                {shop.category && (
                                    <span style={{
                                        fontSize: '0.8rem', fontWeight: 600, color: '#6366f1',
                                        background: 'rgba(99,102,241,0.1)', padding: '0.3rem 1rem',
                                        borderRadius: '100px',
                                    }}>{shop.category}</span>
                                )}
                                {shop.country && (
                                    <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>
                                        📍 {shop.country}発祥
                                    </span>
                                )}
                            </div>

                            <h1 style={{
                                fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800,
                                letterSpacing: '-0.03em', color: '#0f172a', lineHeight: 1.2,
                                marginBottom: '1.5rem'
                            }}>{shop.name}</h1>

                            <p style={{
                                fontSize: '1.1rem', color: '#475569', lineHeight: 1.8,
                            }}>
                                {shop.description}
                            </p>
                        </div>

                        {shop.image_url && (
                            <div style={{
                                flex: '1 1 300px',
                                borderRadius: '24px',
                                overflow: 'hidden',
                                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
                                aspectRatio: '16/9',
                                backgroundColor: '#f1f5f9'
                            }}>
                                <img
                                    src={shop.image_url}
                                    alt={shop.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                        )}

                    </div>
                </section>

                {/* Content Details */}
                <section style={{ padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem)' }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>

                        <div className="info-card">
                            <div className="info-title">
                                <span style={{ fontSize: '1.5rem' }}>✈️</span>
                                日本へ直送可能か
                            </div>
                            <div className="info-body">
                                {shop.shipping_guide || '現在、情報が登録されていません。公式サイトをご確認ください。'}
                                {shop.shipping_url && (
                                    <div style={{ marginTop: '0.75rem' }}>
                                        <a href={shop.shipping_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem', color: '#6366f1', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontWeight: 500 }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                                            公式サイトのエビデンスを見る
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="info-card">
                            <div className="info-title">
                                <span style={{ fontSize: '1.5rem' }}>📝</span>
                                関税は込みか
                            </div>
                            <div className="info-body">
                                {shop.tax_guide || '現在、情報が登録されていません。公式サイトをご確認ください。'}
                                {shop.tax_url && (
                                    <div style={{ marginTop: '0.75rem' }}>
                                        <a href={shop.tax_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem', color: '#6366f1', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontWeight: 500 }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                                            公式の関税ルールを見る
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="info-card">
                            <div className="info-title">
                                <span style={{ fontSize: '1.5rem' }}>📦</span>
                                送料の目安
                            </div>
                            <div className="info-body">
                                {shop.fee_guide || '現在、情報が登録されていません。公式サイトをご確認ください。'}
                                {shop.fee_url && (
                                    <div style={{ marginTop: '0.75rem' }}>
                                        <a href={shop.fee_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem', color: '#6366f1', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontWeight: 500 }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                                            公式の配送料金・日数を見る
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="article-cta">
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: '#0f172a' }}>
                                さっそく海外通販を楽しんでみましょう
                            </h3>
                            <a href={shop.url} target="_blank" rel="noopener noreferrer" className="article-cta-btn">
                                {shop.name} 公式サイトを見る →
                            </a>
                        </div>

                    </div>
                </section>

                {/* Footer */}
                <footer style={{
                    padding: 'clamp(2rem, 4vw, 3rem) clamp(1.5rem, 5vw, 4rem)',
                    background: '#0f172a',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontSize: '1rem', fontWeight: 700, color: 'white' }}>ShipTo</span>
                        <span style={{ fontSize: '1rem', fontWeight: 700, background: 'linear-gradient(135deg, #818cf8, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>JP</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#475569' }}>© {new Date().getFullYear()} ShipToJP. All rights reserved.</p>
                </footer>
            </main>
        </>
    )
}
