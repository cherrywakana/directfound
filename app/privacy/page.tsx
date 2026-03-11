import Header from '@/components/Header'
import Footer from '@/components/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'プライバシーポリシー - Direct Found',
    description: 'Direct Foundのプライバシーポリシー、免責事項、Cookie利用方針について。',
}

export default function PrivacyPage() {
    const sections = [
        {
            title: '個人情報の取り扱い',
            paragraphs: [
                '当サイト（Direct Found、以下「当サイト」）は、ユーザーの個人情報を適切に管理し、保護することに努めています。',
                '当サイトでは、お問い合わせフォーム等を通じてお名前やメールアドレスなどの個人情報をご提供いただく場合があります。取得した個人情報は、お問い合わせへの回答やサービスの改善目的にのみ使用し、ご本人の同意なく第三者に提供することはありません。',
            ],
        },
        {
            title: 'アクセス解析ツール',
            paragraphs: [
                '当サイトでは、Googleが提供するアクセス解析ツール「Google Analytics」を使用している場合があります。Google Analyticsはトラフィックデータの収集のためにCookieを使用しますが、このデータは匿名で収集されており、個人を特定するものではありません。',
                'Cookieの使用を無効にすることで、データの収集を拒否することができます。お使いのブラウザの設定をご確認ください。Google Analyticsの利用規約については、Google Analyticsサービス利用規約をご参照ください。',
            ],
        },
        {
            title: 'アフィリエイトプログラム',
            paragraphs: [
                '当サイトは、アフィリエイトプログラムに参加しています。当サイトに掲載されているリンクの一部はアフィリエイトリンクとなっており、リンクを経由して商品を購入された場合、当サイトが報酬を受け取ることがあります。',
                'アフィリエイトリンクの利用によって、お客様の購入価格が変動することは一切ありません。アフィリエイト報酬は、当サイトの運営・コンテンツ制作費用に充てられています。',
                'なお、アフィリエイト報酬の有無が、掲載ショップの評価やランキングに影響を与えることはありません。掲載基準は、日本への発送対応、信頼性、ユーザーにとっての利便性に基づいています。',
            ],
        },
        {
            title: '免責事項',
            paragraphs: [
                '当サイトに掲載されている情報は、可能な限り正確な情報を提供するよう努めていますが、正確性や安全性を保証するものではありません。',
                '当サイトに掲載されている商品の価格、在庫状況、送料、関税等は、各ショップの方針変更や為替変動等により予告なく変更される場合があります。最新の情報は、必ず各ショップの公式サイトにてご確認ください。',
                '当サイトのリンク先である外部サイトでのトラブルや損害について、当サイトは一切の責任を負いかねます。海外通販のご利用はすべてお客様ご自身の責任と判断のもとで行ってください。',
            ],
        },
        {
            title: '著作権',
            paragraphs: [
                '当サイトに掲載されているテキスト、画像、デザイン等のコンテンツの著作権は、当サイトまたは正当な権利を有する第三者に帰属します。無断転載・複製を禁じます。',
                '各ショップのロゴ、商品画像、ブランド名等は、それぞれの権利者に帰属します。',
            ],
        },
        {
            title: 'プライバシーポリシーの変更',
            paragraphs: [
                '当サイトは、必要に応じて本プライバシーポリシーの内容を予告なく変更することがあります。変更後のプライバシーポリシーは、当ページに掲載した時点から効力を生じるものとします。',
            ],
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
                            プライバシーポリシー
                        </h1>
                        <p style={{ fontSize: '1.125rem', color: '#64748b', lineHeight: 1.6 }}>
                            個人情報の取り扱い・免責事項
                        </p>
                    </div>
                </section>

                {/* Content */}
                <section style={{ padding: '4rem clamp(1.5rem, 5vw, 4rem)', maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gap: '2rem' }}>
                        {sections.map((section, index) => (
                            <div key={section.title} style={{
                                background: 'white', borderRadius: '20px', padding: 'clamp(1.5rem, 3vw, 2.5rem)',
                                border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
                            }}>
                                <h2 style={{
                                    fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem',
                                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                                }}>
                                    <span style={{
                                        width: '28px', height: '28px', borderRadius: '8px',
                                        background: '#111110',
                                        color: 'white', fontSize: '0.75rem', fontWeight: 700,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                    }}>
                                        {index + 1}
                                    </span>
                                    {section.title}
                                </h2>

                                <div style={{ display: 'grid', gap: '0.85rem' }}>
                                    {section.paragraphs.map((p, i) => (
                                        <p key={i} style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.9, margin: 0 }}>
                                            {p}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Last updated */}
                    <p style={{
                        textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem',
                        marginTop: '3rem',
                    }}>
                        最終更新日: 2026年3月10日
                    </p>
                </section>

                <Footer />
            </main>
        </>
    )
}
