import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { HOME_CATEGORY_CARDS } from '@/lib/shopCategories'

export const revalidate = 3600

type FeaturedShop = {
  id: number
  name: string
  slug: string
  url: string
  country: string | null
  category: string | null
  image_url: string | null
  description: string | null
  ships_to_japan: boolean | null
}

const SEARCH_SUGGESTIONS = [
  { label: 'SSENSE', href: '/shops?q=SSENSE' },
  { label: 'スニーカー', href: '/shops?category=' + encodeURIComponent('ファッション・スニーカー') },
  { label: 'アウトドア', href: '/shops?category=' + encodeURIComponent('スポーツ・アウトドア') },
  { label: 'ガジェット', href: '/shops?category=' + encodeURIComponent('ガジェット・家電') },
  { label: 'サプリメント', href: '/shops?category=' + encodeURIComponent('コスメ・ヘルスケア') },
  { label: 'ウイスキー', href: '/shops?category=' + encodeURIComponent('ホーム・ライフスタイル') },
  { label: 'Amazon US', href: '/shops?category=' + encodeURIComponent('総合・マーケットプレイス') },
] as const

function formatCount(value: number | null | undefined, fallback: string) {
  if (typeof value !== 'number' || Number.isNaN(value)) return fallback
  if (value >= 1000) return `${Math.floor(value / 100) * 100}+`
  return `${value}+`
}

function getShopBadge(shop: FeaturedShop) {
  if (shop.ships_to_japan === true) return '日本配送OK'
  if (shop.ships_to_japan === false) return '配送条件を確認'
  return '配送可否を確認'
}

export default async function Home() {
  const [shopCountResult, shippableCountResult, featuredShopsResult] = await Promise.all([
    supabase.from('shops').select('id', { count: 'exact', head: true }),
    supabase.from('shops').select('id', { count: 'exact', head: true }).eq('ships_to_japan', true),
    supabase
      .from('shops')
      .select('id, name, slug, url, country, category, image_url, description, ships_to_japan')
      .neq('ships_to_japan', false)
      .order('is_affiliate', { ascending: false })
      .order('popularity_score', { ascending: false })
      .order('name', { ascending: true })
      .limit(6),
  ])

  const featuredShops = (featuredShopsResult.data ?? []) as FeaturedShop[]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://original-price.com/#website',
        url: 'https://original-price.com',
        name: 'Original Price',
        description: '海外通販・個人輸入の総合ディレクトリ。200以上のショップとブランドを網羅。',
        publisher: { '@id': 'https://original-price.com/#organization' },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://original-price.com/search?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
        inLanguage: 'ja',
      },
      {
        '@type': 'Organization',
        '@id': 'https://original-price.com/#organization',
        name: 'Original Price',
        url: 'https://original-price.com',
        logo: {
          '@type': 'ImageObject',
          inLanguage: 'ja',
          '@id': 'https://original-price.com/#logo',
          url: 'https://original-price.com/logo.png', // Replace with actual logo URL if available
          contentUrl: 'https://original-price.com/logo.png',
          width: 512,
          height: 512,
          caption: 'Original Price',
        },
        image: { '@id': 'https://original-price.com/#logo' },
        sameAs: [
          // Add SNS links here if available
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
      <main id="main-content">
        <div style={{ display: 'none' }}>Impact-Site-Verification: 204b2504-8f49-41e6-b979-1a1077b19bdb</div>

        <style>{`
          .home-shell {
            padding-inline: clamp(1.25rem, 5vw, 3rem);
          }
          .home-container {
            max-width: 1160px;
            margin: 0 auto;
          }
          .search-hero {
            padding-block: clamp(7rem, 13vw, 9rem) clamp(3rem, 6vw, 4.5rem);
            border-bottom: 1px solid #e5e5e3;
            background:
              radial-gradient(circle at top right, rgba(17, 17, 16, 0.06), transparent 28rem),
              linear-gradient(180deg, #ffffff 0%, #f7f7f5 100%);
          }
          .search-hero-layout {
            display: grid;
            grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
            gap: clamp(1.5rem, 4vw, 3rem);
            align-items: start;
          }
          .search-hero-copy {
            display: flex;
            flex-direction: column;
            gap: 1.4rem;
          }
          .search-lead {
            font-size: clamp(1rem, 1.7vw, 1.08rem);
            color: #5f5f5d;
            line-height: 1.8;
            max-width: 42ch;
          }
          .search-form-shell {
            background: rgba(255, 255, 255, 0.94);
            border: 1px solid #e5e5e3;
            border-radius: 28px;
            padding: clamp(1rem, 2.5vw, 1.35rem);
            box-shadow: 0 18px 50px rgba(17, 17, 16, 0.08);
          }
          .search-form {
            display: grid;
            grid-template-columns: minmax(0, 1.5fr) minmax(160px, 0.75fr) auto;
            gap: 0.8rem;
            align-items: stretch;
          }
          .search-field {
            display: flex;
            flex-direction: column;
            gap: 0.45rem;
          }
          .search-label {
            font-size: 0.74rem;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: #8a8a88;
          }
          .search-input,
          .search-select {
            width: 100%;
            min-height: 52px;
            border: 1px solid #dfdfdc;
            border-radius: 16px;
            background: #ffffff;
            color: #111110;
            font-size: 0.96rem;
            padding: 0 1rem;
            outline: none;
          }
          .search-input:focus,
          .search-select:focus {
            border-color: #111110;
          }
          .search-submit {
            min-height: 52px;
            align-self: end;
            border: none;
            border-radius: 16px;
            background: #111110;
            color: #fafaf9;
            padding: 0 1.25rem;
            font-size: 0.95rem;
            font-weight: 700;
            cursor: pointer;
          }
          .suggestion-row {
            display: flex;
            flex-wrap: wrap;
            gap: 0.65rem;
            margin-top: 1rem;
          }
          .suggestion-chip {
            display: inline-flex;
            align-items: center;
            padding: 0.62rem 0.9rem;
            border-radius: 999px;
            border: 1px solid #e5e5e3;
            background: #ffffff;
            font-size: 0.84rem;
            font-weight: 600;
            color: #333332;
          }
          .search-meta {
            display: flex;
            gap: 2rem;
            flex-wrap: wrap;
            padding-top: 0.2rem;
          }
          .hero-panel {
            background: rgba(255, 255, 255, 0.92);
            border: 1px solid #e5e5e3;
            border-radius: 24px;
            padding: 1.25rem;
            box-shadow: 0 18px 48px rgba(17, 17, 16, 0.06);
          }
          .hero-panel-list {
            display: grid;
            gap: 0.8rem;
            margin-top: 1rem;
          }
          .hero-panel-item {
            display: grid;
            grid-template-columns: auto 1fr auto;
            gap: 0.75rem;
            align-items: center;
            padding: 0.85rem 0.9rem;
            border-radius: 16px;
            background: #fcfcfb;
            border: 1px solid #efefec;
          }
          .hero-panel-rank {
            width: 1.8rem;
            height: 1.8rem;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 999px;
            background: #111110;
            color: #fafaf9;
            font-size: 0.75rem;
            font-weight: 700;
          }
          .section-link {
            font-size: 0.82rem;
            font-weight: 600;
            color: #6b6b69;
            text-decoration: none;
            border-bottom: 1px solid #c8c8c6;
            padding-bottom: 1px;
            white-space: nowrap;
          }
          .section-link:hover {
            color: #111110;
            border-color: #111110;
          }
          .category-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 1px;
            background: #e5e5e3;
            border: 1px solid #e5e5e3;
            border-radius: 18px;
            overflow: hidden;
          }
          .category-card {
            background: #ffffff;
            padding: 1.6rem 1.4rem;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            min-height: 150px;
            position: relative;
          }
          .category-card::after {
            content: '→';
            position: absolute;
            right: 1.2rem;
            bottom: 1.1rem;
            color: #c8c8c6;
          }
          .results-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 1rem;
          }
          .result-card {
            border: 1px solid #e5e5e3;
            border-radius: 18px;
            overflow: hidden;
            background: #ffffff;
            display: flex;
            flex-direction: column;
            transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
          }
          .result-card:hover {
            transform: translateY(-2px);
            border-color: #d0d0ce;
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.07);
          }
          .result-image {
            position: relative;
            width: 100%;
            aspect-ratio: 16 / 10;
            background: #f3f3f1;
          }
          .result-body {
            padding: 1.1rem 1.1rem 1.2rem;
            display: flex;
            flex-direction: column;
            gap: 0.7rem;
            flex: 1;
          }
          .result-badges {
            display: flex;
            flex-wrap: wrap;
            gap: 0.45rem;
          }
          .result-badge {
            display: inline-flex;
            align-items: center;
            padding: 0.28rem 0.62rem;
            border-radius: 999px;
            font-size: 0.72rem;
            font-weight: 700;
            background: #f3f3f1;
            color: #333332;
          }
          .result-desc {
            font-size: 0.88rem;
            color: #6b6b69;
            line-height: 1.7;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .result-actions {
            display: flex;
            gap: 0.75rem;
            flex-wrap: wrap;
            margin-top: auto;
          }
          .entry-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 1rem;
          }
          .entry-card {
            border: 1px solid #e5e5e3;
            border-radius: 20px;
            background: #ffffff;
            padding: 1.35rem;
          }
          @media (max-width: 980px) {
            .search-hero-layout,
            .results-grid,
            .entry-grid {
              grid-template-columns: 1fr;
            }
            .search-form {
              grid-template-columns: 1fr;
            }
          }
          @media (max-width: 768px) {
            .category-grid {
              grid-template-columns: 1fr;
            }
          }
          @media (max-width: 640px) {
            .search-hero {
              padding-top: 6.5rem;
            }
          }
        `}</style>

        <section className="search-hero home-shell">
          <div className="home-container search-hero-layout">
            <div className="search-hero-copy">
              <div>
                <span className="tag">shop search</span>
              </div>

              <div>
                <h1
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(3rem, 7vw, 5.3rem)',
                    fontWeight: 700,
                    letterSpacing: '-0.045em',
                    lineHeight: 1.02,
                    color: '#111110',
                  }}
                >
                  海外通販サイトを
                  <br />
                  検索して見つける。
                </h1>
              </div>

              <p className="search-lead">
                ショップ名でも、カテゴリでも探せます。日本から使いやすい海外通販サイトを一覧でチェックできます。
              </p>

              <div className="search-form-shell">
                <form action="/shops" className="search-form">
                  <label className="search-field">
                    <span className="search-label">キーワード</span>
                    <input
                      type="text"
                      name="q"
                      className="search-input"
                      placeholder="ショップ名・ブランド名・カテゴリ"
                    />
                  </label>

                  <label className="search-field">
                    <span className="search-label">カテゴリ</span>
                    <select name="category" className="search-select" defaultValue="">
                      <option value="">すべて</option>
                      {HOME_CATEGORY_CARDS.map((category) => (
                        <option key={category.label} value={category.label}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <button type="submit" className="search-submit">検索する</button>
                </form>

                <div className="suggestion-row" aria-label="人気の検索">
                  {SEARCH_SUGGESTIONS.map((item) => (
                    <Link key={item.href} href={item.href} className="suggestion-chip">
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="search-meta">
                <div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1 }}>
                    {formatCount(shopCountResult.count, '80+')}
                  </div>
                  <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#8a8a88', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '0.35rem' }}>
                    掲載ショップ
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1 }}>
                    {formatCount(shippableCountResult.count, '60+')}
                  </div>
                  <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#8a8a88', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '0.35rem' }}>
                    日本配送対応
                  </div>
                </div>
              </div>
            </div>

            <aside className="hero-panel">
              <p className="section-label" style={{ marginBottom: 0 }}>人気ショップ</p>
              <h2 style={{ fontSize: '1.35rem', letterSpacing: '-0.03em', lineHeight: 1.3 }}>
                よく見られている候補
              </h2>
              <div className="hero-panel-list">
                {featuredShops.slice(0, 4).map((shop, index) => (
                  <Link key={shop.id} href={`/shops/${shop.slug}`} className="hero-panel-item">
                    <span className="hero-panel-rank">{index + 1}</span>
                    <div>
                      <p style={{ fontWeight: 700, lineHeight: 1.35 }}>{shop.name}</p>
                      <p style={{ fontSize: '0.82rem', color: '#6b6b69', marginTop: '0.15rem' }}>
                        {[shop.category, shop.country].filter(Boolean).join(' / ')}
                      </p>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#8a8a88', fontWeight: 700 }}>→</span>
                  </Link>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section
          className="home-shell"
          style={{
            paddingBlock: 'clamp(3.8rem, 7vw, 5rem)',
            borderBottom: '1px solid #e5e5e3',
            background: '#fafaf9',
          }}
        >
          <div className="home-container">
            <div style={{ marginBottom: 'clamp(2rem, 4vw, 2.6rem)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                <div>
                  <p className="section-label">カテゴリ検索</p>
                  <h2 className="section-title">カテゴリからすばやく絞る。</h2>
                </div>
                <Link href="/shops" className="section-link">
                  すべてのショップを見る →
                </Link>
              </div>
            </div>

            <div className="category-grid">
              {HOME_CATEGORY_CARDS.map((category, index) => (
                <Link key={category.label} href={category.href} className="category-card">
                  <span style={{ fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.12em', color: '#111110' }}>
                    0{index + 1}
                  </span>
                  <span style={{ fontSize: '0.98rem', fontWeight: 700, lineHeight: 1.4, letterSpacing: '-0.02em' }}>
                    {category.label}
                  </span>
                  <span style={{ fontSize: '0.82rem', color: '#7a7a78', lineHeight: 1.65 }}>
                    {category.sub}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {featuredShops.length > 0 && (
          <section
            className="home-shell featured-shops-section"
            style={{
              paddingBlock: 'clamp(4rem, 7vw, 5.5rem)',
              borderBottom: '1px solid #e5e5e3',
              background: '#ffffff',
            }}
          >
            <div className="home-container">
              <div style={{ marginBottom: 'clamp(2rem, 4vw, 2.6rem)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                  <div>
                    <p className="section-label">検索結果の一例</p>
                    <h2 className="section-title">まず見ておきたいサイト。</h2>
                  </div>
                  <Link href="/shops" className="section-link">
                    一覧ページで比較する →
                  </Link>
                </div>
              </div>

              <div className="results-grid">
                {featuredShops.map((shop, index) => (
                  <article key={shop.id} className="result-card" style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
                    {/* 1. 最背面に公式サイトへのリンクを配置 */}
                    <a 
                      href={shop.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        right: 0, 
                        bottom: 0, 
                        zIndex: 1,
                        borderRadius: '18px'
                      }}
                      aria-label={`${shop.name}の公式サイトへ移動`}
                    />
                    <div className="result-image" style={{ zIndex: 0 }}>
                      {shop.image_url ? (
                        <Image
                          src={shop.image_url}
                          alt={shop.name}
                          fill
                          priority={index < 2}
                          fetchPriority={index < 2 ? "high" : undefined}
                          sizes="(max-width: 980px) 100vw, 50vw"
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a1a19f' }}>
                          画像準備中
                        </div>
                      )}
                    </div>
                    <div className="result-body" style={{ 
                      position: 'relative', 
                      zIndex: 2, 
                      pointerEvents: 'none' 
                    }}>
                      <div className="result-badges">
                        {shop.category && <span className="result-badge">{shop.category}</span>}
                        {shop.country && <span className="result-badge">{shop.country}</span>}
                        <span className="result-badge">{getShopBadge(shop)}</span>
                      </div>
                      <h3 style={{ fontSize: '1.12rem', lineHeight: 1.35, letterSpacing: '-0.02em' }}>
                        {shop.name}
                      </h3>
                      {shop.description && (
                        <p className="result-desc">{shop.description}</p>
                      )}
                      <div className="result-actions" style={{ position: 'relative', zIndex: 3, pointerEvents: 'auto' }}>
                        <Link href={`/shops/${shop.slug}`} style={{ fontSize: '0.83rem', fontWeight: 700 }}>
                          詳細を見る →
                        </Link>
                        <a href={shop.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.83rem', fontWeight: 700, color: '#6b6b69', textDecoration: 'none' }}>
                          公式サイト ↗
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        <section
          className="home-shell categories-entry-section"
          style={{
            paddingBlock: 'clamp(3.8rem, 7vw, 5rem)',
            borderBottom: '1px solid #e5e5e3',
            background: '#fafaf9',
          }}
        >
          <div className="home-container">
            <div style={{ marginBottom: 'clamp(2rem, 4vw, 2.4rem)' }}>
              <p className="section-label">探し方</p>
              <h2 className="section-title">ブランドや一覧からも探せます。</h2>
            </div>

            <div className="entry-grid">
              <Link href="/brands" className="entry-card">
                <h3 style={{ fontSize: '1.05rem', letterSpacing: '-0.02em', lineHeight: 1.4 }}>ブランドから探す</h3>
                <p style={{ marginTop: '0.5rem', color: '#5f5f5d', lineHeight: 1.75, fontSize: '0.9rem' }}>
                  欲しいブランドが決まっているときは、取り扱いショップをブランド一覧から探せます。
                </p>
              </Link>

              <Link href="/shops" className="entry-card">
                <h3 style={{ fontSize: '1.05rem', letterSpacing: '-0.02em', lineHeight: 1.4 }}>ショップ一覧で比較する</h3>
                <p style={{ marginTop: '0.5rem', color: '#5f5f5d', lineHeight: 1.75, fontSize: '0.9rem' }}>
                  まとめて見比べたいときは、一覧ページでカテゴリやキーワードを組み合わせて探せます。
                </p>
              </Link>

              <Link href="/guide" className="entry-card">
                <h3 style={{ fontSize: '1.05rem', letterSpacing: '-0.02em', lineHeight: 1.4 }}>ガイドを読む</h3>
                <p style={{ marginTop: '0.5rem', color: '#5f5f5d', lineHeight: 1.75, fontSize: '0.9rem' }}>
                  海外通販の流れを先に確認したいときは、基本ガイドから始められます。
                </p>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  )
}
