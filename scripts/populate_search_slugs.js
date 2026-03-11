const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// env 読み込み
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value && !process.env[key.trim()]) {
            process.env[key.trim()] = value.trim();
        }
    });
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

/**
 * ブランド名から一般的なスラッグ候補を生成する（AIアシスタント向けのロジック）
 * ※このスクリプトを実行する際、AIがブランドリストを見てこれらを埋める想定
 */
async function populateSearchSlugs() {
    console.log('--- 🤖 Generating Search Slugs for Brands ---');

    const { data: brands, error } = await supabase.from('brands').select('id, name, slug');
    if (error) {
        console.error('Failed to fetch brands:', error.message);
        return;
    }

    // AIによるスラッグマッピング（主要ブランドのパターン定義）
    const slugMap = {
        'Fear of God Essentials': ['essentials', 'fog-essentials', 'fear-of-god'],
        'The North Face': ['the-north-face-co', 'tnf'],
        'Rick Owens': ['drkshdw', 'rick-owens-lilly'], // 具体例
        'Adidas': ['adidas-originals', 'adidas-performance'],
        'Patagonia': ['patagonia-inc'],
        'Comme des Garcons': ['play-comme-des-garcons', 'cdg', 'comme-des-garcons-play'],
    };

    for (const brand of brands) {
        let candidates = [];
        
        // 1. AI定義のマッピングがあれば優先
        if (slugMap[brand.name]) {
            candidates = slugMap[brand.name];
        }

        // 2. 一般的なルールで生成
        // - "The " を抜いたもの
        if (brand.name.startsWith('The ')) {
            candidates.push(brand.name.replace('The ', '').toLowerCase().replace(/\s+/g, '-'));
        }
        // - ハイフンなし
        candidates.push(brand.slug.replace(/-/g, ''));
        // - 短縮（スペースで区切られた最初の単語）
        const firstWord = brand.name.split(' ')[0].toLowerCase();
        if (firstWord.length > 3 && firstWord !== brand.slug) {
            candidates.push(firstWord);
        }

        // 重複削除と基本スラッグの除外
        const uniqueCandidates = [...new Set(candidates)].filter(c => c !== brand.slug && c.length > 0);

        if (uniqueCandidates.length > 0) {
            console.log(`Updating [${brand.name}]: ${JSON.stringify(uniqueCandidates)}`);
            const { error: updateError } = await supabase
                .from('brands')
                .update({ search_slugs: uniqueCandidates })
                .eq('id', brand.id);
            
            if (updateError) {
                console.error(`  ❌ Failed to update ${brand.name}:`, updateError.message);
            }
        }
    }

    console.log('\n--- ✅ Done ---');
}

populateSearchSlugs();
