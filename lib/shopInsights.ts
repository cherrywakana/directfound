import { getArticleExcerpt, getLastVerifiedAt } from '@/lib/utils'

export type ShopInsight = {
    name?: string | null
    slug?: string | null
    url?: string | null
    category?: string | null
    country?: string | null
    description?: string | null
    image_url?: string | null
    is_affiliate?: boolean | null
    ships_to_japan?: boolean | null
    popularity_score?: number | null
    shipping_guide?: string | null
    tax_guide?: string | null
    fee_guide?: string | null
    updated_at?: string | null
    created_at?: string | null
}

type ComparisonItem = {
    label: string
    value: string
    tone?: 'positive' | 'neutral' | 'warning'
}

function cleanText(text: string | null | undefined): string | undefined {
    return text?.replace(/\s+/g, ' ').trim() || undefined
}

function detectTaxMode(text: string | null | undefined): string {
    const normalized = cleanText(text)?.toLowerCase()
    if (!normalized) return '未確認'
    if (normalized.includes('ddp') || normalized.includes('関税込') || normalized.includes('追加費用は一切発生しません')) return '関税込みの可能性'
    if (normalized.includes('ddu') || normalized.includes('受け取り時') || normalized.includes('別途')) return '受け取り時支払いの可能性'
    return '要確認'
}

function detectDeliveryWindow(text: string | null | undefined): string {
    const normalized = cleanText(text)
    if (!normalized) return '未確認'

    const match = normalized.match(/(\d+\s*(?:〜|~|-)\s*\d+\s*(?:営業日|日|週間)|数日\s*(?:〜|~|-)\s*\d+\s*(?:営業日|日|週間)|\d+\s*週間?前後|\d+\s*営業日程度)/)
    return match?.[0] || '公式サイトで要確認'
}

function detectJapaneseSupport(shop: ShopInsight): string {
    const url = shop.url?.toLowerCase() || ''
    if (url.includes('/jp') || url.includes('/ja') || url.includes('ja-jp') || url.includes('jp.')) {
        return '日本向け表示あり'
    }
    return '未確認'
}

function summarizeGuide(text: string | null | undefined, fallback: string): string {
    return getArticleExcerpt(text, 52) || fallback
}

export function getShopComparisonItems(shop: ShopInsight): ComparisonItem[] {
    const taxMode = detectTaxMode(shop.tax_guide)

    return [
        {
            label: '日本発送',
            value: shop.ships_to_japan === false ? '直送不可または制限あり' : '要確認または対応中',
            tone: shop.ships_to_japan === false ? 'warning' : 'positive',
        },
        {
            label: '関税',
            value: taxMode,
            tone: taxMode.includes('受け取り時') ? 'warning' : 'neutral',
        },
        {
            label: '送料',
            value: summarizeGuide(shop.fee_guide, '送料の詳細は公式サイトで要確認'),
            tone: shop.fee_guide ? 'neutral' : 'warning',
        },
        {
            label: '配送目安',
            value: detectDeliveryWindow(shop.shipping_guide || shop.fee_guide),
        },
        {
            label: '返品',
            value: '返品条件は購入前に公式ポリシー確認がおすすめ',
        },
        {
            label: '支払い方法',
            value: '主要決済手段はチェックアウト画面で要確認',
        },
        {
            label: '日本語対応',
            value: detectJapaneseSupport(shop),
        },
    ]
}

export function getShopFitBullets(shop: ShopInsight): string[] {
    const bullets: string[] = []

    if (shop.ships_to_japan !== false) bullets.push('日本発送に対応するショップ候補を比較したい人向け')
    if (detectTaxMode(shop.tax_guide).includes('関税込み')) bullets.push('受け取り時の追加費用をできるだけ避けたい人向け')
    if ((shop.popularity_score || 0) >= 70) bullets.push('定番ショップから比較したい人向け')
    if (shop.category) bullets.push(`${shop.category}系の買い回り先を探している人向け`)

    return bullets.slice(0, 3)
}

export function getShopWarningBullets(shop: ShopInsight): string[] {
    const bullets: string[] = []

    if (shop.ships_to_japan === false) bullets.push('日本直送の可否は変わることがあるため、購入前に配送ポリシーの再確認が必要です。')
    if (detectTaxMode(shop.tax_guide).includes('受け取り時')) bullets.push('受け取り時に関税・消費税の請求が発生する可能性があります。')
    if (!shop.fee_guide) bullets.push('送料の総額はカート投入後まで読みにくい場合があります。')
    if (detectJapaneseSupport(shop) === '未確認') bullets.push('日本語表示が見つからない場合は英語表記での確認が必要です。')

    if (bullets.length === 0) {
        bullets.push('キャンペーンや配送条件は時期によって変わるため、最終的な金額は公式サイトで確認してください。')
    }

    return bullets.slice(0, 3)
}

export function getBrandShopBadges(shop: ShopInsight): string[] {
    const badges: string[] = []

    if (shop.ships_to_japan !== false) badges.push('日本直送OK')
    if ((shop.popularity_score || 0) >= 70) badges.push('人気ショップ')
    if (shop.is_affiliate) badges.push('提携あり')

    return badges.slice(0, 3)
}

export function getBrandShopReason(shop: ShopInsight): string {
    if (shop.ships_to_japan !== false && (shop.popularity_score || 0) >= 70) {
        return '日本から注文しやすく、比較候補の中心になりやすいショップです。'
    }
    if (shop.ships_to_japan !== false) {
        return '日本から購入導線を作りやすいショップとして優先表示しています。'
    }
    if ((shop.popularity_score || 0) >= 70) {
        return '取扱実績と人気を踏まえて比較候補として上位にしています。'
    }
    return '取扱確認済みのショップとして掲載しています。'
}

export function getLastVerifiedLabel(record: ShopInsight): string | undefined {
    return getLastVerifiedAt(record)
}

export const CORE_GUIDE_LINKS = [
    { title: '海外通販ガイド一覧', href: '/guide' },
    { title: 'ファッション通販の比較を見る', href: '/articles/overseas-fashion-shopping-ultimate-guide' },
    { title: 'アウトドア通販の比較を見る', href: '/articles/overseas-outdoor-shops-guide' },
] as const
