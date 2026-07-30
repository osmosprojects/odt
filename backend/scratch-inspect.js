const mysql = require('mysql2/promise');

function parsePhpValue(text, key) {
  if (!text) return null;
  const regex = new RegExp(`"${key}";(?:s:\\d+:"([^"]*)"|i:(\\d+)|d:([\\d.]+))`, 'i');
  const match = text.match(regex);
  if (match) {
    return match[1] ?? match[2] ?? match[3] ?? null;
  }
  return null;
}

async function testParsing() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: 'V!n@y7997',
    database: 'cilcc_odt_fresh_test'
  });

  const [rows] = await conn.query(`
    SELECT 
      od.id, od.offer_id, od.offer_code, od.offer_status, od.start_date, od.end_date, od.contract_tenure,
      od.tot_volume_commitment, od.total_cust_lvl_input, od.total_gross_margin, od.gmpl_dofa,
      od.current_proposed_text, od.customer_level_input_text, od.sku_text, od.previous_sku_details,
      cd.customer_name_text, cd.customer_distributor_jde_ab_no_text
    FROM odt_offer_details od
    LEFT JOIN wow_wo_cust_details cd ON od.offer_id = cd.offer_id
    ORDER BY od.offer_id ASC
  `);

  console.log(`TOTAL OFFERS IN DATABASE: ${rows.length}\n`);

  for (const r of rows) {
    console.log(`==================================================`);
    console.log(`Offer ID: ${r.offer_id} | Code: ${r.offer_code} | Customer: ${r.customer_name_text}`);
    console.log(`Columns -> vol_commit: ${r.tot_volume_commitment}, total_cust_input: ${r.total_cust_lvl_input}, total_gross_margin: ${r.total_gross_margin}, gmpl_dofa: ${r.gmpl_dofa}, tenure: ${r.contract_tenure}`);
    
    console.log(`--- current_proposed_text ---`);
    if (r.current_proposed_text) {
      console.log('RAW current_proposed_text:', r.current_proposed_text);
      console.log('volume_kl_current:', parsePhpValue(r.current_proposed_text, 'volume_kl_current'));
      console.log('volume_kl_proposed:', parsePhpValue(r.current_proposed_text, 'volume_kl_proposed'));
      console.log('total_investment_current:', parsePhpValue(r.current_proposed_text, 'total_investment_current'));
      console.log('total_investment_proposed:', parsePhpValue(r.current_proposed_text, 'total_investment_proposed'));
      console.log('AR_SEOL_current:', parsePhpValue(r.current_proposed_text, 'AR_SEOL_current'));
      console.log('AR_SEOL_proposed:', parsePhpValue(r.current_proposed_text, 'AR_SEOL_proposed'));
      console.log('rs_l_investment_current:', parsePhpValue(r.current_proposed_text, 'rs_l_investment_current'));
      console.log('rs_l_investment_proposed:', parsePhpValue(r.current_proposed_text, 'rs_l_investment_proposed'));
      console.log('gmpl_current:', parsePhpValue(r.current_proposed_text, 'gmpl_current'));
      console.log('gmpl_proposed:', parsePhpValue(r.current_proposed_text, 'gmpl_proposed'));
      console.log('kl_pm_current:', parsePhpValue(r.current_proposed_text, 'kl_pm_current'));
      console.log('kl_pm_propsed:', parsePhpValue(r.current_proposed_text, 'kl_pm_propsed'));
      console.log('target_incentive_current:', parsePhpValue(r.current_proposed_text, 'target_incentive_current'));
      console.log('marketing_current:', parsePhpValue(r.current_proposed_text, 'marketing_current'));
      console.log('sign_on_bonus_current:', parsePhpValue(r.current_proposed_text, 'sign_on_bonus_current'));
      console.log('others_current:', parsePhpValue(r.current_proposed_text, 'others_current'));
    } else {
      console.log('(NULL or EMPTY)');
    }

    console.log(`--- customer_level_input_text ---`);
    if (r.customer_level_input_text) {
      console.log('RAW customer_level_input_text:', r.customer_level_input_text);
      console.log('target_incentive:', parsePhpValue(r.customer_level_input_text, 'target_incentive'));
      console.log('additional_input:', parsePhpValue(r.customer_level_input_text, 'additional_input'));
      console.log('sign_on_bonus:', parsePhpValue(r.customer_level_input_text, 'sign_on_bonus'));
      console.log('others:', parsePhpValue(r.customer_level_input_text, 'others'));
      console.log('total_investment:', parsePhpValue(r.customer_level_input_text, 'total_investment'));
      console.log('rs_ltr_investment:', parsePhpValue(r.customer_level_input_text, 'rs_ltr_investment'));
      console.log('prev_gmpl:', parsePhpValue(r.customer_level_input_text, 'prev_gmpl'));
      console.log('ar_seol:', parsePhpValue(r.customer_level_input_text, 'ar_seol'));
    } else {
      console.log('(NULL or EMPTY)');
    }
  }

  await conn.end();
}

testParsing().catch(console.error);
