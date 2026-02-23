const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Simplified CSV parser for this specific file format
function extractDomainsFromCSV(csvData) {
    const domains = new Set();
    const lines = csvData.split('\n');

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // The CSV uses quotes for fields with commas. 
        // Domains are usually at the 3rd column (index 2).
        // Example: 9,"Sephora","beauty.sephora.com, m.sephora.com, ..."

        let parts = [];
        let currentPart = '';
        let inQuotes = false;

        for (let char of line) {
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                parts.push(currentPart.trim());
                currentPart = '';
            } else {
                currentPart += char;
            }
        }
        parts.push(currentPart.trim());

        if (parts.length > 2) {
            const domainField = parts[2]; // Index 2 is "Domains"
            // Split by comma in case of multiple domains
            const domainList = domainField.split(',').map(d => d.trim().toLowerCase().replace(/^www\./, ''));
            domainList.forEach(d => {
                if (d) domains.add(d);
            });
        }
    }
    return domains;
}

async function syncAffiliates() {
    console.log('--- Starting Precise Affiliate Sync ---');

    const csvPath = 'docs/assets/skimlinks_merchants.csv';
    if (!fs.existsSync(csvPath)) {
        console.error('CSV not found at:', csvPath);
        return;
    }

    const csvData = fs.readFileSync(csvPath, 'utf8');
    console.log('Parsing CSV domains...');
    const affiliateDomains = extractDomainsFromCSV(csvData);
    console.log(`Extracted ${affiliateDomains.size} unique domains from CSV.`);

    const { data: shops, error: fetchError } = await supabase
        .from('shops')
        .select('id, url, name');

    if (fetchError) {
        console.error('Error fetching shops:', fetchError);
        return;
    }

    for (const shop of shops) {
        let isMatch = false;
        try {
            const urlObj = new URL(shop.url);
            const host = urlObj.hostname.toLowerCase().replace(/^www\./, '');

            if (affiliateDomains.has(host)) {
                isMatch = true;
            }
        } catch (e) {
            console.warn(`Could not parse URL for shop: ${shop.name} (${shop.url})`);
        }

        if (isMatch) {
            await supabase.from('shops').update({ is_affiliate: true }).eq('id', shop.id);
            console.log(`✅ Affiliate: ${shop.name}`);
        } else {
            await supabase.from('shops').update({ is_affiliate: false }).eq('id', shop.id);
            console.log(`⚪ Non-Affiliate: ${shop.name}`);
        }
    }

    console.log('--- Sync Completed ---');
}

syncAffiliates();
