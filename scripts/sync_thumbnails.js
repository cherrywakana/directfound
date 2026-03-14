const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
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

async function uploadFile(slug, filePath) {
    const fileContent = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = ext === '.png' ? 'image/png' : 'image/webp';
    const fileName = `${slug}${ext}`;

    console.log(`\n🚀 Uploading ${fileName} to storage...`);
    const { data, error } = await supabase.storage
        .from('shop-thumbnails')
        .upload(fileName, fileContent, {
            contentType: contentType,
            upsert: true
        });

    if (error) {
        console.error(`  ❌ Error uploading ${fileName}:`, error.message);
        return;
    }

    // キャッシュバスターとしてタイムスタンプを付与
    const timestamp = Date.now();
    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/shop-thumbnails/${fileName}?t=${timestamp}`;

    console.log(`  🔗 Updating database for ${slug}...`);
    const { error: dbError } = await supabase
        .from('shops')
        .update({ image_url: imageUrl })
        .eq('slug', slug);

    if (dbError) {
        console.error(`  ❌ Error updating DB for ${slug}:`, dbError.message);
    } else {
        console.log(`  ✨ Successfully updated ${slug} with ${imageUrl}`);
    }
}

async function start() {
    const assetsDir = path.join(__dirname, 'assets', 'shops');

    if (!fs.existsSync(assetsDir)) {
        console.log(`Directory not found: ${assetsDir}`);
        return;
    }

    console.log('\n--- Scanning scripts/assets/shops/ for images ---');
    const files = fs.readdirSync(assetsDir).filter(f => f.endsWith('.webp') || f.endsWith('.png'));

    if (files.length === 0) {
        console.log('No images found to sync.');
        return;
    }

    for (const file of files) {
        const slug = path.basename(file, path.extname(file));
        const filePath = path.join(assetsDir, file);
        await uploadFile(slug, filePath);
    }
}

start().catch(console.error);
