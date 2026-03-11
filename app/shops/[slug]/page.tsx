import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
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
                <Link href="/shops" style={{ color: '#111110', textDecoration: 'none', fontWeight: 600 }}>← ショップ一覧に戻る</Link>
            </main>
        </>
    )

    return (
        <>
            <Header />
            <main style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', background: 'white' }}>
                <style>{`
          .back-link { color: #111110; text-decoration: none; font-weight: 500; font-size: 0.875rem; transition: opacity 0.2s; }
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
            margin-top: 3rem;
            margin-bottom: 2rem;
            text-align: center;
            padding: 2rem 1.5rem;
            background: linear-gradient(135deg, #f8f7ff 0%, #ede9fe 100%);
            border-radius: 24px;
            border: 1px solid rgba(99,102,241,0.15);
          }
          .article-cta-btn {
            display: inline-block;
            background-color: #0a0a0a;
            color: #ffffff;
            padding: 0.85rem 2rem;
            border-radius: 9999px;
            font-weight: 600;
            text-decoration: none;
            letter-spacing: 0.05em;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            font-size: 1rem;
            line-height: 1.4;
            max-width: 100%;
            white-space: normal;
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
                                        fontSize: '0.8rem', fontWeight: 600, color: '#111110',
                                        background: 'rgba(17,17,16,0.06)', padding: '0.3rem 1rem',
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

                            {shop.ships_to_japan === false && (
                                <div style={{
                                    background: '#fff7ed',
                                    border: '1px solid #fed7aa',
                                    borderRadius: '12px',
                                    padding: '1rem',
                                    marginBottom: '1.5rem',
                                    display: 'flex',
                                    gap: '0.75rem',
                                    alignItems: 'flex-start',
                                }}>
                                    <span style={{ fontSize: '1.25rem' }}>⚠️</span>
                                    <div>
                                        <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#9a3412', marginBottom: '0.25rem' }}>日本への直接発送に未対応の可能性があります</p>
                                        <p style={{ fontSize: '0.85rem', color: '#c2410c', lineHeight: 1.5 }}>
                                            このショップは現在、日本への直接発送に対応していない、または制限がある可能性があります。最新の配送ポリシーは必ず公式サイトでご確認ください。
                                        </p>
                                    </div>
                                </div>
                            )}

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

                        <div className="info-card" style={{
                            background: shop.ships_to_japan === false ? '#fffcf0' : 'white',
                            border: shop.ships_to_japan === false ? '1px solid #fde68a' : '1px solid #e2e8f0'
                        }}>
                            <div className="info-title">
                                <span style={{ fontSize: '1.5rem' }}>✈️</span>
                                日本へ直送可能か
                            </div>
                            <div className="info-body">
                                {shop.ships_to_japan === false ? (
                                    <strong style={{ color: '#b45309' }}>直送不可の可能性があります。公式情報を必ずご確認ください。</strong>
                                ) : (
                                    shop.shipping_guide || '現在、情報が登録されていません。公式サイトをご確認ください。'
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
                            </div>
                        </div>

                        <div className="info-card">
                            <div className="info-title">
                                <span style={{ fontSize: '1.5rem' }}>📦</span>
                                送料の目安
                            </div>
                            <div className="info-body">
                                {shop.fee_guide || '現在、情報が登録されていません。公式サイトをご確認ください。'}
                            </div>
                        </div>

                        <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1rem', fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6 }}>
                            <strong style={{ color: '#475569', display: 'block', marginBottom: '0.25rem' }}>⚠️ ご注意・免責事項</strong>
                            掲載されている情報は調査時点のものです。配送や関税に関する最新の正確なルールは、ご自身で必ず公式サイトをご確認ください。
                        </div>

                        <div className="article-cta">
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', color: '#0f172a' }}>
                                さっそく海外通販を楽しんでみましょう
                            </h3>
                            <a href={shop.url} target="_blank" rel="noopener noreferrer" className="article-cta-btn">
                                公式サイトへアクセスする →
                            </a>
                        </div>

                    </div>
                </section>

                <Footer />
            </main>
        </>
    )
}
