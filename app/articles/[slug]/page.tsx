import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'
import { addExternalLinkAttributes } from '@/lib/utils'

// --- SEO: generateMetadata for per-article title/description/og ---
export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const { slug } = await params

    const { data: post } = await supabase
        .from('posts')
        .select('title, content, thumbnail_url')
        .eq('slug', slug)
        .single()

    if (!post) {
        return {
            title: '記事が見つかりません | Direct Found',
        }
    }

    // Extract first 120 chars of plain text for description
    const plainText = post.content
        ?.replace(/<[^>]*>/g, '')
        ?.replace(/\s+/g, ' ')
        ?.trim()
        ?.slice(0, 120) + '...'

    return {
        title: `${post.title} | Direct Found`,
        description: plainText,
        openGraph: {
            title: post.title,
            description: plainText,
            type: 'article',
            url: `https://directfound.com/articles/${slug}`,
            siteName: 'Direct Found',
            ...(post.thumbnail_url && {
                images: [
                    {
                        url: post.thumbnail_url,
                        width: 1200,
                        height: 630,
                        alt: post.title,
                    },
                ],
            }),
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: plainText,
            ...(post.thumbnail_url && { images: [post.thumbnail_url] }),
        },
    }
}

// --- Helper: Extract headings from HTML for Table of Contents ---
function extractHeadings(html: string): { id: string; text: string; level: number }[] {
    const headings: { id: string; text: string; level: number }[] = []
    const regex = /<h([2-3])[^>]*>(.*?)<\/h\1>/gi
    let match

    while ((match = regex.exec(html)) !== null) {
        const level = parseInt(match[1])
        const text = match[2].replace(/<[^>]*>/g, '').trim()
        const id = text
            .replace(/[^\w\u3000-\u9FFF\uFF00-\uFFEF]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
            .toLowerCase()
        if (text) {
            headings.push({ id, text, level })
        }
    }

    return headings
}

// --- Helper: Inject IDs into headings in HTML ---
function injectHeadingIds(html: string, headings: { id: string; text: string; level: number }[]): string {
    let headingIndex = 0
    return html.replace(/<h([2-3])([^>]*)>(.*?)<\/h\1>/gi, (fullMatch, level, attrs, content) => {
        if (headingIndex < headings.length) {
            const heading = headings[headingIndex]
            headingIndex++
            return `<h${level} id="${heading.id}"${attrs}>${content}</h${level}>`
        }
        return fullMatch
    })
}

export default async function ArticleDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params

    const { data: post } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single()

    if (!post) return (
        <>
            <Header />
            <main style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', padding: 'clamp(8rem, 12vw, 10rem) clamp(1.5rem, 5vw, 4rem)', minHeight: '100vh', background: '#f8fafc' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <p style={{ color: '#94a3b8', marginBottom: '1.5rem', textAlign: 'center', fontSize: '1.2rem' }}>記事が見つかりません。</p>
                    <div style={{ textAlign: 'center' }}>
                        <Link href="/articles" style={{ color: '#111110', textDecoration: 'none', fontWeight: 600 }}>← 記事一覧に戻る</Link>
                    </div>
                </div>
            </main>
        </>
    )

    // Extract headings for ToC and inject IDs
    const headings = extractHeadings(post.content || '')
    const contentWithLinks = addExternalLinkAttributes(post.content || '')
    const contentWithIds = injectHeadingIds(contentWithLinks, headings)

    // --- JSON-LD Structured Data ---
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.content?.replace(/<[^>]*>/g, '')?.replace(/\s+/g, ' ')?.trim()?.slice(0, 200),
        image: post.thumbnail_url || undefined,
        datePublished: post.created_at,
        dateModified: post.updated_at || post.created_at,
        author: {
            '@type': 'Organization',
            name: 'Direct Found',
            url: 'https://directfound.com',
        },
        publisher: {
            '@type': 'Organization',
            name: 'Direct Found',
            url: 'https://directfound.com',
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://directfound.com/articles/${slug}`,
        },
    }

    return (
        <>
            <Header />
            {/* JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <main style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', background: 'white' }}>
                <style>{`
          .back-link { color: #6b6b69; text-decoration: none; font-weight: 500; font-size: 0.82rem; transition: color 0.2s; display: inline-flex; align-items: center; gap: 0.35rem; }
          .back-link:hover { color: #111110; }
          
          /* Table of Contents */
          .toc-container {
            background: #fafaf9;
            border: 1px solid #e5e5e3;
            border-radius: 10px;
            padding: 1.5rem 1.75rem;
            margin-bottom: 2.5rem;
          }
          .toc-title {
            font-size: 0.7rem;
            font-weight: 700;
            color: #a1a19f;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: 1rem;
          }
          .toc-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .toc-list li {
            margin-bottom: 0.45rem;
          }
          .toc-list li a {
            color: #555553;
            text-decoration: none;
            font-size: 0.9rem;
            line-height: 1.6;
            transition: color 0.15s;
          }
          .toc-list li a:hover { color: #111110; }
          .toc-list li.toc-h3 { padding-left: 1.25rem; }
          .toc-list li.toc-h3 a { font-size: 0.82rem; color: #a1a19f; }
          
          /* Article content */
          .article-content {
            font-size: 1.05rem;
            line-height: 1.85;
            color: #333332;
            font-family: var(--font-sans);
          }

          .article-content h2 {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: clamp(1.5rem, 3.5vw, 2rem);
            font-weight: 700;
            color: #111110;
            margin-top: 3.5rem;
            margin-bottom: 1.25rem;
            padding-bottom: 0.75rem;
            border-bottom: 1px solid #e5e5e3;
            line-height: 1.3;
            letter-spacing: -0.02em;
            scroll-margin-top: 5rem;
          }

          .article-content h3 {
            font-size: 1.15rem;
            font-weight: 700;
            color: #111110;
            margin-top: 2.5rem;
            margin-bottom: 1rem;
            line-height: 1.4;
            letter-spacing: -0.02em;
            scroll-margin-top: 5rem;
          }

          .article-content p {
            margin-bottom: 1.5rem;
            letter-spacing: -0.005em;
          }

          .article-content ul, .article-content ol {
            margin-bottom: 1.5rem;
            padding-left: 1.5rem;
          }

          .article-content li {
            margin-bottom: 0.5rem;
          }

          .article-content a {
            color: #111110;
            text-decoration: underline;
            text-underline-offset: 3px;
            text-decoration-color: rgba(17,17,16,0.3);
            transition: text-decoration-color 0.15s;
          }

          .article-content a:hover {
            text-decoration-color: rgba(17,17,16,0.9);
          }
          
          .article-content strong {
            font-weight: 700;
            color: #111110;
          }

          .article-content table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.9rem;
            margin-bottom: 1.5rem;
          }
          .article-content th {
            background: #f3f3f1;
            padding: 0.75rem 1rem;
            text-align: left;
            font-weight: 600;
            border-bottom: 1px solid #e5e5e3;
            color: #555553;
            font-size: 0.82rem;
            letter-spacing: 0.03em;
          }
          .article-content td {
            padding: 0.75rem 1rem;
            border-bottom: 1px solid #f0f0ee;
            color: #333332;
          }
          .article-content tr:last-child td { border-bottom: none; }

          /* Shop card styles for BV-style articles */
          .article-content .shop-card {
            border: 1px solid #e5e5e3;
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 2rem;
            background: #ffffff;
          }
          .article-content .shop-card h3 {
            margin-top: 0;
          }
          .article-content .cta-button {
            background: #111110 !important;
            color: #fafaf9 !important;
            border-radius: 6px !important;
            font-family: var(--font-sans);
            font-weight: 600;
            letter-spacing: -0.01em;
            transition: background 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease;
          }
          .article-content .cta-button:hover {
            background: #2a2a28 !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 16px rgba(0,0,0,0.15) !important;
          }
        `}</style>

                {/* Article Header (Hero) */}
                <section style={{
                    padding: 'clamp(8rem, 12vw, 10rem) clamp(1.5rem, 5vw, 4rem) clamp(3rem, 6vw, 4rem)',
                    background: '#f8fafc',
                    borderBottom: '1px solid #e2e8f0'
                }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <Link href="/articles" className="back-link" style={{ display: 'inline-block', marginBottom: '2rem' }}>← 記事一覧に戻る</Link>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                            {post.category && (
                                <span style={{
                                    fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-brand)',
                                    background: 'var(--accent-brand-soft)', padding: '0.35rem 1.2rem',
                                    borderRadius: '100px', letterSpacing: '0.06em', textTransform: 'uppercase',
                                    border: '1px solid var(--accent-brand-mid)',
                                }}>{post.category}</span>
                            )}
                            <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>
                                {post.created_at ? `🗓️ ${new Date(post.created_at).toLocaleDateString('ja-JP')}` : ''}
                            </span>
                        </div>

                        <h1 style={{
                            fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800,
                            letterSpacing: '-0.02em', color: '#0f172a', lineHeight: 1.3,
                            marginBottom: '2rem'
                        }}>{post.title}</h1>

                        {post.thumbnail_url && (
                            <div style={{
                                width: '100%',
                                aspectRatio: '16/9',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
                                backgroundColor: '#e2e8f0'
                            }}>
                                <img
                                    src={post.thumbnail_url}
                                    alt={post.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                        )}
                    </div>
                </section>

                {/* Article Content */}
                <section style={{ padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem)' }}>
                    <div style={{ maxWidth: '720px', margin: '0 auto' }}>

                        {/* Table of Contents */}
                        {headings.length > 0 && (
                            <nav className="toc-container" aria-label="目次">
                                <p className="toc-title">📑 目次</p>
                                <ul className="toc-list">
                                    {headings.map((h, i) => (
                                        <li key={i} className={h.level === 3 ? 'toc-h3' : ''}>
                                            <a href={`#${h.id}`}>{h.level === 3 ? '└ ' : ''}{h.text}</a>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        )}

                        {/* Rendering HTML content */}
                        <div
                            className="article-content"
                            dangerouslySetInnerHTML={{ __html: contentWithIds }}
                        />

                        {/* Article Footer Area */}
                        <div style={{
                            marginTop: '5rem',
                            paddingTop: '3rem',
                            borderTop: '1px solid #e2e8f0',
                            textAlign: 'center'
                        }}>
                            <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem' }}>
                                お探しのショップはありましたか？
                            </p>
                            <Link href="/shops" style={{
                                display: 'inline-block', background: '#0f172a', color: 'white',
                                padding: '1rem 2.5rem', borderRadius: '999px', textDecoration: 'none',
                                fontWeight: 600, transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                            }}>
                                海外通販ショップ一覧を見る →
                            </Link>
                        </div>

                    </div>
                </section>

                <Footer />
            </main>
        </>
    )
}
