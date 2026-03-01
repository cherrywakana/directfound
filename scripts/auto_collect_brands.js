const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ショップごとのブランドページURLパターン定義
const SHOP_PATTERNS = {
    'ssense': (slug) => `https://www.ssense.com/ja-jp/men/designers/${slug}`,
    'farfetch': (slug) => `https://www.farfetch.com/jp/shopping/men/${slug}/items.aspx`,
    'cettire': (slug) => `https://www.cettire.com/jp/collections/${slug}`,
    'hbx': (slug) => `https://hbx.com/jp/men/brands/${slug}`,
    'end': (slug) => `https://www.endclothing.com/jp/brands/${slug}`,
    'mytheresa': (slug) => `https://www.mytheresa.com/jp/en/women/designers/${slug}`,
    'the-outnet': (slug) => `https://www.theoutnet.com/ja-jp/shop/designers/${slug}`,
    'luisaviaroma': (slug) => `https://www.luisaviaroma.com/ja-jp/shop/レディース/${slug}`,
    'net-a-porter': (slug) => `https://www.net-a-porter.com/en-jp/shop/designer/${slug}`,
};

async function checkUrl(url) {
    try {
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
            timeout: 10000,
            validateStatus: (status) => status < 400 // 404などはエラー扱い
        });
        return response.status === 200;
    } catch (e) {
        return false;
    }
}

async function runCollector(brandName) {
    console.log(`🔍 [${brandName}] の取り扱い状況を確認中...`);
    const brandSlug = brandName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');

    // 1. ブランドの作成/取得
    let { data: brand, error: brandError } = await supabase
        .from('brands')
        .select('id')
        .eq('slug', brandSlug)
        .single();

    if (brandError && brandError.code === 'PGRST116') {
        const { data: newBrand, error: insertError } = await supabase
            .from('brands')
            .insert({ name: brandName, slug: brandSlug })
            .select('id')
            .single();
        if (insertError) throw insertError;
        brand = newBrand;
        console.log(`✨ ブランド [${brandName}] を新規登録しました。`);
    }

    // 2. ショップ一覧の取得
    const { data: shops, error: shopError } = await supabase.from('shops').select('id, name, slug');
    if (shopError) throw shopError;

    // 3. 巡回調査
    for (const shop of shops) {
        const patternFn = SHOP_PATTERNS[shop.slug];
        let found = false;
        let brandUrl = null;

        if (patternFn) {
            brandUrl = patternFn(brandSlug);
            console.log(`Checking ${shop.name}...`);
            found = await checkUrl(brandUrl);
        } else {
            console.log(`Skipping ${shop.name} (No pattern defined).`);
            continue;
        }

        if (found) {
            console.log(`  ✅ 発見: ${brandUrl}`);
        } else {
            console.log(`  ❌ なし`);
            brandUrl = null;
        }

        // shop_brands への保存
        await supabase.from('shop_brands').upsert({
            shop_id: shop.id,
            brand_id: brand.id,
            brand_url: brandUrl,
            status: found ? 'found' : 'not_found',
            last_checked_at: new Date().toISOString()
        }, { onConflict: 'shop_id, brand_id' });

        await delay(1000); // サーバー負荷軽減
    }

    console.log('\n✅ 調査とDB保存が完了しました。');
}

const targetBrand = process.argv[2];
if (!targetBrand) {
    console.log('Usage: npm run auto-collect "Jil Sander"');
    process.exit(1);
}

runCollector(targetBrand).catch(console.error);
