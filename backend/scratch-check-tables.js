const mysql = require('mysql2/promise');

async function main() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: 'V!n@y7997',
    database: 'cilcc_odt_fresh_test'
  });

  const [c1] = await conn.query('SELECT COUNT(*) as cnt FROM wow_wo_cust_details');
  const [c2] = await conn.query('SELECT COUNT(*) as cnt FROM wow_odt_cust_details');
  const [c3] = await conn.query('SELECT COUNT(*) as cnt FROM odt_offer_details');

  console.log('Row counts:');
  console.log('wow_wo_cust_details:', c1[0].cnt);
  console.log('wow_odt_cust_details:', c2[0].cnt);
  console.log('odt_offer_details:', c3[0].cnt);

  // Check how many odt_offer_details join with wow_wo_cust_details vs wow_odt_cust_details
  const [j1] = await conn.query('SELECT COUNT(*) as cnt FROM odt_offer_details od JOIN wow_wo_cust_details cd ON od.offer_id = cd.offer_id');
  const [j2] = await conn.query('SELECT COUNT(*) as cnt FROM odt_offer_details od JOIN wow_odt_cust_details cd ON od.offer_id = cd.offer_id');

  console.log('JOIN counts:');
  console.log('od JOIN wow_wo_cust_details:', j1[0].cnt);
  console.log('od JOIN wow_odt_cust_details:', j2[0].cnt);

  await conn.end();
}

main().catch(console.error);
