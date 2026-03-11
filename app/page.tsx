'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

const categories = [
  { label: 'ストリート・スニーカー', icon: '👟', href: '/shops?category=' + encodeURIComponent('ストリート・スニーカー') },
  { label: 'ラグジュアリー・百貨店', icon: '💎', href: '/shops?category=' + encodeURIComponent('ラグジュアリー・百貨店') },
  { label: 'セレクト・トレンド', icon: '✦',  href: '/shops?category=' + encodeURIComponent('セレクト・トレンド') },
  { label: 'コスメ・ビューティー', icon: '◈',  href: '/shops?category=' + encodeURIComponent('コスメ・ビューティー'), isNew: true },
  { label: 'アウトドア', icon: '⛰', href: '/shops?category=' + encodeURIComponent('アウトドア') },
  { label: 'アウトレット・リセール', icon: '◷', href: '/shops?category=' + encodeURIComponent('アウトレット・リセール') },
  { label: 'アジア・トレンド', icon: '✿',  href: '/shops?category=' + encodeURIComponent('アジア・トレンド') },
  { label: 'ヴィンテージ・古着', icon: '◈',  href: '/shops?category=' + encodeURIComponent('ヴィンテージ・古着'), isNew: true },
]

const stats = [
  { value: '60+', label: '掲載ショップ' },
  { value: '20+', label: '注目ブランド' },
  { value: '50+', label: 'ガイド記事' },
]

const features = [
  { 
    num: '01',
    title: '日本発送対応のみ',
    body: '日本への発送に対応しているショップだけを厳選。安心して購入できます。'
  },
  {
    num: '02',
    title: '関税・送料も丸わかり',
    body: '初めての方でも安心。関税や送料の仕組みをわかりやすく解説しています。'
  },
  {
    num: '03',
    title: 'ブランドから探せる',
    body: '欲しいブランドがどのショップで買えるかを一発で検索できます。'
  },
]

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <style>{`
          /* ─── Page-level styles ─── */
          .home-hero {
            padding: clamp(8rem, 14vw, 11rem) clamp(1.25rem, 5vw, 3rem) clamp(5rem, 8vw, 7rem);
            border-bottom: 1px solid #e5e5e3;
          }
          .hero-inner {
            max-width: 1160px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 3rem;
            align-items: end;
          }
          @media (max-width: 720px) {
            .hero-inner { grid-template-columns: 1fr; }
            .hero-stats { display: none !important; }
          }

          .hero-headline {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: clamp(2.8rem, 7vw, 5.5rem);
            font-weight: 700;
            letter-spacing: -0.03em;
            line-height: 1.06;
            color: #111110;
          }
          .hero-headline em {
            font-style: italic;
            color: #555553;
          }
          .hero-sub {
            font-size: clamp(0.95rem, 1.5vw, 1.05rem);
            color: #6b6b69;
            line-height: 1.75;
            letter-spacing: -0.01em;
            max-width: 44ch;
          }

          /* ─── Section layout ─── */
          .section {
            padding: clamp(4rem, 7vw, 6rem) clamp(1.25rem, 5vw, 3rem);
            border-bottom: 1px solid #e5e5e3;
          }
          .section-inner {
            max-width: 1160px;
            margin: 0 auto;
          }
          .section-header {
            margin-bottom: clamp(2rem, 4vw, 3.5rem);
          }

          /* ─── Category grid ─── */
          .cat-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(min(100%, 190px), 1fr));
            gap: 1px;
            border: 1px solid #e5e5e3;
            border-radius: 12px;
            overflow: hidden;
            background: #e5e5e3;
          }
          .cat-item {
            background: #fafaf9;
            padding: 1.75rem 1.25rem;
            text-decoration: none;
            color: #111110;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            position: relative;
            transition: background 0.15s ease;
          }
          .cat-item:hover { background: #ffffff; }
          .cat-icon {
            font-size: 1.4rem;
            line-height: 1;
          }
          .cat-label {
            font-size: 0.875rem;
            font-weight: 600;
            letter-spacing: -0.01em;
            color: #1a1a19;
          }
          .cat-arrow {
            font-size: 0.8rem;
            color: #a1a19f;
            margin-top: auto;
          }
          .cat-badge {
            position: absolute;
            top: 0.75rem; right: 0.75rem;
            background: #111110; color: #fafaf9;
            font-size: 0.6rem; font-weight: 800;
            letter-spacing: 0.06em;
            padding: 2px 7px;
            border-radius: 9999px;
          }

          /* ─── Features ─── */
          .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
            gap: 1px;
            border: 1px solid #e5e5e3;
            border-radius: 12px;
            overflow: hidden;
            background: #e5e5e3;
          }
          .feature-item {
            background: #fafaf9;
            padding: clamp(1.5rem, 3vw, 2.5rem);
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          .feature-num {
            font-size: 0.7rem;
            font-weight: 700;
            letter-spacing: 0.12em;
            color: #a1a19f;
          }
          .feature-title {
            font-size: 1.05rem;
            font-weight: 700;
            letter-spacing: -0.02em;
            color: #111110;
            line-height: 1.4;
          }
          .feature-body {
            font-size: 0.875rem;
            color: #6b6b69;
            line-height: 1.72;
          }

          /* ─── CTA Banner ─── */
          .cta-banner {
            background: #111110;
            border-radius: 16px;
            padding: clamp(2.5rem, 5vw, 4rem) clamp(2rem, 5vw, 4rem);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 2rem;
            flex-wrap: wrap;
          }
          .cta-banner-text {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: clamp(1.6rem, 3.5vw, 2.25rem);
            font-weight: 700;
            color: #fafaf9;
            letter-spacing: -0.02em;
            line-height: 1.25;
            max-width: 36ch;
          }
          .cta-banner-text em {
            font-style: italic;
            color: rgba(250,250,249,0.6);
          }
          .btn-invert {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: #fafaf9;
            color: #111110;
            padding: 0.75rem 1.6rem;
            border-radius: 6px;
            font-size: 0.875rem;
            font-weight: 700;
            letter-spacing: -0.01em;
            text-decoration: none;
            white-space: nowrap;
            flex-shrink: 0;
            transition: all 0.18s ease;
          }
          .btn-invert:hover {
            background: #e8e8e6;
          }
        `}</style>

        {/* ═══════════════════════════════════ HERO */}
        <section className="home-hero">
          <div className="hero-inner">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              {/* Label */}
              <div className="fade-up delay-1">
                <span className="tag">海外通販ガイド — Japan</span>
              </div>

              <h1 className="hero-headline fade-up delay-2">
                世界中のショッピングを、<br />
                <em>日本から。</em>
              </h1>

              <p className="hero-sub fade-up delay-3">
                日本発送対応の海外通販サイトを厳選してご紹介。<br />
                ブランドから探せて、関税や送料の情報もわかります。
              </p>

              <div className="fade-up delay-4" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link href="/shops" className="btn btn-primary">ショップを探す →</Link>
                <Link href="/articles" className="btn btn-secondary">ガイドを読む</Link>
              </div>
            </div>

            {/* Stats */}
            <div className="hero-stats fade-in delay-5" style={{
              display: 'flex', flexDirection: 'column', gap: '0',
              border: '1px solid #e5e5e3', borderRadius: '12px',
              overflow: 'hidden', minWidth: '160px',
            }}>
              {stats.map((s, i) => (
                <div key={s.label} style={{
                  padding: '1.5rem 1.75rem',
                  borderBottom: i < stats.length - 1 ? '1px solid #e5e5e3' : 'none',
                }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.04em', color: '#111110' }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#a1a19f', letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: '0.25rem' }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════ CATEGORIES */}
        <section className="section">
          <div className="section-inner">
            <div className="section-header">
              <p className="section-label">カテゴリ</p>
              <h2 className="section-title">何をお探しですか？</h2>
            </div>

            <div className="cat-grid">
              {categories.map((cat: any) => (
                <Link key={cat.label} href={cat.href} className="cat-item">
                  {cat.isNew && <span className="cat-badge">NEW</span>}
                  <div className="cat-icon">{cat.icon}</div>
                  <div className="cat-label">{cat.label}</div>
                  <div className="cat-arrow">→</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════ FEATURES */}
        <section className="section">
          <div className="section-inner">
            <div className="section-header">
              <p className="section-label">特徴</p>
              <h2 className="section-title">安心して海外通販を。</h2>
            </div>

            <div className="features-grid">
              {features.map((f) => (
                <div key={f.num} className="feature-item">
                  <span className="feature-num">{f.num}</span>
                  <h3 className="feature-title">{f.title}</h3>
                  <p className="feature-body">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════ CTA BANNER */}
        <section className="section" style={{ border: 'none' }}>
          <div className="section-inner">
            <div className="cta-banner">
              <p className="cta-banner-text">
                海外通販、<em>はじめてみませんか。</em>
              </p>
              <Link href="/articles" className="btn-invert">
                ガイド記事を読む →
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  )
}
