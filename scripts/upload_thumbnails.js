const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const shops = [
    { slug: 'stadium-goods', filePath: 'scripts/assets/stadium-goods.webp' },
    { slug: 'jd-sports', filePath: 'scripts/assets/jd-sports.webp' },
    { slug: 'beyond-retro', filePath: 'scripts/assets/beyond-retro.webp' },
    { slug: 'footasylum', filePath: 'scripts/assets/footasylum.webp' },
    { slug: 'triads', filePath: 'scripts/assets/triads.webp' },
    { slug: 'allike-store', filePath: 'scripts/assets/allike-store.webp' },
    { slug: 'bodega', filePath: 'scripts/assets/bodega.webp' },
    { slug: 'klekt', filePath: 'scripts/assets/klekt.webp' },
    { slug: 'flight-club', filePath: 'scripts/assets/flight-club.webp' },
    { slug: 'urban-industry', filePath: 'scripts/assets/urban-industry.webp' },
    // New Shops
    { slug: 'cult-beauty', filePath: 'scripts/assets/cult-beauty.webp' },
    { slug: 'antonioli', filePath: 'scripts/assets/antonioli.webp' },
    { slug: 'beauty-bay', filePath: 'scripts/assets/beauty-bay.webp' },
    { slug: 'tres-bien', filePath: 'scripts/assets/tres-bien.webp' },
    { slug: 'goodhood', filePath: 'scripts/assets/goodhood.webp' },
    { slug: 'foot-district', filePath: 'scripts/assets/foot-district.webp' },
    { slug: 'naked-cph', filePath: 'scripts/assets/naked-cph.webp' }
];

async function upload() {
    for (const shop of shops) {
        const fileContent = fs.readFileSync(shop.filePath);
        const fileName = `${shop.slug}.webp`;

        console.log(`Uploading ${fileName}...`);
        const { data, error } = await supabase.storage
            .from('shop-thumbnails')
            .upload(fileName, fileContent, {
                contentType: 'image/webp',
                upsert: true
            });

        if (error) {
            console.error(`Error uploading ${fileName}:`, error.message);
            continue;
        }

        const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/shop-thumbnails/${fileName}`;

        console.log(`Updating database for ${shop.slug}...`);
        const { error: dbError } = await supabase
            .from('shops')
            .update({ image_url: imageUrl })
            .eq('slug', shop.slug);

        if (dbError) {
            console.error(`Error updating DB for ${shop.slug}:`, dbError.message);
        } else {
            console.log(`Successfully updated ${shop.slug} with ${imageUrl}`);
        }
    }
}

upload();
