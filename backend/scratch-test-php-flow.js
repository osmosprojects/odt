const mysql = require('mysql2/promise');
const fs = require('fs');

function parsePhpValue(text, key) {
  if (!text) return null;
  const regex = new RegExp(`"${key}";(?:s:\\d+:"([^"]*)"|i:(\\d+)|d:([\\d.]+))`, 'i');
  const match = text.match(regex);
  if (match) {
    return match[1] ?? match[2] ?? match[3] ?? null;
  }
  return null;
}

async function dumpAllOffers() {
  const conn = await mysql.createConnection({
    host: '127.0.0.1',
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

  let out = `TOTAL OFFERS IN DATABASE: ${rows.length}\n\n`;

  for (const r of rows) {
    out += `==================================================\n`;
    out += `Offer ID: ${r.offer_id} | Code: ${r.offer_code} | Customer: ${r.customer_name_text}\n`;
    out += `Columns -> vol_commit: ${r.tot_volume_commitment}, total_cust_input: ${r.total_cust_lvl_input}, total_gross_margin: ${r.total_gross_margin}, gmpl_dofa: ${r.gmpl_dofa}, tenure: ${r.contract_tenure}\n`;
    
    out += `--- current_proposed_text ---\n`;
    if (r.current_proposed_text) {
      out += `RAW current_proposed_text: ${r.current_proposed_text}\n`;
      out += `volume_kl_current: ${parsePhpValue(r.current_proposed_text, 'volume_kl_current')}\n`;
      out += `volume_kl_proposed: ${parsePhpValue(r.current_proposed_text, 'volume_kl_proposed')}\n`;
      out += `total_investment_current: ${parsePhpValue(r.current_proposed_text, 'total_investment_current')}\n`;
      out += `total_investment_proposed: ${parsePhpValue(r.current_proposed_text, 'total_investment_proposed')}\n`;
      out += `AR_SEOL_current: ${parsePhpValue(r.current_proposed_text, 'AR_SEOL_current')}\n`;
      out += `AR_SEOL_proposed: ${parsePhpValue(r.current_proposed_text, 'AR_SEOL_proposed')}\n`;
      out += `rs_l_investment_current: ${parsePhpValue(r.current_proposed_text, 'rs_l_investment_current')}\n`;
      out += `rs_l_investment_proposed: ${parsePhpValue(r.current_proposed_text, 'rs_l_investment_proposed')}\n`;
      out += `gmpl_current: ${parsePhpValue(r.current_proposed_text, 'gmpl_current')}\n`;
      out += `gmpl_proposed: ${parsePhpValue(r.current_proposed_text, 'gmpl_proposed')}\n`;
      out += `kl_pm_current: ${parsePhpValue(r.current_proposed_text, 'kl_pm_current')}\n`;
      out += `kl_pm_propsed: ${parsePhpValue(r.current_proposed_text, 'kl_pm_propsed')}\n`;
      out += `target_incentive_current: ${parsePhpValue(r.current_proposed_text, 'target_incentive_current')}\n`;
      out += `marketing_current: ${parsePhpValue(r.current_proposed_text, 'marketing_current')}\n`;
      out += `sign_on_bonus_current: ${parsePhpValue(r.current_proposed_text, 'sign_on_bonus_current')}\n`;
      out += `others_current: ${parsePhpValue(r.current_proposed_text, 'others_current')}\n`;
    } else {
      out += `(NULL or EMPTY)\n`;
    }

    out += `--- customer_level_input_text ---\n`;
    if (r.customer_level_input_text) {
      out += `RAW customer_level_input_text: ${r.customer_level_input_text}\n`;
      out += `target_incentive: ${parsePhpValue(r.customer_level_input_text, 'target_incentive')}\n`;
      out += `additional_input: ${parsePhpValue(r.customer_level_input_text, 'additional_input')}\n`;
      out += `sign_on_bonus: ${parsePhpValue(r.customer_level_input_text, 'sign_on_bonus')}\n`;
      out += `others: ${parsePhpValue(r.customer_level_input_text, 'others')}\n`;
      out += `total_investment: ${parsePhpValue(r.customer_level_input_text, 'total_investment')}\n`;
      out += `rs_ltr_investment: ${parsePhpValue(r.customer_level_input_text, 'rs_ltr_investment')}\n`;
      out += `prev_gmpl: ${parsePhpValue(r.customer_level_input_text, 'prev_gmpl')}\n`;
      out += `ar_seol: ${parsePhpValue(r.customer_level_input_text, 'ar_seol')}\n`;
    } else {
      out += `(NULL or EMPTY)\n`;
    }
  }

  fs.writeFileSync('c:\\ODT_tool\\backend\\scratch-report.txt', out);
  console.log('Report written to c:\\ODT_tool\\backend\\scratch-report.txt');
  await conn.end();
}

dumpAllOffers().catch(console.error);
