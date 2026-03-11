import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: '取り扱いブランド一覧 - Direct Found',
    description: 'Direct Foundで紹介している海外通販サイトで取り扱いのあるブランド一覧です。欲しいブランドがどこのショップで買えるか探せます。',
}

export const revalidate = 3600 // 1時間ごとに更新

export default async function BrandsPage() {
    const { data: brands } = await supabase
        .from('brands')
        .select('id, name, slug')
        .order('name', { ascending: true })

    // アルファベット順（A-Z, その他）でグループ化
    const groupedBrands: { [key: string]: typeof brands } = {}

    brands?.forEach(brand => {
        const firstChar = brand.name.charAt(0).toUpperCase()
        const key = /^[A-Z]$/.test(firstChar) ? firstChar : '#'
        if (!groupedBrands[key]) groupedBrands[key] = []
        groupedBrands[key].push(brand)
    })

    const keys = Object.keys(groupedBrands).sort((a, b) => {
        if (a === '#') return 1
        if (b === '#') return -1
        return a.localeCompare(b)
    })

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
                            ブランド一覧
                        </h1>
                        <p style={{ fontSize: '1.125rem', color: '#64748b', lineHeight: 1.6 }}>
                            お気に入りのブランドを取り扱うショップを探す
                        </p>
                    </div>
                </section>

                {/* Brand Index (Alphabetical) */}
                <section style={{ padding: '4rem clamp(1.5rem, 5vw, 4rem)', maxWidth: '1000px', margin: '0 auto' }}>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '3rem', justifyContent: 'center' }}>
                        {keys.map(key => (
                            <a key={key} href={`#section-${key}`} style={{
                                width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px',
                                textDecoration: 'none', color: '#111110', fontWeight: 600, fontSize: '0.9rem',
                                transition: 'all 0.2s',
                            }}>
                                {key}
                            </a>
                        ))}
                    </div>

                    <div style={{ display: 'grid', gap: '4rem' }}>
                        {keys.map(key => (
                            <div key={key} id={`section-${key}`}>
                                <h2 style={{
                                    fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem',
                                    borderBottom: '2px solid #111110', display: 'inline-block', paddingRight: '1rem'
                                }}>
                                    {key}
                                </h2>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                                    gap: '1rem'
                                }}>
                                    {groupedBrands[key]?.map(brand => (
                                        <Link key={brand.id} href={`/brands/${brand.slug}`} style={{
                                            textDecoration: 'none', color: '#475569', fontSize: '1rem',
                                            padding: '0.5rem 1rem', background: 'white', borderRadius: '8px',
                                            border: '1px solid #e2e8f0', transition: 'all 0.2s',
                                            fontWeight: 500,
                                        }}>
                                            {brand.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <Footer />
            </main>
        </>
    )
}
