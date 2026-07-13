import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { HOME_CATEGORY_CARDS } from '@/lib/shopCategories'

export const revalidate = 3600

type FeaturedShop = { id: number; name: string; slug: string; url: string; country: string | null; category: string | null; image_url: string | null; description: string | null; ships_to_japan: boolean | null }

const SEARCH_SUGGESTIONS = [
  { label: 'SSENSE', href: '/shops?q=SSENSE' },
  { label: 'スニーカー', href: '/shops?category=' + encodeURIComponent('ファッション・スニーカー') },
  { label: 'アウトドア', href: '/shops?category=' + encodeURIComponent('スポーツ・アウトドア') },
  { label: 'ガジェット', href: '/shops?category=' + encodeURIComponent('ガジェット・家電') },
  { label: 'サプリメント', href: '/shops?category=' + encodeURIComponent('コスメ・ヘルスケア') },
] as const

function formatCount(value: number | null | undefined, fallback: string) {
  if (typeof value !== 'number' || Number.isNaN(value)) return fallback
  return value >= 1000 ? `${Math.floor(value / 100) * 100}+` : `${value}+`
}

function shippingLabel(shop: FeaturedShop) {
  if (shop.ships_to_japan) return '日本配送対応'
  if (shop.ships_to_japan === false) return '配送条件を確認'
  return '配送可否を確認'
}

export default async function Home() {
  const [shopCount, shippableCount, featuredResult] = await Promise.all([
    supabase.from('shops').select('id', { count: 'exact', head: true }),
    supabase.from('shops').select('id', { count: 'exact', head: true }).eq('ships_to_japan', true),
    supabase.from('shops').select('id, name, slug, url, country, category, image_url, description, ships_to_japan').neq('ships_to_japan', false).order('is_affiliate', { ascending: false }).order('popularity_score', { ascending: false }).order('name', { ascending: true }).limit(6),
  ])
  const featuredShops = (featuredResult.data ?? []) as FeaturedShop[]

  return <>
    <Header />
    <main id="main-content">
      <div className="op-topline"><span>OVERSEAS SHOPPING, MADE CLEARER</span><span>CURATED FOR JAPAN</span></div>
      <section className="op-hero">
        <div className="op-hero-copy">
          <p className="op-eyebrow"><span>01</span> WORLDWIDE SHOPPING DIRECTORY</p>
          <h1>世界の<br /><em>いい買いもの</em>を、<br />見つけよう。</h1>
          <p className="op-hero-lead">日本から買える海外通販を、ブランド・カテゴリ・配送条件から探せるガイドです。知らなかった一軒が、次の定番になるかもしれません。</p>
          <div className="op-stats">
            <div><strong>{formatCount(shopCount.count, '80+')}</strong><span>掲載ショップ</span></div>
            <div><strong>{formatCount(shippableCount.count, '60+')}</strong><span>日本配送対応</span></div>
            <div><strong>06</strong><span>カテゴリー</span></div>
          </div>
        </div>
        <div className="op-search-panel">
          <div className="op-panel-heading"><span>FIND A SHOP</span><b>気になるものから、探す。</b></div>
          <form action="/shops" className="op-search-form">
            <label><span>キーワード</span><input type="text" name="q" placeholder="ショップ名・ブランド名・カテゴリ" /></label>
            <label><span>カテゴリー</span><select name="category" defaultValue=""><option value="">すべてのカテゴリー</option>{HOME_CATEGORY_CARDS.map((category) => <option key={category.label} value={category.label}>{category.label}</option>)}</select></label>
            <button type="submit">ショップを探す <span>→</span></button>
          </form>
          <div className="op-suggestions"><span>POPULAR</span>{SEARCH_SUGGESTIONS.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</div>
          <p className="op-search-note">掲載情報は定期的に見直しています。購入前には各ショップの最新条件をご確認ください。</p>
        </div>
      </section>

      <section className="op-categories op-section">
        <div className="op-section-heading"><div><p className="op-eyebrow"><span>02</span> BROWSE BY CATEGORY</p><h2>いま欲しいものから、<br />世界をひらく。</h2></div><Link href="/shops" className="op-arrow-link">すべてのショップ <span>→</span></Link></div>
        <div className="op-category-grid">
          {HOME_CATEGORY_CARDS.map((category, index) => <Link key={category.label} href={category.href} className="op-category-card">
            <span className="op-category-num">0{index + 1}</span><h3>{category.label}</h3><p>{category.sub}</p><span className="op-card-arrow">→</span>
          </Link>)}
        </div>
      </section>

      {featuredShops.length > 0 && <section className="op-featured op-section">
        <div className="op-section-heading"><div><p className="op-eyebrow"><span>03</span> EDITOR&apos;S STARTING POINT</p><h2>まず、ここから。</h2></div><Link href="/shops" className="op-arrow-link">比較して探す <span>→</span></Link></div>
        <div className="op-featured-grid">
          {featuredShops.map((shop, index) => <article key={shop.id} className={`op-shop-card ${index === 0 ? 'is-lead' : ''}`}>
            <Link href={`/shops/${shop.slug}`} className="op-shop-image" aria-label={`${shop.name}の詳細を見る`}>
              {shop.image_url ? <Image src={shop.image_url} alt={shop.name} fill priority={index < 2} sizes="(max-width: 760px) 100vw, (max-width: 1050px) 50vw, 33vw" style={{ objectFit: 'cover' }} /> : <span>IMAGE<br />COMING<br />SOON</span>}
              <span className="op-image-index">{String(index + 1).padStart(2, '0')}</span>
            </Link>
            <div className="op-shop-body"><div className="op-shop-meta"><span>{shop.category}</span><span>{shop.country}</span></div><h3>{shop.name}</h3>{shop.description && <p>{shop.description}</p>}<div className="op-shop-bottom"><span>{shippingLabel(shop)}</span><a href={shop.url} target="_blank" rel="noopener noreferrer">公式サイト ↗</a></div></div>
          </article>)}
        </div>
      </section>}

      <section className="op-paths op-section"><p className="op-eyebrow"><span>04</span> MORE WAYS TO DISCOVER</p><div className="op-path-grid">
        <Link href="/brands"><span>BRANDS</span><h2>ブランドから<br />探す。</h2><p>欲しいブランドが決まっているなら、取り扱いショップを横断して探せます。</p><b>ブランド一覧 <i>→</i></b></Link>
        <Link href="/guide"><span>FIRST ORDER</span><h2>海外通販を<br />はじめる。</h2><p>関税、送料、配送まで。はじめての買いものに必要なことをまとめました。</p><b>ガイドを読む <i>→</i></b></Link>
        <Link href="/articles"><span>JOURNAL</span><h2>読む、<br />見つける。</h2><p>ブランドの背景や買いもののヒントを、もう少し深く。</p><b>読みもの一覧 <i>→</i></b></Link>
      </div></section>
      <Footer />
    </main>
  </>
}
