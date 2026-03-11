'use client'

import Link from 'next/link'

export default function Footer() {
    return (
        <footer style={{
            borderTop: '1px solid #e5e5e3',
            background: '#fafaf9',
            padding: 'clamp(2rem, 4vw, 3rem) clamp(1.25rem, 5vw, 3rem)',
        }}>
            <div style={{
                maxWidth: '1160px', margin: '0 auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1.25rem',
            }}>
                {/* Logo */}
                <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: '24px', height: '24px', borderRadius: '5px',
                        background: '#111110', color: '#fafaf9',
                        fontSize: '0.65rem', fontWeight: 800, letterSpacing: '-0.02em',
                    }}>DF</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111110', letterSpacing: '-0.02em' }}>
                        Direct Found
                    </span>
                </Link>

                {/* Links */}
                <nav style={{ display: 'flex', gap: '1.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    {[
                        { label: 'ショップ', href: '/shops' },
                        { label: 'ブランド', href: '/brands' },
                        { label: '記事', href: '/articles' },
                        { label: '運営者情報', href: '/about' },
                        { label: 'プライバシーポリシー', href: '/privacy' },
                    ].map(link => (
                        <Link key={link.href} href={link.href} style={{
                            fontSize: '0.8rem', color: '#a1a19f',
                            textDecoration: 'none', fontWeight: 500,
                            transition: 'color 0.15s',
                        }}>{link.label}</Link>
                    ))}
                </nav>

                {/* Copyright */}
                <p style={{ fontSize: '0.75rem', color: '#c8c8c6' }}>
                    © {new Date().getFullYear()} Direct Found
                </p>
            </div>
        </footer>
    )
}
