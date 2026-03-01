const { createClient } = require('@supabase/supabase-js');
const { chromium } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth')();

chromium.use(stealth);

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 各ショップのURL構造ルール（これを拡張すればどんどん収集対象を増やせます）
const SHOP_RULES = {
    'ssense': (slug) => `https://www.ssense.com/ja-jp/men/designers/${slug}`,
    'farfetch': (slug) => `https://www.farfetch.com/jp/shopping/men/${slug}/items.aspx`,
    'cettire': (slug) => `https://www.cettire.com/jp/collections/${slug}`,
    'luisaviaroma': (slug) => `https://www.luisaviaroma.com/ja-jp/shop/men/${slug}`,
    'mytheresa': (slug) => `https://www.mytheresa.com/jp/en/men/designers/${slug}`,
    'net-a-porter': (slug) => `https://www.net-a-porter.com/en-jp/shop/designer/${slug}`,
    'the-outnet': (slug) => `https://www.theoutnet.com/ja-jp/shop/designers/${slug}`,
    'shopbop': (slug) => `https://www.shopbop.com/${slug}/br/v=1/73023.htm`, // 実際は一部IDが必要だが、検索URLにフォールバック可能
    'hbx': (slug) => `https://hbx.com/jp/men/brands/${slug}`,
    'end': (slug) => `https://www.endclothing.com/jp/brands/${slug}`,
};

async function verifyBrandPage(page, url) {
    try {
        console.log(`📡 Accessing: ${url}`);
        const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

        // 404 エラー、またはリダイレクト（別のページに飛ばされた）をチェック
        if (!response || response.status() >= 400) {
            return false;
        }

        // ページ内に「見つかりません」系の文言がないかチェック
        const noResults = await page.evaluate(() => {
            const body = document.body.innerText;
            return body.includes('見つかりませんでした') || body.includes('No results found') || body.includes('お探しのページ');
        });

        return !noResults;
    } catch (e) {
        console.error(`  ⚠️ Verification failed for ${url}:`, e.message);
        return false;
    }
}

async function runAutonomousCollector() {
    console.log('--- 🤖 Autonomous Brand Collector Starting ---');

    // 1. 調査対象のブランドを取得（1件ずつ丁寧に回る）
    const { data: brands, error: brandError } = await supabase.from('brands').select('*');
    if (brandError) throw brandError;

    // 2. ブラウザを起動（Stealthモード）
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
    });
    const page = await context.newPage();

    for (const brand of brands) {
        console.log(`\n🔎 Investigating Brand: [${brand.name}]`);

        const { data: shops } = await supabase.from('shops').select('id, name, slug');

        for (const shop of shops) {
            const rule = SHOP_RULES[shop.slug];
            if (!rule) continue;

            const targetUrl = rule(brand.slug);
            const isFound = await verifyBrandPage(page, targetUrl);

            if (isFound) {
                console.log(`  ✅ FOUND on ${shop.name}`);
                await supabase.from('shop_brands').upsert({
                    shop_id: shop.id,
                    brand_id: brand.id,
                    brand_url: targetUrl,
                    status: 'found',
                    last_checked_at: new Date().toISOString()
                }, { onConflict: 'shop_id, brand_id' });
            } else {
                console.log(`  ❌ NOT FOUND on ${shop.name}`);
                await supabase.from('shop_brands').upsert({
                    shop_id: shop.id,
                    brand_id: brand.id,
                    status: 'not_found',
                    last_checked_at: new Date().toISOString()
                }, { onConflict: 'shop_id, brand_id' });
            }

            // 人間味のある待機時間（2〜5秒のランダム）
            await delay(Math.floor(Math.random() * 3000) + 2000);
        }
    }

    await browser.close();
    console.log('\n--- ✅ Collection Cycle Completed ---');
}

runAutonomousCollector().catch(console.error);
