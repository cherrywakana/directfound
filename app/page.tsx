import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

const SUPABASE_URL = 'https://ggmcgokdtmflioqezrqk.supabase.co/storage/v1/object/public'

// Shop thumbnails we know exist
const SHOP_IMAGES = [
  { slug: 'farfetch',    name: 'FARFETCH' },
  { slug: 'harrods',    name: 'HARRODS' },
  { slug: 'cettire',    name: 'CETTIRE' },
  { slug: 'giglio',     name: 'GIGLIO' },
  { slug: '24s',        name: '24S' },
  { slug: 'antonioli',  name: 'ANTONIOLI' },
]

const MARQUEE_NAMES = [
  'SSENSE', 'FARFETCH', 'HARRODS', 'SELFRIDGES', 'MYTHERESA',
  'MR PORTER', 'NET-A-PORTER', 'CETTIRE', 'GIGLIO', '24S',
  'ANTONIOLI', 'LUISAVIAROMA', 'YOOX', 'REVOLVE', 'NORDSTROM',
  'STOCKX', 'GOAT', 'END.', 'KITH', 'DOVER STREET',
]

const CATEGORIES = [
  { label: 'ストリート・スニーカー', sub: '国内未発売も即購入', href: '/shops?category=' + encodeURIComponent('ストリート・スニーカー') },
  { label: 'ラグジュアリー・百貨店', sub: '公式より安く、正規品で', href: '/shops?category=' + encodeURIComponent('ラグジュアリー・百貨店') },
  { label: 'セレクト・トレンド', sub: '世界のセレクトを一気に', href: '/shops?category=' + encodeURIComponent('セレクト・トレンド') },
  { label: 'アウトドア', sub: '希少モデルを国内定価以下で', href: '/shops?category=' + encodeURIComponent('アウトドア') },
  { label: 'コスメ・ビューティー', sub: '正規品を最安値で', href: '/shops?category=' + encodeURIComponent('コスメ・ビューティー') },
  { label: 'ヴィンテージ・古着', sub: '一点物との偶然の出会い', href: '/shops?category=' + encodeURIComponent('ヴィンテージ・古着') },
]

export default async function Home() {
  const { data: articles } = await supabase
    .from('posts')
    .select('title, slug, thumbnail_url, category, created_at')
    .not('thumbnail_url', 'is', null)
    .order('created_at', { ascending: false })
    .limit(3)

  return (
    <>
      <Header />
      <main>
        <style>{`
          /* ─── Marquee ─── */
          @keyframes marquee {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
          .marquee-track {
            display: flex;
            width: max-content;
            animation: marquee 28s linear infinite;
          }
          .marquee-track:hover { animation-play-state: paused; }
          .marquee-item {
            display: inline-flex;
            align-items: center;
            gap: 1.5rem;
            padding: 0 1.5rem;
            font-size: 0.72rem;
            font-weight: 700;
            letter-spacing: 0.14em;
            color: #a1a19f;
            white-space: nowrap;
          }
          .marquee-dot {
            width: 3px;
            height: 3px;
            background: #d4d4d2;
            border-radius: 50%;
            flex-shrink: 0;
          }

          /* ─── Hero image grid ─── */
          .hero-img-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: repeat(3, 120px);
            gap: 8px;
            width: 340px;
            flex-shrink: 0;
          }
          @media (max-width: 900px) {
            .hero-img-grid { display: none; }
          }
          .hero-img-item {
            border-radius: 10px;
            overflow: hidden;
            background: #f0f0ee;
          }
          .hero-img-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            transition: transform 0.4s ease;
          }
          .hero-img-item:hover img { transform: scale(1.04); }
          .hero-img-item.tall { grid-row: span 2; }

          /* ─── Category grid ─── */
          .cat-grid-v2 {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1px;
            background: #e5e5e3;
            border: 1px solid #e5e5e3;
            border-radius: 14px;
            overflow: hidden;
          }
          @media (max-width: 640px) {
            .cat-grid-v2 { grid-template-columns: repeat(2, 1fr); }
          }
          .cat-item-v2 {
            background: #ffffff;
            padding: 1.75rem 1.5rem;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            text-decoration: none;
            color: inherit;
            transition: background 0.15s;
            position: relative;
            overflow: hidden;
          }
          .cat-item-v2::after {
            content: '→';
            position: absolute;
            bottom: 1.25rem;
            right: 1.25rem;
            font-size: 0.9rem;
            color: #c8c8c6;
            transition: color 0.15s, transform 0.15s;
          }
          .cat-item-v2:hover { background: #fafaf9; }
          .cat-item-v2:hover::after { color: #111110; transform: translate(2px, -2px); }
          .cat-num {
            font-size: 0.65rem;
            font-weight: 700;
            letter-spacing: 0.12em;
            color: #c8c8c6;
            margin-bottom: 0.25rem;
          }
          .cat-name-v2 {
            font-size: 0.95rem;
            font-weight: 700;
            color: #111110;
            letter-spacing: -0.02em;
            line-height: 1.3;
          }
          .cat-sub {
            font-size: 0.78rem;
            color: #a1a19f;
            line-height: 1.5;
            margin-top: 0.15rem;
          }

          /* ─── Article cards ─── */
          .articles-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1.25rem;
          }
          @media (max-width: 768px) {
            .articles-grid { grid-template-columns: 1fr; }
          }
          .article-card-v2 {
            display: flex;
            flex-direction: column;
            border: 1px solid #e5e5e3;
            border-radius: 12px;
            overflow: hidden;
            background: #ffffff;
            text-decoration: none;
            color: inherit;
            transition: box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s;
          }
          .article-card-v2:hover {
            box-shadow: 0 12px 32px rgba(0,0,0,0.07);
            transform: translateY(-3px);
            border-color: #d0d0ce;
          }
          .article-card-img {
            width: 100%;
            aspect-ratio: 16/9;
            object-fit: cover;
            display: block;
            background: #f3f3f1;
          }
          .article-card-body {
            padding: 1.25rem 1.25rem 1.5rem;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            flex: 1;
          }
          .article-card-cat {
            font-size: 0.65rem;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: #a1a19f;
          }
          .article-card-title {
            font-size: 0.9rem;
            font-weight: 700;
            color: #111110;
            letter-spacing: -0.02em;
            line-height: 1.45;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .article-card-link {
            margin-top: auto;
            font-size: 0.75rem;
            font-weight: 600;
            color: #a1a19f;
            letter-spacing: 0.04em;
          }
        `}</style>

        {/* ════════════════════════════════ HERO */}
        <section style={{
          padding: 'clamp(8rem, 14vw, 10rem) clamp(1.25rem, 5vw, 3rem) clamp(4rem, 6vw, 5rem)',
          borderBottom: '1px solid #e5e5e3',
        }}>
          <div style={{
            maxWidth: '1160px', margin: '0 auto',
            display: 'flex', alignItems: 'center',
            gap: 'clamp(2rem, 5vw, 5rem)',
          }}>
            {/* Left text */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="fade-up delay-1">
                <span className="tag">Direct Found — 海外通販ガイド</span>
              </div>

              <h1 className="fade-up delay-2" style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(3rem, 7.5vw, 6rem)',
                fontWeight: 700,
                letterSpacing: '-0.035em',
                lineHeight: 1.02,
                color: '#111110',
              }}>
                世界中のショッピングを、<br />
                <em style={{ fontStyle: 'italic', color: '#888886' }}>日本から。</em>
              </h1>

              <p className="fade-up delay-3" style={{
                fontSize: 'clamp(0.95rem, 1.5vw, 1.05rem)',
                color: '#6b6b69',
                lineHeight: 1.75,
                maxWidth: '40ch',
                letterSpacing: '-0.01em',
              }}>
                日本発送対応の海外通販サイトを厳選。
                ブランドから探せて、関税や送料の情報もひと目でわかります。
              </p>

              <div className="fade-up delay-4" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link href="/shops" className="btn btn-primary">ショップを探す →</Link>
                <Link href="/brands" className="btn btn-secondary">ブランドから探す</Link>
              </div>

              {/* Stats row */}
              <div className="fade-up delay-5" style={{
                display: 'flex', gap: '2.5rem', paddingTop: '1rem',
                borderTop: '1px solid #e5e5e3', flexWrap: 'wrap',
              }}>
                {[
                  { v: '60+', l: '掲載ショップ' },
                  { v: '20+', l: '注目ブランド' },
                  { v: '50+', l: 'ガイド記事' },
                ].map(s => (
                  <div key={s.l}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.04em', color: '#111110', lineHeight: 1 }}>{s.v}</div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#a1a19f', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '0.3rem' }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: shop image mosaic */}
            <div className="hero-img-grid fade-in delay-3">
              {/* Row 1: tall left + normal right */}
              <div className="hero-img-item tall">
                <img src={`${SUPABASE_URL}/shop-thumbnails/farfetch.webp`} alt="FARFETCH" loading="lazy" />
              </div>
              <div className="hero-img-item">
                <img src={`${SUPABASE_URL}/shop-thumbnails/harrods.webp`} alt="HARRODS" loading="lazy" />
              </div>
              <div className="hero-img-item">
                <img src={`${SUPABASE_URL}/shop-thumbnails/cettire.webp`} alt="CETTIRE" loading="lazy" />
              </div>
              {/* Row 2: normal + tall right */}
              <div className="hero-img-item">
                <img src={`${SUPABASE_URL}/shop-thumbnails/giglio.webp`} alt="GIGLIO" loading="lazy" />
              </div>
              <div className="hero-img-item tall">
                <img src={`${SUPABASE_URL}/shop-thumbnails/24s.webp`} alt="24S" loading="lazy" />
              </div>
              <div className="hero-img-item">
                <img src={`${SUPABASE_URL}/shop-thumbnails/antonioli.webp`} alt="ANTONIOLI" loading="lazy" />
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════ MARQUEE */}
        <div style={{
          borderBottom: '1px solid #e5e5e3',
          padding: '1rem 0',
          overflow: 'hidden',
          background: '#ffffff',
        }}>
          <div className="marquee-track">
            {[...MARQUEE_NAMES, ...MARQUEE_NAMES].map((name, i) => (
              <span key={i} className="marquee-item">
                {name}
                <span className="marquee-dot" />
              </span>
            ))}
          </div>
        </div>

        {/* ════════════════════════════════ CATEGORIES */}
        <section style={{
          padding: 'clamp(4rem, 7vw, 6rem) clamp(1.25rem, 5vw, 3rem)',
          borderBottom: '1px solid #e5e5e3',
          background: '#fafaf9',
        }}>
          <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
            <div style={{ marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
              <p className="section-label">カテゴリ</p>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                <h2 className="section-title">何をお探しですか？</h2>
                <Link href="/shops" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#6b6b69', textDecoration: 'none', borderBottom: '1px solid #c8c8c6', paddingBottom: '1px', whiteSpace: 'nowrap' }}>
                  すべて見る →
                </Link>
              </div>
            </div>

            <div className="cat-grid-v2">
              {CATEGORIES.map((cat, i) => (
                <Link key={cat.label} href={cat.href} className="cat-item-v2">
                  <span className="cat-num">0{i + 1}</span>
                  <span className="cat-name-v2">{cat.label}</span>
                  <span className="cat-sub">{cat.sub}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════ LATEST ARTICLES */}
        {articles && articles.length > 0 && (
          <section style={{
            padding: 'clamp(4rem, 7vw, 6rem) clamp(1.25rem, 5vw, 3rem)',
            borderBottom: '1px solid #e5e5e3',
            background: '#ffffff',
          }}>
            <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
              <div style={{ marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
                <p className="section-label">記事</p>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                  <h2 className="section-title">最新のガイドを読む。</h2>
                  <Link href="/articles" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#6b6b69', textDecoration: 'none', borderBottom: '1px solid #c8c8c6', paddingBottom: '1px', whiteSpace: 'nowrap' }}>
                    すべての記事 →
                  </Link>
                </div>
              </div>

              <div className="articles-grid">
                {articles.map((article) => (
                  <Link key={article.slug} href={`/articles/${article.slug}`} className="article-card-v2">
                    {article.thumbnail_url && (
                      <img
                        src={article.thumbnail_url}
                        alt={article.title}
                        className="article-card-img"
                        loading="lazy"
                      />
                    )}
                    <div className="article-card-body">
                      {article.category && (
                        <span className="article-card-cat">{article.category}</span>
                      )}
                      <h3 className="article-card-title">{article.title}</h3>
                      <span className="article-card-link">続きを読む →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ════════════════════════════════ DARK CTA */}
        <section style={{
          padding: 'clamp(4rem, 8vw, 7rem) clamp(1.25rem, 5vw, 3rem)',
          background: '#111110',
        }}>
          <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', gap: '3rem', flexWrap: 'wrap',
            }}>
              <div>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', color: '#555553', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                  はじめての方へ
                </p>
                <h2 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  color: '#fafaf9',
                  lineHeight: 1.1,
                  maxWidth: '20ch',
                }}>
                  海外通販、<br />
                  <em style={{ fontStyle: 'italic', color: 'rgba(250,250,249,0.45)' }}>はじめてみませんか。</em>
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flexShrink: 0 }}>
                <Link href="/guide" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  background: '#fafaf9', color: '#111110',
                  padding: '0.85rem 1.75rem', borderRadius: '6px',
                  fontSize: '0.875rem', fontWeight: 700,
                  textDecoration: 'none', letterSpacing: '-0.01em',
                  transition: 'background 0.15s',
                }}>
                  初心者ガイドを読む →
                </Link>
                <Link href="/articles" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  color: '#555553',
                  padding: '0.85rem 1.75rem', borderRadius: '6px',
                  border: '1px solid #2a2a28',
                  fontSize: '0.875rem', fontWeight: 600,
                  textDecoration: 'none', letterSpacing: '-0.01em',
                  transition: 'border-color 0.15s, color 0.15s',
                }}>
                  ブランド記事一覧
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
