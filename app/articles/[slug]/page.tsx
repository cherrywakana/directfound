import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { notFound, permanentRedirect, redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { marked } from 'marked'
import { CORE_GUIDE_LINKS } from '@/lib/shopInsights'
import { addExternalLinkAttributes, formatJapaneseDate, getArticleExcerpt, getLastVerifiedAt, sanitizeArticleHtml } from '@/lib/utils'
import { ARTICLE_REDIRECTS } from '@/lib/contentRedirects'

const SITE_URL = 'https://original-price.com'

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const { slug } = await params
    const redirectTarget = ARTICLE_REDIRECTS[slug]

    if (redirectTarget) {
        return {
            title: 'リダイレクト中 | Original Price',
        }
    }

    const { data: post } = await supabase
        .from('posts')
        .select('title, content, thumbnail_url')
        .eq('slug', slug)
        .single()

    if (!post) {
        return { title: '記事が見つかりません | Original Price' }
    }

    const rawHtml = marked.parse(post.content || '') as string
    const sanitizedContent = sanitizeArticleHtml(rawHtml)
    const plainText = getArticleExcerpt(sanitizedContent, 140)
    const canonicalPath = `/articles/${slug}`

    return {
        title: `${post.title} | Original Price`,
        description: plainText,
        alternates: {
            canonical: canonicalPath,
        },
        openGraph: {
            title: post.title,
            description: plainText,
            type: 'article',
            url: `${SITE_URL}${canonicalPath}`,
            siteName: 'Original Price',
            images: post.thumbnail_url ? [{ url: post.thumbnail_url, alt: post.title }] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: plainText,
            images: post.thumbnail_url ? [post.thumbnail_url] : [],
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

function stripHtml(html: string): string {
    return html
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, ' ')
        .trim()
}

function extractFaqItems(html: string): { question: string; answer: string }[] {
    const faqSectionMatch = html.match(/<h[2-3][^>]*>.*?(?:faq|FAQ|よくある質問).*?<\/h[2-3]>([\s\S]*)/i)
    if (!faqSectionMatch) return []

    const faqRegion = faqSectionMatch[1]
    const questionPattern = /<h3[^>]*>(.*?)<\/h3>([\s\S]*?)(?=<h[2-3][^>]*>|$)/gi
    const faqs: { question: string; answer: string }[] = []
    let match: RegExpExecArray | null

    while ((match = questionPattern.exec(faqRegion)) !== null) {
        const question = stripHtml(match[1])
        const answer = getArticleExcerpt(match[2], 220)

        if (question && answer) {
            faqs.push({ question, answer })
        }
    }

    return faqs.slice(0, 8)
}

export default async function ArticleDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const redirectTarget = ARTICLE_REDIRECTS[slug]

    if (redirectTarget) {
        permanentRedirect(redirectTarget)
    }

    if (slug.includes('/') && !slug.startsWith('articles/')) {
        redirect(`/${slug}`)
    }

    const { data: post } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single()

    if (!post) {
        notFound()
    }

    // Parse & Sanitize
    const rawHtml = marked.parse(post.content || '') as string
    const sanitizedContent = sanitizeArticleHtml(rawHtml)
    const linkedShopSlugs = extractLinkedSlugs(sanitizedContent, 'shops')
    const linkedBrandSlugs = extractLinkedSlugs(sanitizedContent, 'brands')
    const headings = extractHeadings(sanitizedContent)
    const contentWithLinks = addExternalLinkAttributes(sanitizedContent)
    const contentWithIds = injectHeadingIds(contentWithLinks, headings)
    const plainDescription = getArticleExcerpt(contentWithIds, 180)
    const lastVerifiedAt = getLastVerifiedAt(post)
    const articleUrl = `${SITE_URL}/articles/${slug}`
    const faqItems = extractFaqItems(contentWithIds)

    const [{ data: linkedShops }, { data: linkedBrands }] = await Promise.all([
        linkedShopSlugs.length > 0
            ? supabase.from('shops').select('name, slug, category, ships_to_japan').in('slug', linkedShopSlugs)
            : Promise.resolve({ data: [] }),
        linkedBrandSlugs.length > 0
            ? supabase.from('brands').select('name, slug').in('slug', linkedBrandSlugs)
            : Promise.resolve({ data: [] }),
    ])

    const structuredData = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Article',
                headline: post.title,
                description: plainDescription,
                image: post.thumbnail_url || undefined,
                datePublished: post.created_at,
                dateModified: lastVerifiedAt || post.created_at,
                inLanguage: 'ja-JP',
                author: {
                    '@type': 'Organization',
                    name: 'Original Price',
                    url: SITE_URL,
                },
                publisher: {
                    '@type': 'Organization',
                    name: 'Original Price',
                    url: SITE_URL,
                },
                mainEntityOfPage: articleUrl,
            },
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    {
                        '@type': 'ListItem',
                        position: 1,
                        name: 'ホーム',
                        item: SITE_URL,
                    },
                    {
                        '@type': 'ListItem',
                        position: 2,
                        name: '記事一覧',
                        item: `${SITE_URL}/articles`,
                    },
                    {
                        '@type': 'ListItem',
                        position: 3,
                        name: post.title,
                        item: articleUrl,
                    },
                ],
            },
            ...(faqItems.length > 0
                ? [{
                    '@type': 'FAQPage',
                    mainEntity: faqItems.map((faq) => ({
                        '@type': 'Question',
                        name: faq.question,
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: faq.answer,
                        },
                    })),
                }]
                : []),
        ],
    }

    const relatedGuides = CORE_GUIDE_LINKS.filter((guide) => guide.href !== `/articles/${slug}`)

    return (
        <>
            <Header />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
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
                        <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem' }}>
                            <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.55rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                                <li><Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>ホーム</Link></li>
                                <li aria-hidden="true">/</li>
                                <li><Link href="/articles" style={{ color: 'inherit', textDecoration: 'none' }}>記事一覧</Link></li>
                                <li aria-hidden="true">/</li>
                                <li style={{ color: '#111110', fontWeight: 700 }}>{post.title}</li>
                            </ol>
                        </nav>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: 800, background: '#111110', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '4px', letterSpacing: '0.05em' }}>{post.category || 'GUIDE'}</span>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>最終確認 {formatJapaneseDate(lastVerifiedAt) || formatJapaneseDate(post.created_at) || '未登録'}</span>
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

                        {(linkedShops?.length || linkedBrands?.length || relatedGuides.length > 0) && (
                            <section style={{ marginTop: '4rem', display: 'grid', gap: '1.25rem' }}>
                                {linkedShops && linkedShops.length > 0 && (
                                    <div style={{ background: '#fafaf9', border: '1px solid var(--border)', borderRadius: '20px', padding: '1.5rem' }}>
                                        <h2 style={{ fontSize: '1.25rem', margin: '0 0 1rem', border: 'none' }}>関連記事で触れているショップ</h2>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.9rem' }}>
                                            {linkedShops.slice(0, 6).map((shop) => (
                                                <Link key={shop.slug} href={`/shops/${shop.slug}`} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '1rem 1.1rem', textDecoration: 'none', color: 'inherit' }}>
                                                    <p style={{ margin: 0, fontWeight: 800 }}>{shop.name}</p>
                                                    <p style={{ margin: '0.35rem 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                                        {shop.category || 'ショップ情報'}{shop.ships_to_japan === false ? ' ・ 日本直送要確認' : ' ・ 日本発送比較へ'}
                                                    </p>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {linkedBrands && linkedBrands.length > 0 && (
                                    <div style={{ background: '#fafaf9', border: '1px solid var(--border)', borderRadius: '20px', padding: '1.5rem' }}>
                                        <h2 style={{ fontSize: '1.25rem', margin: '0 0 1rem', border: 'none' }}>関連ブランドページ</h2>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                            {linkedBrands.slice(0, 6).map((brand) => (
                                                <Link key={brand.slug} href={`/brands/${brand.slug}`} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '999px', padding: '0.75rem 1rem', textDecoration: 'none', color: '#111110', fontWeight: 700 }}>
                                                    {brand.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {relatedGuides.length > 0 && (
                                    <div style={{ background: '#fafaf9', border: '1px solid var(--border)', borderRadius: '20px', padding: '1.5rem' }}>
                                        <h2 style={{ fontSize: '1.25rem', margin: '0 0 1rem', border: 'none' }}>あわせて読みたい基礎ガイド</h2>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.9rem' }}>
                                            {relatedGuides.map((guide) => (
                                                <Link key={guide.href} href={guide.href} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '1rem 1.1rem', textDecoration: 'none', color: 'inherit' }}>
                                                    <p style={{ margin: 0, fontWeight: 800 }}>{guide.title}</p>
                                                    <p style={{ margin: '0.35rem 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>関税・配送・買い方の前提知識を補強</p>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </section>
                        )}

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
