import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: '運営者情報 - Direct Found',
    description: 'Direct Foundの運営方針、掲載基準、アフィリエイトプログラムについて。日本への直送に対応した信頼できる海外通販サイトだけを厳選して紹介しています。',
}

export default function AboutPage() {
    const sections = [
        {
            icon: '🎯',
            title: 'サイトの目的',
            content: 'Direct Foundは、日本から安心して利用できる海外通販サイトの情報を提供するガイドサイトです。海外通販に興味があっても「関税はどうなるの？」「ちゃんと届くの？」といった不安を解消し、世界中のショッピングをもっと身近なものにすることを目指しています。',
        },
        {
            icon: '✅',
            title: '掲載基準',
            items: [
                '日本への直送（国際発送）に対応していること',
                '実在するショップであり、現在も正常に運営されていること',
                '一定の信頼性・実績があること（レビュー、運営歴など）',
                '定期的にURLの生存確認・情報の正確性チェックを実施',
            ],
        },
        {
            icon: '🤝',
            title: 'アフィリエイトプログラムについて',
            content: '当サイトは、アフィリエイトプログラムに参加しています。当サイトのリンクを経由してお買い物をされた場合、当サイトがアフィリエイト報酬を受け取ることがあります。なお、これによりお客様の購入価格が変わることはありません。アフィリエイト報酬は、サイトの運営・改善費用に充てています。',
        },
        {
            icon: '📧',
            title: 'お問い合わせ',
            content: 'サイトに関するお問い合わせ、掲載情報の修正依頼、新しいショップの掲載リクエストなどがございましたら、お気軽にご連絡ください。',
            email: 'contact@directfound.com',
        },
    ]

    return (
        <>
            <Header />
            <main style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', background: '#f8fafc', minHeight: '100vh' }}>

                {/* Hero Section */}
                <section style={{
                    padding: 'clamp(8rem, 12vw, 10rem) clamp(1.5rem, 5vw, 4rem) 4rem',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f7ff 40%, #ede9fe 100%)',
                    textAlign: 'center',
                    borderBottom: '1px solid #e2e8f0',
                }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <h1 style={{
                            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 850,
                            letterSpacing: '-0.04em', color: '#0f172a', lineHeight: 1.1, marginBottom: '1.5rem',
                        }}>
                            運営者情報
                        </h1>
                        <p style={{ fontSize: '1.125rem', color: '#64748b', lineHeight: 1.6 }}>
                            Direct Foundについて
                        </p>
                    </div>
                </section>

                {/* Content */}
                <section style={{ padding: '4rem clamp(1.5rem, 5vw, 4rem)', maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gap: '2rem' }}>
                        {sections.map((section) => (
                            <div key={section.title} style={{
                                background: 'white', borderRadius: '20px', padding: 'clamp(1.5rem, 3vw, 2.5rem)',
                                border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                                    <span style={{ fontSize: '1.75rem' }}>{section.icon}</span>
                                    <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{section.title}</h2>
                                </div>

                                {section.content && (
                                    <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.85 }}>
                                        {section.content}
                                    </p>
                                )}

                                {section.items && (
                                    <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '0.75rem' }}>
                                        {section.items.map((item) => (
                                            <li key={item} style={{
                                                fontSize: '0.95rem', color: '#475569', lineHeight: 1.75,
                                                display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
                                            }}>
                                                <span style={{ color: '#111110', fontWeight: 700, flexShrink: 0 }}>✓</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {section.email && (
                                    <p style={{ marginTop: '1rem' }}>
                                        <a href={`mailto:${section.email}`} style={{
                                            color: '#111110', fontWeight: 600, textDecoration: 'none',
                                            fontSize: '0.95rem',
                                        }}>
                                            {section.email}
                                        </a>
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Bottom CTA */}
                    <div style={{
                        marginTop: '4rem', padding: '2.5rem', background: '#0f172a',
                        borderRadius: '20px', textAlign: 'center', color: 'white',
                    }}>
                        <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem' }}>ショップを探してみませんか？</h3>
                        <p style={{ color: '#94a3b8', marginBottom: '2rem', fontSize: '0.95rem' }}>
                            日本から利用できる海外通販サイトを厳選して紹介しています。
                        </p>
                        <Link href="/shops" style={{
                            display: 'inline-block', background: 'white', color: '#0f172a',
                            padding: '0.85rem 2.25rem', borderRadius: '999px',
                            textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem', transition: 'transform 0.2s',
                        }}>
                            ショップ一覧へ →
                        </Link>
                    </div>
                </section>

                <Footer />
            </main>
        </>
    )
}
