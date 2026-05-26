import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { marked } from 'marked'
import { CORE_GUIDE_LINKS } from '@/lib/shopInsights'
import { addExternalLinkAttributes, formatJapaneseDate, getArticleExcerpt, getLastVerifiedAt, sanitizeArticleHtml } from '@/lib/utils'

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
        return { title: '記事が見つかりません | Original Price' }
    }

    const plainText = getArticleExcerpt(post.content, 120)
    return {
        title: `${post.title} | Original Price`,
        description: plainText,
        openGraph: {
            title: post.title,
            description: plainText,
            images: post.thumbnail_url ? [{ url: post.thumbnail_url }] : [],
        },
    }
}

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

function extractLinkedSlugs(html: string, entity: 'shops' | 'brands'): string[] {
    const matches = Array.from(html.matchAll(new RegExp(`href="/${entity}/([^"#?]+)"`, 'g')))
        .map((match) => match[1])
        .filter(Boolean)
    return matches.filter((slug, index) => matches.indexOf(slug) === index)
}

export default async function ArticleDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    if (slug.includes('/') && !slug.startsWith('articles/')) {
        redirect(`/${slug}`)
    }

    const { data: post } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single()

    if (!post) return (
        <>
            <Header />
            <main style={{ padding: '10rem 2rem', textAlign: 'center', background: 'var(--bg)', minHeight: '100vh' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1.2rem' }}>記事が見つかりませんでした。</p>
                    <Link href="/articles" style={{ fontWeight: 700, color: '#111110', textDecoration: 'none' }}>← 記事一覧に戻る</Link>
                </div>
            </main>
        </>
    )

    // Parse & Sanitize
    const rawHtml = marked.parse(post.content || '') as string
    const sanitizedContent = sanitizeArticleHtml(rawHtml)
    const linkedShopSlugs = extractLinkedSlugs(sanitizedContent, 'shops')
    const linkedBrandSlugs = extractLinkedSlugs(sanitizedContent, 'brands')
    const headings = extractHeadings(sanitizedContent)
    const contentWithLinks = addExternalLinkAttributes(sanitizedContent)
    const contentWithIds = injectHeadingIds(contentWithLinks, headings)

    const [{ data: linkedShops }, { data: linkedBrands }] = await Promise.all([
        linkedShopSlugs.length > 0
            ? supabase.from('shops').select('name, slug, category, ships_to_japan').in('slug', linkedShopSlugs)
            : Promise.resolve({ data: [] }),
        linkedBrandSlugs.length > 0
            ? supabase.from('brands').select('name, slug').in('slug', linkedBrandSlugs)
            : Promise.resolve({ data: [] }),
    ])

    return (
        <>
            <Header />
            <main style={{ background: 'white', minHeight: '100vh' }}>
                <style>{`
          .article-header { padding: clamp(7rem, 10vw, 9rem) clamp(1.5rem, 5vw, 4rem) 4rem; background: var(--bg); border-bottom: 1px solid var(--border); }
          .back-link { display: inline-flex; align-items: center; gap: 0.4rem; color: var(--text-secondary); text-decoration: none; font-size: 0.85rem; font-weight: 600; margin-bottom: 2rem; }
          .back-link:hover { color: #111110; }
          .hero-img-wrap { width: 100%; aspectRatio: 16/9; border-radius: 24px; overflow: hidden; box-shadow: 0 15px 40px rgba(0,0,0,0.08); border: 1px solid var(--border); margin-top: 2rem; }
          .toc-box { background: #fafaf9; border: 1px solid var(--border); border-radius: 16px; padding: 2rem; margin: 3rem 0; }
          .toc-label { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); margin-bottom: 1rem; border-bottom: 1px solid var(--border-soft); padding-bottom: 0.75rem; }
          .toc-links { list-style: none; padding: 0; margin: 0; display: grid; gap: 0.6rem; }
          .toc-links a { color: var(--text-secondary); text-decoration: none; font-size: 0.95rem; font-weight: 500; transition: color 0.15s; }
          .toc-links a:hover { color: #111110; }
          .toc-h3 { padding-left: 1.5rem; opacity: 0.8; font-size: 0.88rem !important; }
          .post-body { color: #111110; line-height: 1.9; font-size: 1.05rem; }
          .post-body h2 { font-size: clamp(1.6rem, 3.5vw, 2.3rem); font-weight: 850; letter-spacing: -0.03em; margin: 4.5rem 0 1.5rem; border-bottom: 2px solid #111110; padding-bottom: 0.75rem; line-height: 1.2; scroll-margin-top: 80px; }
          .post-body h3 { font-size: 1.35rem; font-weight: 800; margin: 3rem 0 1rem; line-height: 1.3; scroll-margin-top: 80px; }
          .post-body p { margin-bottom: 1.8rem; }
          .post-body strong { font-weight: 800; color: #000; box-shadow: inset 0 -6px 0 rgba(0,0,0,0.04); }
          .post-body a { color: #111110; text-decoration: underline; text-underline-offset: 4px; text-decoration-thickness: 1px; transition: opacity 0.2s; }
          .post-body a:hover { opacity: 0.6; }
          .post-body ul, .post-body ol { margin-bottom: 2rem; padding-left: 1.4rem; }
          .post-body li { margin-bottom: 0.8rem; padding-left: 0.4rem; }
          .post-body ul { list-style: none; }
          .post-body ul li::before { content: "•"; color: #a1a19f; font-weight: bold; display: inline-block; width: 1.2em; margin-left: -1.2em; }
          .post-body table { width: 100%; margin: 3rem 0; border-collapse: collapse; font-size: 0.9rem; border: 1px solid var(--border); border-radius: 12px; overflow: hidden; table-layout: auto; }
          .post-body th { background: #111110; color: white; text-align: left; padding: 1rem 1.25rem; font-weight: 700; }
          .post-body td { padding: 1rem 1.25rem; border-bottom: 1px solid var(--border-soft); vertical-align: middle; word-break: break-word; }
          .post-body tr:nth-child(even) { background: #fafaf9; }
          .post-body tr:hover { background: #f1f1ef; }
          .next-action { margin-top: 6rem; padding: 4rem; background: #fafaf9; border-radius: 32px; border: 1px solid var(--border); }
        `}</style>
                
                <article className="article-header">
                    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
                        <Link href="/articles" className="back-link">← BACK TO ARTICLES</Link>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: 800, background: '#111110', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '4px', letterSpacing: '0.05em' }}>{post.category || 'GUIDE'}</span>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{new Date(post.created_at).toLocaleDateString('ja-JP')}</span>
                        </div>
                        <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 3.5rem)', fontWeight: 850, letterSpacing: '-0.04em', lineHeight: 1.15, color: '#111110' }}>{post.title}</h1>
                        {post.thumbnail_url && (
                            <div className="hero-img-wrap" style={{ position: 'relative' }}>
                                <Image
                                    src={post.thumbnail_url}
                                    alt={post.title}
                                    fill
                                    priority
                                    fetchPriority="high"
                                    sizes="(max-width: 850px) 100vw, 850px"
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                        )}
                    </div>
                </article>

                <section style={{ padding: '0 clamp(1.5rem, 5vw, 4rem) 10rem' }}>
                    <div style={{ maxWidth: '780px', margin: '0 auto' }}>
                        {headings.length > 0 && (
                            <nav className="toc-box">
                                <p className="toc-label">Index</p>
                                <ul className="toc-links">
                                    {headings.map((h, i) => (
                                        <li key={i} className={h.level === 3 ? 'toc-h3' : ''}>
                                            <a href={`#${h.id}`}>{h.text}</a>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        )}
                        
                        <div className="post-body article-content" dangerouslySetInnerHTML={{ __html: contentWithIds }} />

                        <div className="next-action">
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 850, marginBottom: '2rem', marginTop: 0, border: 'none' }}>Next Movement</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                                <Link href="/shops" style={{ background: 'white', padding: '2rem', borderRadius: '20px', border: '1px solid var(--border)', textDecoration: 'none', color: 'inherit' }}>
                                    <p style={{ fontWeight: 850, fontSize: '1.1rem', marginBottom: '0.5rem' }}>SHOP DIRECTORY →</p>
                                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>140以上の優良ショップから、あなたのための1軒を探す。</p>
                                </Link>
                                <Link href="/search" style={{ background: 'white', padding: '2rem', borderRadius: '20px', border: '1px solid var(--border)', textDecoration: 'none', color: 'inherit' }}>
                                    <p style={{ fontWeight: 850, fontSize: '1.1rem', marginBottom: '0.5rem' }}>GLOBAL SEARCH →</p>
                                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>キーワード、国名、カテゴリで、サイト内を縦断検索。</p>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
                <Footer />
            </main>
        </>
    )
}
