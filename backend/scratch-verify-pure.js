const mysql = require('mysql2/promise');
const { safePhpUnserialize } = require('./dist/common/utils/legacy-serialization.utils');

async function testPureMapping() {
  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3307,
    user: 'root',
    password: 'V!n@y7997',
    database: 'cilcc_odt_fresh_test'
  });

  console.log('=== TESTING PREVIOUS CONTRACT HISTORICAL SECTIONS ===');

  const [rows] = await conn.query(`
    SELECT offer_id, offer_code, stream, start_date, end_date, contract_tenure, tot_volume_commitment, total_gross_margin, gmpl_dofa, remark, customer_level_input_text, current_proposed_text, sku_text, previous_sku_details
    FROM odt_offer_details
    WHERE sku_text IS NOT NULL AND sku_text != '' AND sku_text != 'N;'
    ORDER BY id DESC
    LIMIT 1
  `);

  if (rows.length === 0) {
    console.log('No offer row found');
    await conn.end();
    return;
  }

  const offer = rows[0];
  console.log(`\n[Debug - Customer Selected]: Searching for Previous Offer for Offer ID ${offer.offer_id}`);
  console.log(`[Debug - Previous Offer Found]: Offer ID ${offer.offer_id} (${offer.offer_code})`);

  const rawSkuText = safePhpUnserialize(offer.sku_text);
  console.log(`[Debug - sku_text Loaded]: Length = ${offer.sku_text ? offer.sku_text.length : 0}`);
  console.log(`[Debug - sku_text Deserialized]: Success = ${!!rawSkuText}`);

  const parseSkuArray = (raw) => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    const list = [];
    let counter = parseInt(raw.sku_counter || '0', 10);
    if (counter > 0) {
      for (let i = 0; i < counter; i++) {
        if (raw[`sku_code${i}`] || raw[`sku_name${i}`]) {
          const reb = parseFloat(raw[`sku_reb_per_ltr${i}`] || raw[`sku_rebate${i}`] || '0');
          const vol = parseFloat(raw[`sku_volume${i}`] || '0');
          const focVol = parseFloat(raw[`foc_volume${i}`] || '0');
          const gross = parseFloat(raw[`sku_base_gross${i}`] || '0');
          const inc = parseFloat(raw[`sku_incentive${i}`] || raw[`incentive${i}`] || '0');
          list.push({
            skuName: raw[`sku_name${i}`] || '',
            skuCode: raw[`sku_code${i}`] || '',
            contractVolume: vol,
            focVolume: focVol,
            rebate: reb,
            grossMargin: gross,
            incentive: inc,
            baseCogs: parseFloat(raw[`sku_base_cogs${i}`] || '0'),
            gmLevel: raw[`sku_gm_level${i}`] || 'N',
          });
        }
      }
    }
    return list;
  };

  const previousSkuDetails = parseSkuArray(rawSkuText);
  console.log(`[Debug - Previous SKU Count]: ${previousSkuDetails.length}`);

  const customerLevelInputs = safePhpUnserialize(offer.customer_level_input_text) || {};
  const historicalPackage = {
    targetIncentive: parseFloat(customerLevelInputs.target_incentive || customerLevelInputs.targetIncentive || offer.total_cust_lvl_input || '0'),
    additionalInput: parseFloat(customerLevelInputs.additional_input || customerLevelInputs.additionalInput || '0'),
    signOnBonus: parseFloat(customerLevelInputs.sign_on_bonus || customerLevelInputs.signOnBonus || '0'),
    others: parseFloat(customerLevelInputs.others || '0'),
    arSeol: customerLevelInputs.ar_seol || customerLevelInputs.arSeol || 'Not Applicable',
    skuLevelRebate: parseFloat(customerLevelInputs.sku_level_rebate || customerLevelInputs.skuLevelRebate || '0'),
    totalFocValue: parseFloat(customerLevelInputs.total_foc_value || customerLevelInputs.totalFocValue || '0'),
    totalInvestment: parseFloat(offer.total_cust_lvl_input || '0'),
    rsLtrInvestment: parseFloat(offer.tot_volume_commitment || '0') > 0 ? Number((parseFloat(offer.total_cust_lvl_input || '0') / parseFloat(offer.tot_volume_commitment)).toFixed(2)) : 0,
    prevGmpl: parseFloat(offer.gmpl_dofa || '0'),
    remark: offer.remark || '',
  };
  console.log(`[Debug - Historical Package Loaded]:`, JSON.stringify(historicalPackage, null, 2));

  const currentProposed = safePhpUnserialize(offer.current_proposed_text) || {};
  const tenureMonths = parseInt(offer.contract_tenure || '12', 10) || 12;
  const commitment = parseFloat(offer.tot_volume_commitment || '0');
  const actual = parseFloat(currentProposed.volume_kl_current || offer.tot_volume_commitment || '0');

  const customerPerformance = {
    prevOfferCommitment: commitment,
    prevOfferActual: actual,
    months: tenureMonths,
    periodFrom: offer.start_date ? new Date(offer.start_date).toISOString().split('T')[0] : null,
    periodTo: offer.end_date ? new Date(offer.end_date).toISOString().split('T')[0] : null,
    volumePM: commitment > 0 ? Math.round(commitment / tenureMonths) : 0,
    actualPM: actual > 0 ? Math.round(actual / tenureMonths) : 0,
    synthShare: parseFloat(currentProposed.synth_share || '0'),
    synthShareActual: parseFloat(currentProposed.synth_share_actual || '0'),
    commitment,
    actual,
  };
  console.log(`[Debug - Customer Performance Loaded]:`, JSON.stringify(customerPerformance, null, 2));

  const response = {
    success: true,
    hasPreviousOffer: true,
    previousContract: {
      offerId: offer.offer_id,
      offerCode: offer.offer_code,
      offerType: offer.stream,
      totVolumeCommitment: offer.tot_volume_commitment,
    },
    previousSkuDetails,
    historicalPackage,
    customerPerformance,
    previousOfferSummary: {
      offerId: offer.offer_id,
      offerCode: offer.offer_code,
    }
  };

  console.log(`[Debug - API Response Created]: Response includes all historical sections.`);
  console.log(`\n=== API RESPONSE STRUCTURE ===`);
  console.log(JSON.stringify(response, null, 2));

  await conn.end();
}

testPureMapping().catch(console.error);
