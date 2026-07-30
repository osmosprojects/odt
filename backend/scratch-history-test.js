const mysql = require('mysql2/promise');

async function testOfferHistory() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: 'V!n@y7997',
    database: 'cilcc_odt_fresh_test'
  });

  console.log('=== Testing findOfferHistory query across top customers ===');

  const [sampleCustomers] = await conn.query(`
    SELECT DISTINCT cm.cust_id, cm.customer_code, cm.customer_name, cm.executive_code
    FROM odt_customer_master cm
    LIMIT 10
  `);

  for (const c of sampleCustomers) {
    const name = c.customer_name || '';
    const code = c.customer_code || String(c.cust_id || '');
    const custIdStr = c.cust_id ? String(c.cust_id) : '';

    const [rows] = await conn.query(`
      SELECT 
        o.id,
        o.offer_id,
        o.offer_code,
        o.offer_status,
        o.start_date,
        o.end_date,
        o.contract_tenure,
        o.tot_volume_commitment,
        o.total_gross_margin,
        o.gmpl_dofa,
        o.total_cust_lvl_input,
        o.total_net_price,
        o.remark,
        o.executive_code,
        o.stream,
        o.current_proposed_text,
        cd.customer_name_text,
        cd.customer_distributor_jde_ab_no_text,
        cd.customer_turfview_no_text
      FROM odt_offer_details o
      JOIN wow_odt_cust_details cd ON o.offer_id = cd.offer_id
      WHERE (
        cd.customer_name_text LIKE ?
        OR cd.customer_distributor_jde_ab_no_text = ?
        OR cd.customer_distributor_jde_ab_no_text = ?
        OR cd.customer_turfview_no_text = ?
        OR cd.customer_turfview_no_text = ?
      )
      AND o.offer_status NOT IN ('DEL')
      ORDER BY o.start_date DESC, o.id DESC
    `, [`%${name.split(' ')[0]}%`, code, custIdStr, code, custIdStr]);

    console.log(`\nCustomer: [${name}] (Code: ${code}) -> Found ${rows.length} historical offers`);
    if (rows.length > 0) {
      console.table(rows.map(r => ({
        offer_id: r.offer_id,
        offer_code: r.offer_code,
        start_date: r.start_date ? new Date(r.start_date).toISOString().split('T')[0] : null,
        end_date: r.end_date ? new Date(r.end_date).toISOString().split('T')[0] : null,
        contract_tenure: r.contract_tenure,
        tot_volume_commitment: r.tot_volume_commitment,
        gmpl_dofa: r.gmpl_dofa,
        offer_status: r.offer_status
      })));
    }
  }

  await conn.end();
}

testOfferHistory().catch(console.error);
