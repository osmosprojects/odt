const mysql = require('mysql2/promise');
const { safePhpUnserialize } = require('./dist/common/utils/legacy-serialization.utils');

async function inspectSkus() {
  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3307,
    user: 'root',
    password: 'V!n@y7997',
    database: 'cilcc_odt_fresh_test'
  });

  const [rows] = await conn.query(`
    SELECT offer_id, offer_code, sku_text, previous_sku_details
    FROM odt_offer_details
    WHERE (sku_text IS NOT NULL AND sku_text != '' AND sku_text != 'N;')
       OR (previous_sku_details IS NOT NULL AND previous_sku_details != '' AND previous_sku_details != 'N;')
    LIMIT 5
  `);

  console.log('Found rows:', rows.length);

  for (const r of rows) {
    console.log(`\n--- Offer ID ${r.offer_id} (${r.offer_code}) ---`);
    console.log('Raw sku_text sample:', r.sku_text ? r.sku_text.slice(0, 400) : 'null');
    
    const parsedSkuText = safePhpUnserialize(r.sku_text);
    console.log('Parsed sku_text type:', typeof parsedSkuText, 'IsArray:', Array.isArray(parsedSkuText));
    console.log('Parsed sku_text content:', JSON.stringify(parsedSkuText, null, 2).slice(0, 500));

    const parsedPrevSku = safePhpUnserialize(r.previous_sku_details);
    console.log('Parsed previous_sku_details:', JSON.stringify(parsedPrevSku, null, 2).slice(0, 500));
  }

  await conn.end();
}

inspectSkus().catch(console.error);
