import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { CORE_GUIDE_LINKS } from '@/lib/shopInsights'
import { addExternalLinkAttributes, formatJapaneseDate, getArticleExcerpt, getLastVerifiedAt, sanitizeArticleHtml } from '@/lib/utils'

// Catch-all route for legacy URLs and custom paths
// e.g. /fashionshop/lists/mens

export async function generateMetadata({
    params,
}: {
    params: Promise<{ legacyPath: string[] }>
}): Promise<Metadata> {
    const { legacyPath } = await params
    const slug = legacyPath.join('/')

    const { data: post } = await supabase
        .from('posts')
        .select('title, content, thumbnail_url')
        .eq('slug', slug)
        .single()

    if (!post) {
        return {
            title: 'ページが見つかりません | Original Price',
        }
    }

    const plainText = getArticleExcerpt(post.content, 120)

    return {
        title: `${post.title} | Original Price`,
        description: plainText,
        openGraph: {
            title: post.title,
            description: plainText,
            type: 'article',
            url: `https://original-price.com/${slug}`,
            siteName: 'Original Price',
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

export default async function LegacyPathPage({
    params,
}: {
    params: Promise<{ legacyPath: string[] }>
}) {
    const { legacyPath } = await params
    const slug = legacyPath.join('/')

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
                    <p style={{ color: '#94a3b8', marginBottom: '1.5rem', textAlign: 'center', fontSize: '1.2rem' }}>ページが見つかりません。</p>
                    <div style={{ textAlign: 'center' }}>
                        <Link href="/" style={{ color: '#111110', textDecoration: 'none', fontWeight: 600 }}>← トップに戻る</Link>
                    </div>
                </div>
            </main>
        </>
    )

    const sanitizedContent = sanitizeArticleHtml(post.content || '')
    const linkedShopSlugs = extractLinkedSlugs(sanitizedContent, 'shops')
    const linkedBrandSlugs = extractLinkedSlugs(sanitizedContent, 'brands')
    const headings = extractHeadings(sanitizedContent)
    const contentWithLinks = addExternalLinkAttributes(sanitizedContent)
    const contentWithIds = injectHeadingIds(contentWithLinks, headings)

    const [{ data: linkedShops }, { data: linkedBrands }, { data: featuredShops }] = await Promise.all([
        linkedShopSlugs.length > 0
            ? supabase
                .from('shops')
                .select('name, slug, category, ships_to_japan, is_affiliate, popularity_score')
                .in('slug', linkedShopSlugs.slice(0, 6))
            : Promise.resolve({ data: [] }),
        linkedBrandSlugs.length > 0
            ? supabase
                .from('brands')
                .select('name, slug')
                .in('slug', linkedBrandSlugs.slice(0, 2))
            : Promise.resolve({ data: [] }),
        supabase
            .from('shops')
            .select('name, slug, category, ships_to_japan, is_affiliate, popularity_score')
            .order('is_affiliate', { ascending: false })
            .order('popularity_score', { ascending: false })
            .limit(3),
    ])

    const orderedLinkedShops = linkedShopSlugs
        .map((shopSlug) => linkedShops?.find((shop) => shop.slug === shopSlug))
        .filter(Boolean)

    const primaryBrand = linkedBrandSlugs
        .map((brandSlug) => linkedBrands?.find((brand) => brand.slug === brandSlug))
        .find(Boolean)

    const breadcrumbLd = {
        '@context': 'https://schema.org',
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
            {
                '@type': 'ListItem',
                position: 3,
                name: post.title,
                item: `https://original-price.com/${slug}`,
            },
        ],
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Article',
                headline: post.title,
                description: post.content?.replace(/<[^>]*>/g, '')?.replace(/\s+/g, ' ')?.trim()?.slice(0, 200),
                image: post.thumbnail_url || undefined,
                datePublished: post.created_at,
                dateModified: post.updated_at || post.created_at,
                author: {
                    '@type': 'Organization',
                    name: 'Original Price',
                    url: 'https://original-price.com',
                },
                publisher: {
                    '@type': 'Organization',
                    name: 'Original Price',
                    url: 'https://original-price.com',
                    logo: {
                        '@type': 'ImageObject',
                        url: 'https://original-price.com/logo.png',
                    },
                },
                mainEntityOfPage: {
                    '@type': 'WebPage',
                    '@id': `https://original-price.com/${slug}`,
                },
            },
            breadcrumbLd,
        ],
    }

    return (
        <>
            <Header />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <main style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', background: 'white' }}>
                <style>{`
          .back-link { color: #6b6b69; text-decoration: none; font-weight: 500; font-size: 0.82rem; transition: color 0.2s; display: inline-flex; align-items: center; gap: 0.35rem; }
          .back-link:hover { color: #111110; }
          .toc-container { background: #fafaf9; border: 1px solid #e5e5e3; border-radius: 10px; padding: 1.5rem 1.75rem; margin-bottom: 2.5rem; }
          .toc-title { font-size: 0.7rem; font-weight: 700; color: #a1a19f; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1rem; }
          .toc-list { list-style: none; padding: 0; margin: 0; }
          .toc-list li { margin-bottom: 0.45rem; }
          .toc-list li a { color: #555553; text-decoration: none; font-size: 0.9rem; line-height: 1.6; transition: color 0.15s; }
          .toc-list li a:hover { color: #111110; }
          .toc-list li.toc-h3 { padding-left: 1.25rem; }
          .toc-list li.toc-h3 a { font-size: 0.82rem; color: #a1a19f; }
          .article-content { font-size: 1.05rem; line-height: 1.85; color: #333332; font-family: var(--font-sans); }
          .article-content h2 { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(1.5rem, 3.5vw, 2rem); font-weight: 700; color: #111110; margin-top: 3.5rem; margin-bottom: 1.25rem; padding-bottom: 0.75rem; border-bottom: 1px solid #e5e5e3; line-height: 1.3; letter-spacing: -0.02em; scroll-margin-top: 5rem; }
          .article-content h3 { font-size: 1.15rem; font-weight: 700; color: #111110; margin-top: 2.5rem; margin-bottom: 1rem; line-height: 1.4; letter-spacing: -0.02em; scroll-margin-top: 5rem; }
          .article-content p { margin-bottom: 1.5rem; letter-spacing: -0.005em; }
          .article-content ul, .article-content ol { margin-bottom: 1.5rem; padding-left: 1.5rem; }
          .article-content li { margin-bottom: 0.5rem; }
          .article-content a { color: #111110; text-decoration: underline; text-underline-offset: 3px; text-decoration-color: rgba(17,17,16,0.3); transition: text-decoration-color 0.15s; }
          .article-content a:hover { text-decoration-color: rgba(17,17,16,0.9); }
          .article-content strong { font-weight: 700; color: #111110; }
          .article-content table { width: 100%; border-collapse: collapse; font-size: 0.9rem; margin-bottom: 1.5rem; table-layout: auto; }
          .article-content th { background: #f3f3f1; padding: 0.75rem 0.5rem; text-align: left; font-weight: 600; border-bottom: 1px solid #e5e5e3; color: #555553; font-size: 0.82rem; letter-spacing: 0.03em; }
          .article-content td { padding: 0.75rem 0.5rem; border-bottom: 1px solid #f0f0ee; color: #333332; word-break: break-word; }
          .article-content tr:last-child td { border-bottom: none; }
          .article-content .shop-shot { width: 100%; display: block; margin: 0 0 1rem; border-radius: 10px; border: 1px solid #e5e5e3; background: #f8fafc; }
          .article-content .cta-button { display: inline-flex; align-items: center; justify-content: center; gap: 0.45rem; padding: 0.85rem 1.2rem; margin-bottom: 1rem; background: #111110 !important; color: #fafaf9 !important; border-radius: 6px !important; font-family: var(--font-sans); font-weight: 600; letter-spacing: -0.01em; text-decoration: none !important; transition: background 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease; }
          .article-content .cta-button:hover { background: #2a2a28 !important; transform: translateY(-2px) !important; box-shadow: 0 6px 16px rgba(0,0,0,0.15) !important; }
        `}</style>

                <section style={{
                    padding: 'clamp(8rem, 12vw, 10rem) clamp(1.5rem, 5vw, 4rem) clamp(3rem, 6vw, 4rem)',
                    background: '#f8fafc',
                    borderBottom: '1px solid #e2e8f0'
                }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
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
                                最終確認 {formatJapaneseDate(getLastVerifiedAt(post)) || '未登録'}
                            </span>
                        </div>

                        <h1 style={{
                            fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800,
                            letterSpacing: '-0.02em', color: '#0f172a', lineHeight: 1.3,
                            marginBottom: '2rem'
                        }}>{post.title}</h1>

                        {post.thumbnail_url && (
                            <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', backgroundColor: '#e2e8f0', position: 'relative' }}>
                                <Image 
                                    src={post.thumbnail_url} 
                                    alt={post.title} 
                                    fill
                                    priority
                                    fetchPriority="high"
                                    sizes="(max-width: 800px) 100vw, 800px"
                                    style={{ objectFit: 'cover' }} 
                                />
                            </div>
                        )}
                    </div>
                </section>

                <section style={{ padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem)' }}>
                    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
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
                        <div className="article-content" dangerouslySetInnerHTML={{ __html: contentWithIds }} />

                        <div style={{
                            marginTop: '5rem',
                            paddingTop: '3rem',
                            borderTop: '1px solid #e2e8f0',
                            display: 'grid',
                            gap: '1.5rem'
                        }}>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
                                    記事を読んだら、次は比較して選ぶ段階へ。
                                </p>
                                <p style={{ color: '#64748b', margin: 0, lineHeight: 1.7 }}>
                                    ショップ一覧・ブランド一覧・初心者ガイドを行き来しながら、自分に合う海外通販先を見つけやすくしています。
                                </p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                                {[
                                    { title: 'ショップ一覧', body: '送料・関税・日本発送の違いを比較', href: '/shops' },
                                    { title: 'ブランド一覧', body: '欲しいブランドが買える店を探す', href: '/brands' },
                                    { title: '初心者ガイド', body: 'DDP/DDUや返品の基礎を押さえる', href: '/guide' },
                                ].map((card) => (
                                    <Link key={card.title} href={card.href} style={{ textDecoration: 'none', color: 'inherit', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.2rem', background: '#fafaf9' }}>
                                        <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.45rem' }}>{card.title}</div>
                                        <div style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6 }}>{card.body}</div>
                                    </Link>
                                ))}
                            </div>

                            {primaryBrand && (
                                <Link
                                    href={`/brands/${primaryBrand.slug}`}
                                    style={{
                                        textDecoration: 'none',
                                        color: 'inherit',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '18px',
                                        padding: '1.25rem 1.35rem',
                                        background: 'linear-gradient(135deg, #fff 0%, #fafaf9 100%)',
                                        display: 'grid',
                                        gap: '0.45rem',
                                    }}
                                >
                                    <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-brand)' }}>
                                        関連ブランド
                                    </span>
                                    <span style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>{primaryBrand.name}の掲載ショップをもっと見る</span>
                                    <span style={{ fontSize: '0.92rem', color: '#64748b', lineHeight: 1.7 }}>この記事で見たショップ以外も含めて、ブランド単位で比較しやすい導線です。</span>
                                </Link>
                            )}

                             {(orderedLinkedShops.length > 0 ? orderedLinkedShops : (featuredShops || [])).length > 0 && (
                                <div style={{ border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.25rem 1.35rem', background: '#fff' }}>
                                    <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-brand)', marginBottom: '0.85rem' }}>
                                        {orderedLinkedShops.length > 0 ? 'この記事で比較したショップ' : '今すぐ比較しやすいショップ'}
                                    </p>
                                    <div style={{ display: 'grid', gap: '0.8rem' }}>
                                        {(orderedLinkedShops.length > 0 ? (orderedLinkedShops as any[]) : (featuredShops || [])).filter(Boolean).map((shop: any) => shop && (
                                            <Link key={shop.slug} href={`/shops/${shop.slug}`} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', textDecoration: 'none', color: 'inherit', paddingBottom: '0.8rem', borderBottom: '1px solid #f0f0ee' }}>
                                                <div>
                                                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{shop.name}</div>
                                                    <div style={{ fontSize: '0.88rem', color: '#64748b' }}>
                                                        {shop.category} {shop.ships_to_japan === false ? '・直送可否は要確認' : '・日本から比較しやすい候補'}
                                                    </div>
                                                </div>
                                                <span style={{ color: '#111110', fontWeight: 600, whiteSpace: 'nowrap' }}>詳細を見る</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div style={{ border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.25rem 1.35rem', background: '#fafaf9' }}>
                                <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-brand)', marginBottom: '0.85rem' }}>
                                    一緒に読むと安心なガイド
                                </p>
                                <div style={{ display: 'grid', gap: '0.8rem' }}>
                                    {CORE_GUIDE_LINKS.map((guide) => (
                                        <Link key={guide.href} href={guide.href} style={{ textDecoration: 'none', color: '#0f172a', fontWeight: 600 }}>
                                            {guide.title} →
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <Footer />
            </main>
        </>
    )
}
