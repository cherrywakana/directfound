import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Link from 'next/link'

export const revalidate = 60 // Revalidate cache every 60 seconds

export default async function ArticlesPage() {
    const { data: posts } = await supabase
        .from('posts')
        .select('id, slug, title, thumbnail_url, category, created_at')
        .order('created_at', { ascending: false })

    return (
        <>
            <Header />
            <main style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', background: '#f8fafc', minHeight: '100vh' }}>

                {/* Hero Section */}
                <section style={{
                    padding: 'clamp(8rem, 12vw, 10rem) clamp(1.5rem, 5vw, 4rem) clamp(3rem, 6vw, 4rem)',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f7ff 40%, #ede9fe 100%)',
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
                                {posts.map((post) => (
                                    <Link key={post.id} href={`/articles/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
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
                                                        <span style={{ fontWeight: 600, color: '#6366f1', background: 'rgba(99,102,241,0.1)', padding: '0.2rem 0.6rem', borderRadius: '100px' }}>
                                                            {post.category}
                                                        </span>
                                                    )}
                                                    <span style={{ color: '#64748b' }}>
                                                        {new Date(post.created_at).toLocaleDateString('ja-JP')}
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
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '5rem 0', color: '#64748b' }}>
                                現在、公開されている記事はありません。
                            </div>
                        )}

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
