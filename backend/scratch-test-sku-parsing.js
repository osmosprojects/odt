const mysql = require('mysql2/promise');
const { safePhpUnserialize } = require('./dist/common/utils/legacy-serialization.utils');

function parseSkuArray(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw.skus)) return raw.skus;
  const list = [];
  let counter = parseInt(raw.sku_counter || '0', 10);
  if (counter === 0 && typeof raw === 'object') {
    const keys = Object.keys(raw);
    for (const k of keys) {
      const m = k.match(/^sku_code(\d+)$/);
      if (m) {
        const idx = parseInt(m[1], 10) + 1;
        if (idx > counter) counter = idx;
      }
    }
  }

  for (let i = 0; i < counter; i++) {
    if (raw[`sku_code${i}`] || raw[`sku_name${i}`]) {
      const reb = parseFloat(raw[`sku_reb_per_ltr${i}`] || raw[`sku_rebate${i}`] || '0');
      list.push({
        skuName: raw[`sku_name${i}`] || '',
        skuCode: raw[`sku_code${i}`] || '',
        volume: parseFloat(raw[`sku_volume${i}`] || '0'),
        rebate: reb,
        baseGross: parseFloat(raw[`sku_base_gross${i}`] || '0'),
        baseCogs: parseFloat(raw[`sku_base_cogs${i}`] || '0'),
        gmLevel: raw[`sku_gm_level${i}`] || 'N',
      });
    }
  }
  return list;
}

async function testSkuParsing() {
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
    WHERE offer_id IN (1, 2, 3, 4, 5)
  `);

  for (const r of rows) {
    console.log(`\n========================================`);
    console.log(`[Customer Found -> Offer Found]: Offer ID ${r.offer_id} (${r.offer_code})`);
    
    const skuTextRaw = r.sku_text;
    console.log(`[sku_text Loaded]: Length ${skuTextRaw ? skuTextRaw.length : 0}`);
    
    const deserialized = safePhpUnserialize(skuTextRaw);
    console.log(`[sku_text Deserialized Successfully]:`, !!deserialized);
    
    const mappedSkus = parseSkuArray(deserialized);
    console.log(`[SKU Count]: ${mappedSkus.length}`);
    console.log(`[Mapped SKU Array]:`, mappedSkus);
  }

  await conn.end();
}

testSkuParsing().catch(console.error);
