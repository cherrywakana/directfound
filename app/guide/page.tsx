'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function GuidePage() {
    const sections = [
        {
            title: '基礎知識',
            icon: '📚',
            articles: [
                { title: '海外通販とは？国内通販との違いと基本的な仕組み', slug: 'what-is-overseas-shopping' },
                { title: '海外通販で失敗しないための7つの注意点', slug: 'overseas-shopping-tips' },
                { title: '海外通販の関税とは？計算方法と支払いタイミングを解説', slug: 'overseas-shopping-customs-tax' },
                { title: '海外通販の送料の仕組み｜DDPとDDUの違いをわかりやすく解説', slug: 'overseas-shopping-ddp-ddu' },
                { title: '海外通販で使えるクレジットカードの選び方', slug: 'overseas-shopping-credit-card' },
            ]
        },
        {
            title: 'はじめての海外通販',
            icon: '🌱',
            articles: [
                { title: '海外通販 初めてガイド｜アカウント作成から商品到着までの流れ', slug: 'overseas-shopping-beginners-guide' },
                { title: '海外通販のサイズ選び｜US・EU・UKサイズの早見表', slug: 'overseas-shopping-size-guide' },
                { title: '海外通販の支払い方法まとめ｜クレジットカード・PayPal・海外決済サービス', slug: 'overseas-shopping-payment-methods' },
                { title: '海外通販の返品・交換のやり方｜英語メールのテンプレートつき', slug: 'overseas-shopping-returns' },
            ]
        },
        {
            title: 'トラブル対応・Q&A',
            icon: '🛡️',
            articles: [
                { title: '海外通販で届かない場合の対処法', slug: 'overseas-shopping-not-delivered' },
                { title: '海外通販で偽物をつかまないための見分け方', slug: 'overseas-shopping-avoid-fakes' },
                { title: '海外通販の関税が高すぎた場合はどうする？', slug: 'overseas-shopping-customs-too-high' },
            ]
        }
    ]

    return (
        <>
            <Header />
            <main style={{ fontFamily: 'var(--font-sans)', background: 'var(--bg)', minHeight: '100vh' }}>

                {/* Hero Section */}
                <section style={{
                    padding: 'clamp(8rem, 12vw, 10rem) clamp(1.5rem, 5vw, 4rem) 4rem',
                    background: '#fafaf9',
                    textAlign: 'center',
                    borderBottom: '1px solid #e5e5e3',
                }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <h1 style={{
                            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800,
                            letterSpacing: '-0.04em', color: '#111110', lineHeight: 1.1, marginBottom: '1.5rem',
                            fontFamily: 'var(--font-serif)',
                        }}>
                            海外通販ガイド
                        </h1>
                        <p style={{ fontSize: '1rem', color: '#6b6b69', lineHeight: 1.6 }}>
                            初めての海外通販でも安心して楽しめるよう、<br />知っておきたい基礎知識やコツを分かりやすくまとめました。
                        </p>
                    </div>
                </section>

                {/* Guide Content */}
                <section style={{ padding: '4rem clamp(1.5rem, 5vw, 4rem)', maxWidth: '900px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gap: '3rem' }}>
                        {sections.map((section) => (
                            <div key={section.title} style={{ background: 'white', borderRadius: '24px', padding: '2.5rem', border: '1px solid #e5e5e3', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                    <span style={{ fontSize: '2rem' }}>{section.icon}</span>
                                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111110', margin: 0, fontFamily: 'var(--font-serif)' }}>{section.title}</h2>
                                </div>
 
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    {section.articles.map((article) => (
                                        <Link
                                            key={article.slug}
                                            href={`/articles/${article.slug}`}
                                            style={{
                                                textDecoration: 'none',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.75rem',
                                                color: '#333332',
                                                fontSize: '1rem',
                                                fontWeight: 500,
                                                padding: '0.5rem 0',
                                                transition: 'color 0.2s',
                                            }}
                                            className="guide-link"
                                        >
                                            <span style={{ color: 'var(--accent-brand)', fontSize: '1.2rem' }}>•</span>
                                            {article.title}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '5rem', padding: '3.5rem clamp(1.5rem, 5vw, 3rem)', background: '#111110', borderRadius: '24px', textAlign: 'center', color: 'white' }}>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>お探しの情報はありましたか？</h3>
                        <p style={{ color: '#a1a19f', marginBottom: '2.5rem', fontSize: '0.95rem' }}>ブランド別の個別ガイドは、各ショップ詳細ページからもご確認いただけます。</p>
                        <Link href="/shops" style={{
                            display: 'inline-block', background: 'white', color: '#111110', padding: '0.85rem 2.5rem', borderRadius: '8px',
                            textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem', transition: 'all 0.2s'
                        }} className="guide-footer-btn">
                            ショップ一覧へ戻る
                        </Link>
                    </div>
                    <style>{`
                        .guide-link:hover { color: var(--accent-brand) !important; }
                        .guide-footer-btn:hover { background: #e8e8e6 !important; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.3); }
                    `}</style>
                </section>
                <Footer />
            </main>
        </>
    )
}
