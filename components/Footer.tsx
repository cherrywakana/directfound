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
                <div>
                    <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: '24px', height: '24px', borderRadius: '5px',
                            background: '#111110', color: '#fafaf9',
                            fontSize: '0.65rem', fontWeight: 800, letterSpacing: '-0.02em',
                        }}>OP</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111110', letterSpacing: '-0.02em' }}>
                            Original Price
                        </span>
                    </Link>
                    <p style={{ color: '#6b6b69', fontSize: '0.9rem', maxWidth: '300px', lineHeight: 1.6 }}>
                        日本に送れる海外通販ショップを探しやすくまとめたガイド。最新条件は各ショップの公式案内をご確認ください。
                    </p>
                </div>
                <div>
                    <p style={{ fontWeight: 600, marginBottom: '1.25rem', fontSize: '0.9rem' }}>サイト</p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        <li style={{ marginBottom: '0.75rem' }}><Link href="/brands" style={{ color: '#6b6b69', textDecoration: 'none', fontSize: '0.9rem' }}>ブランド一覧</Link></li>
                        <li style={{ marginBottom: '0.75rem' }}><Link href="/shops" style={{ color: '#6b6b69', textDecoration: 'none', fontSize: '0.9rem' }}>ショップ一覧</Link></li>
                        <li style={{ marginBottom: '0.75rem' }}><a href="https://note.com/world_shopping" target="_blank" rel="noopener noreferrer" style={{ color: '#6b6b69', textDecoration: 'none', fontSize: '0.9rem' }}>公式note</a></li>
                    </ul>
                </div>
                <div>
                    <p style={{ fontWeight: 600, marginBottom: '1.25rem', fontSize: '0.9rem' }}>サポート</p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        <li style={{ marginBottom: '0.75rem' }}><Link href="/about" style={{ color: '#6b6b69', textDecoration: 'none', fontSize: '0.9rem' }}>About</Link></li>
                        <li style={{ marginBottom: '0.75rem' }}><Link href="/privacy" style={{ color: '#6b6b69', textDecoration: 'none', fontSize: '0.9rem' }}>プライバシーポリシー</Link></li>
                    </ul>
                </div>
            </div>
            <div style={{ padding: '2rem 0', borderTop: '1px solid #e5e5e3', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ color: '#a1a19f', fontSize: '0.75rem' }}>
                    © {new Date().getFullYear()} Original Price
                </div>
            </div>
        </footer>
    )
}
