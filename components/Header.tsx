'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const navLinks = [
  { label: 'ショップ', href: '/shops' },
  { label: 'ブランド', href: '/brands' },
  { label: '記事', href: '/articles' },
  { label: 'ガイド', href: '/guide' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 100,
      padding: '0 clamp(1.25rem, 5vw, 3rem)',
      height: '62px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: scrolled ? 'rgba(250,250,249,0.92)' : 'rgba(250,250,249,0)',
      backdropFilter: scrolled ? 'blur(16px) saturate(180%)' : 'none',
      borderBottom: scrolled ? '1px solid #e5e5e3' : '1px solid transparent',
      transition: 'background-color 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease',
    }}>
      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '28px', height: '28px', borderRadius: '7px',
          background: '#111110', color: '#fafaf9',
          fontSize: '0.75rem', fontWeight: 800, letterSpacing: '-0.03em',
          fontFamily: 'var(--font-sans)',
        }}>DF</span>
        <span style={{
          fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.03em',
          color: '#111110', fontFamily: 'var(--font-sans)',
        }}>Direct Found</span>
      </Link>

      {/* Desktop Nav */}
      <nav style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }} className="desktop-nav">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className="nav-link" style={{
            fontSize: '0.875rem', color: '#6b6b69', textDecoration: 'none',
            fontFamily: 'var(--font-sans)', fontWeight: 500,
            padding: '0.4rem 0.75rem', borderRadius: '6px',
            transition: 'color 0.15s, background 0.15s',
          }}>{link.label}</Link>
        ))}
        <Link href="/articles" className="header-cta" style={{
          marginLeft: '0.5rem',
          fontSize: '0.8rem', fontWeight: 600,
          color: '#fafaf9',
          background: '#111110',
          padding: '0.45rem 1.1rem',
          borderRadius: '6px',
          textDecoration: 'none',
          fontFamily: 'var(--font-sans)',
          letterSpacing: '-0.01em',
          transition: 'background 0.2s, transform 0.2s, box-shadow 0.2s',
        }}>記事を読む</Link>
      </nav>

      {/* Hamburger */}
      <button
        aria-label="メニュー"
        onClick={() => setMenuOpen(!menuOpen)}
        style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', flexDirection: 'column', gap: '5px' }}
        className="mobile-toggle"
      >
        {[0, 1, 2].map((i) => (
          <span key={i} style={{
            display: 'block', width: '20px', height: '1.5px', backgroundColor: '#111110',
            transition: 'transform 0.3s, opacity 0.3s',
            transform: menuOpen ? i === 0 ? 'translateY(6.5px) rotate(45deg)' : i === 1 ? 'scaleX(0)' : 'translateY(-6.5px) rotate(-45deg)' : 'none',
            opacity: menuOpen && i === 1 ? 0 : 1,
          }} />
        ))}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: '62px', left: 0, right: 0,
          backgroundColor: 'rgba(250,250,249,0.98)', backdropFilter: 'blur(16px)',
          borderBottom: '1px solid #e5e5e3',
          padding: '1.25rem clamp(1.25rem, 5vw, 3rem)',
          display: 'flex', flexDirection: 'column', gap: '0.25rem',
        }}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} style={{
              fontSize: '0.95rem', color: '#333332', textDecoration: 'none', fontWeight: 500,
              fontFamily: 'var(--font-sans)', padding: '0.6rem 0.5rem',
              borderBottom: '1px solid #f0f0ee',
            }}>{link.label}</Link>
          ))}
          <Link href="/articles" onClick={() => setMenuOpen(false)} style={{
            marginTop: '0.5rem',
            fontSize: '0.875rem', fontWeight: 600, color: '#fafaf9',
            background: '#111110',
            padding: '0.75rem 1.5rem', borderRadius: '6px', textAlign: 'center', textDecoration: 'none',
          }}>記事を読む</Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
        .nav-link:hover { color: #111110 !important; background: rgba(17,17,16,0.05) !important; }
        .header-cta:hover { background: #2a2a28 !important; transform: translateY(-1px) !important; box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important; }
      `}</style>
    </header>
  )
}
