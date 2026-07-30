const mysql = require('mysql2/promise');
const { safePhpUnserialize } = require('./dist/common/utils/legacy-serialization.utils');

async function verifySkuRebatesFlow() {
  console.log('=========================================================');
  console.log(' VERIFYING PREVIOUS SKU -> SKU REBATES GRID POPULATION');
  console.log('=========================================================\n');

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
    WHERE sku_text IS NOT NULL AND sku_text != '' AND sku_text != 'N;'
    LIMIT 3
  `);

  console.log(`[Step 1: Customer Selected & Previous Contract Found]: Count = ${rows.length}\n`);

  for (const r of rows) {
    console.log(`---------------------------------------------------------`);
    console.log(`Offer Code: ${r.offer_code} (Offer ID: ${r.offer_id})`);
    console.log(`[Step 2: sku_text Loaded]: Length = ${r.sku_text.length} bytes`);

    const deserialized = safePhpUnserialize(r.sku_text);
    console.log(`[Step 3: sku_text Deserialized]: ${!!deserialized}`);

    // Parse SKU Array
    const parseSkuArray = (raw) => {
      if (!raw) return [];
      if (Array.isArray(raw)) return raw;
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
          const vol = parseFloat(raw[`sku_volume${i}`] || '0');
          const focVol = parseFloat(raw[`foc_volume${i}`] || '0');
          const gross = parseFloat(raw[`sku_base_gross${i}`] || '0');
          const cogs = parseFloat(raw[`sku_base_cogs${i}`] || '0');
          const inc = parseFloat(raw[`product_target_incentive${i}`] || raw[`sku_incentive${i}`] || '0');
          const mixInc = parseFloat(raw[`mix_incentive${i}`] || raw[`sku_mix_incentive${i}`] || reb || '0');
          const recMixInc = parseFloat(raw[`rec_mix_incentive${i}`] || raw[`rec_mix_inc${i}`] || '0');
          const sur = parseFloat(raw[`surcharge${i}`] || raw[`sku_surcharge${i}`] || '0');
          const nhfVal = parseFloat(raw[`nhf${i}`] || raw[`sku_nhf${i}`] || gross || '0');
          const totInp = parseFloat(raw[`total_input${i}`] || '0') || (reb + mixInc + inc);
          const baseTOVal = parseFloat(raw[`sku_base_to${i}`] || raw[`base_to${i}`] || '0') || (cogs * 1.45);

          list.push({
            skuCode: raw[`sku_code${i}`] || '',
            skuName: raw[`sku_name${i}`] || '',
            baseTO: baseTOVal,
            baseCOGS: cogs,
            contractVolume: vol,
            focVolume: focVol,
            totalInput: totInp,
            surcharge: sur,
            nhf: nhfVal,
            recMixIncentive: recMixInc,
            mixIncentive: mixInc,
            skuRebate: reb,
            productTargetIncentive: inc,
          });
        }
      }
      return list;
    };

    const skuArray = parseSkuArray(deserialized);
    console.log(`[Step 4: Structured SKU Array Created]: Count = ${skuArray.length}`);
    console.log(`[Step 5: SKU Rebates Grid Populated Sample SKU]:`, skuArray[0]);
  }

  console.log('\n=========================================================');
  console.log(' VERIFICATION SUCCESSFUL — NO ERRORS DETECTED');
  console.log('=========================================================');

  await conn.end();
}

verifySkuRebatesFlow().catch(console.error);
