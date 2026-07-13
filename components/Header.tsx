'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const navLinks = [
  { label: 'ショップを探す', href: '/shops' },
  { label: 'ブランドから探す', href: '/brands' },
  { label: '読みもの', href: '/articles' },
  { label: 'はじめての方へ', href: '/guide' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <Link href="/" className="site-logo" aria-label="Original Price ホーム">
        <span className="site-logo-mark">OP</span>
        <span>
          <span className="site-logo-name">Original Price</span>
          <span className="site-logo-kicker">GLOBAL SHOPPING GUIDE</span>
        </span>
      </Link>

      <div className="header-actions">
        <nav className="desktop-nav" aria-label="メインメニュー">
          {navLinks.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
        </nav>
        <Link href="/search" className="header-search" aria-label="サイト内を検索">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4 4" /></svg>
          <span>検索</span>
        </Link>
        <button className="mobile-toggle" aria-label="メニュー" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </div>

      {menuOpen && (
        <nav className="mobile-menu" aria-label="モバイルメニュー">
          {navLinks.map((link) => <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}<span>↗</span></Link>)}
        </nav>
      )}
    </header>
  )
}
