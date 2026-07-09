import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: '海外通販ガイド | 初心者向けカテゴリ別おすすめ記事一覧',
    description: '海外通販の基礎知識から、ファッション・アウトドア・スニーカー・ウイスキーまで。カテゴリ別におすすめガイドをまとめています。',
    alternates: {
        canonical: '/guide',
    },
    openGraph: {
        title: '海外通販ガイド | Original Price',
        description: '海外通販の基礎知識からカテゴリ別のおすすめ記事まで、迷ったときの入口ページです。',
        url: 'https://original-price.com/guide',
        type: 'website',
    },
}

export default function GuidePage() {
    const sections = [
        {
            title: '人気カテゴリ別ガイド',
            icon: '📚',
            articles: [
                { title: '海外ファッション通販サイトおすすめ25選', slug: 'overseas-fashion-shopping-ultimate-guide' },
                { title: '海外スニーカーサイトおすすめ12選', slug: 'fashionshop/sneakers/list' },
                { title: '海外プチプラファッション通販おすすめ10選', slug: 'overseas-shopping-petite-price-list' },
                { title: '海外メンズファッション通販おすすめ11選', slug: 'mens-fashion-overseas-guide' },
                { title: '海外通販レディースファッションおすすめ12選', slug: 'ladies-fashion-overseas-guide' },
            ]
        },
        {
            title: 'ジャンル特化ガイド',
            icon: '🌱',
            articles: [
                { title: '海外通販サイトのアウトドアおすすめ8選', slug: 'overseas-outdoor-shops-guide' },
                { title: '自転車・ロードバイク海外通販おすすめ9選', slug: 'overseas-cycling-shopping-guide-2026' },
                { title: '海外インテリア通販おすすめ9選', slug: 'interior-furniture-overseas-guide' },
                { title: 'ウイスキー個人輸入おすすめ8選', slug: 'whisky-overseas-shopping-guide' },
                { title: 'タブレットを海外通販で安く買う方法', slug: 'tablet-electronics-overseas-guide' },
            ]
        },
        {
            title: 'ブランド別の人気ガイド',
            icon: '🛡️',
            articles: [
                { title: 'Nikeが安い海外通販サイト21選', slug: 'nike-overseas-shopping-guide' },
                { title: 'New Balanceが安い海外通販サイト19選', slug: 'new-balance-overseas-shopping-guide' },
                { title: "Arc'teryxが安い海外通販サイトおすすめ5選", slug: 'arcteryx-overseas-shopping-guide' },
                { title: 'Patagoniaが安い海外通販サイト14選', slug: 'patagonia-overseas-shopping-guide' },
                { title: 'Adidasが安い海外通販サイト23選', slug: 'adidas-overseas-shopping-guide' },
            ]
        }
    ]

    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'CollectionPage',
                '@id': 'https://original-price.com/guide#collection',
                name: '海外通販ガイド',
                description: '海外通販の基礎知識から、カテゴリ別のおすすめガイドまでまとめた案内ページです。',
                url: 'https://original-price.com/guide',
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
                        name: '海外通販ガイド',
                        item: 'https://original-price.com/guide',
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
                                            href={article.slug.includes('/') ? `/${article.slug}` : `/articles/${article.slug}`}
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
