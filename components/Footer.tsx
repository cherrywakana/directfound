import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link href="/" className="site-logo">
            <span className="site-logo-mark">OP</span>
            <span><span className="site-logo-name">Original Price</span><span className="site-logo-kicker">GLOBAL SHOPPING GUIDE</span></span>
          </Link>
          <p>海外で見つけた、まだ知らない選択肢を。日本に送れるショップを、買いものの手がかりと一緒に届けます。</p>
        </div>
        <div className="footer-links"><p>DISCOVER</p><Link href="/shops">ショップ一覧</Link><Link href="/brands">ブランド一覧</Link><Link href="/articles">読みもの</Link></div>
        <div className="footer-links"><p>ABOUT</p><Link href="/guide">海外通販ガイド</Link><Link href="/about">Original Priceについて</Link><Link href="/privacy">プライバシーポリシー</Link></div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Original Price</span><a href="https://note.com/world_shopping" target="_blank" rel="noopener noreferrer">Official note ↗</a></div>
    </footer>
  )
}
