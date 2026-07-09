import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'
import { formatJapaneseDate } from '@/lib/utils'

export const revalidate = 60 // Revalidate cache every 60 seconds

export const metadata: Metadata = {
    title: '海外通販マガジン | ブランド情報と個人輸入ガイド記事一覧',
    description: '海外通販の始め方、ブランド別の買い方、送料や関税の考え方まで。Original Priceの解説記事を一覧で読めます。',
    alternates: {
        canonical: '/articles',
    },
    openGraph: {
        title: '海外通販マガジン | Original Price',
        description: '海外通販の始め方、ブランド別の買い方、送料や関税の考え方まで。解説記事を一覧で読めます。',
        url: 'https://original-price.com/articles',
        type: 'website',
    },
}

export default async function ArticlesPage() {
    const { data: posts } = await supabase
        .from('posts')
        .select('id, slug, title, thumbnail_url, category, created_at')
        .order('created_at', { ascending: false })

    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'CollectionPage',
                '@id': 'https://original-price.com/articles#collection',
                name: '海外通販マガジン',
                description: 'ブランド情報や海外通販のコツなど、賢くお買い物するための解説・コラム集です。',
                url: 'https://original-price.com/articles',
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
                        name: '記事一覧',
                        item: 'https://original-price.com/articles',
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
            <main style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', background: '#f8fafc', minHeight: '100vh' }}>

                {/* Hero Section */}
                <section style={{
                    padding: 'clamp(8rem, 12vw, 10rem) clamp(1.5rem, 5vw, 4rem) clamp(3rem, 6vw, 4rem)',
                    background: '#fafaf9',
                    borderBottom: '1px solid #e2e8f0',
                }}>
                    <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
                        <h1 style={{
                            fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800,
                            letterSpacing: '-0.02em', marginBottom: '1rem', color: '#0f172a'
                        }}>海外通販マガジン</h1>
                        <p style={{
                            fontSize: '1.2rem', color: '#64748b', maxWidth: '600px', margin: '0 auto',
                        }}>
                            ブランド情報や海外通販のコツなど、賢くお買い物するための解説・コラム集です。
                        </p>
                    </div>
                </section>

                {/* Articles Grid */}
                <section style={{ padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem)' }}>
                    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

                        {posts && posts.length > 0 ? (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                                gap: '2rem'
                            }}>
                                {posts.map((post) => {
                                    const href = post.slug.includes('/') && !post.slug.startsWith('articles/')
                                        ? `/${post.slug}`
                                        : `/articles/${post.slug}`;

                                    return (
                                        <Link key={post.id} href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <article style={{
                                                background: 'white',
                                                borderRadius: '16px',
                                                overflow: 'hidden',
                                                border: '1px solid #e2e8f0',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}>
                                                <div style={{
                                                    width: '100%',
                                                    aspectRatio: '16/9',
                                                    backgroundColor: '#e2e8f0',
                                                    position: 'relative'
                                                }}>
                                                    {post.thumbnail_url ? (
                                                        <img
                                                            src={post.thumbnail_url}
                                                            alt={post.title}
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        />
                                                    ) : (
                                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '2rem' }}>
                                                            <span role="img" aria-label="article">📝</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontSize: '0.85rem' }}>
                                                        {post.category && (
                                                            <span style={{ fontWeight: 600, color: '#111110', background: 'rgba(17,17,16,0.06)', padding: '0.2rem 0.6rem', borderRadius: '100px' }}>
                                                                {post.category}
                                                            </span>
                                                        )}
                                                        <span style={{ color: '#64748b' }}>
                                                            最終確認 {formatJapaneseDate(post.created_at) || '未登録'}
                                                        </span>
                                                    </div>
                                                    <h2 style={{
                                                        fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.4, marginBottom: '0.5rem',
                                                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                                                    }}>
                                                        {post.title}
                                                    </h2>
                                                </div>
                                            </article>
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '5rem 0', color: '#64748b' }}>
                                現在、公開されている記事はありません。
                            </div>
                        )}

                    </div>
                </section>

                <Footer />
            </main>
        </>
    )
}
