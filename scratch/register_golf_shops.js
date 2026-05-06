
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const newShops = [
  {
    name: "Global Golf（グローバルゴルフ）",
    slug: "global-golf",
    url: "https://www.globalgolf.com/",
    description: "中古クラブから最新ギアまで幅広く扱う全米最大級のゴルフ通販サイト。下取りプログラムが充実しており、掘り出し物が見つかりやすいのが特徴です。",
    category: "スポーツ・アウトドア",
    country: "USA",
    ships_to_japan: true,
    is_affiliate: false,
    popularity_score: 85,
    image_url: "https://ggmcgokdtmflioqezrqk.supabase.co/storage/v1/object/public/shop-thumbnails/global-golf.webp"
  },
  {
    name: "Rock Bottom Golf（ロックボトムゴルフ）",
    slug: "rock-bottom-golf",
    url: "https://www.rockbottomgolf.com/",
    description: "アウトレット価格のゴルフ用品に特化した人気ショップ。セールが頻繁に行われており、型落ちモデルやウェアを格安で手に入れたいゴルファーに最適です。",
    category: "スポーツ・アウトドア",
    country: "USA",
    ships_to_japan: true,
    is_affiliate: false,
    popularity_score: 82,
    image_url: "https://ggmcgokdtmflioqezrqk.supabase.co/storage/v1/object/public/shop-thumbnails/rock-bottom-golf.webp"
  }
];

async function registerShops() {
  for (const shop of newShops) {
    const { error } = await supabase.from('shops').upsert(shop, { onConflict: 'slug' });
    if (error) console.error(`Error registering ${shop.name}:`, error);
    else console.log(`Registered ${shop.name}`);
  }
}

registerShops();
