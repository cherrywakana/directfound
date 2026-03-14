const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const slug = process.argv[2];
const canShip = process.argv[3] === 'true';

if (!slug) {
    console.log('Usage: node scripts/update_shipping_status.js <slug> <true|false>');
    process.exit(1);
}

async function updateStatus() {
    console.log(`Updating shipping status for ${slug} to ${canShip}...`);
    const { error } = await supabase
        .from('shops')
        .update({ ships_to_japan: canShip })
        .eq('slug', slug);

    if (error) {
        console.error('Error updating shipping status:', error.message);
    } else {
        console.log(`Successfully updated ${slug}`);
    }
}

updateStatus();
