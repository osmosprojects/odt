const mysql = require('mysql2/promise');

async function run() {
  const conn = await mysql.createConnection({host:'127.0.0.1', port:3307, user:'root', password:'V!n@y7997', database:'cilcc_odt_fresh_test'});
  
  const [cols1] = await conn.query('DESCRIBE wow_wo_cust_details');
  console.log('--- wow_wo_cust_details columns ---');
  for (const c of cols1) {
    if (['offer_id', 'customer_distributor_jde_ab_no_text', 'customer_turfview_no_text', 'customer_name_text'].includes(c.Field)) {
      console.log(c.Field, ':', c.Type, 'Key:', c.Key);
    }
  }

  const [cols2] = await conn.query('DESCRIBE odt_offer_details');
  console.log('\n--- odt_offer_details key columns ---');
  for (const c of cols2) {
    if (['offer_id', 'executive_code', 'offer_status', 'start_date', 'previous_sku_details', 'customer_level_input_text', 'sku_text', 'current_proposed_text'].includes(c.Field)) {
      console.log(c.Field, ':', c.Type, 'Key:', c.Key);
    }
  }
  await conn.end();
}

run().catch(console.error);
