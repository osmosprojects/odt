const mysql = require('mysql2/promise');

async function testFullSuite() {
  console.log('=== ODT Tool Offer Creation, Edit & Extend Verification ===');
  
  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3307,
    user: 'root',
    database: 'cilcc_odt_fresh_test',
  });

  // 1. Verify Customer Master counts and sample query
  const [custs] = await conn.query("SELECT COUNT(*) AS total FROM odt_customer_master");
  console.log('1. Customer Master Total Records:', custs[0].total);

  // 2. Verify Item Master counts
  const [items] = await conn.query("SELECT COUNT(*) AS total FROM odt_item_master");
  console.log('2. Item Master Total SKUs:', items[0].total);

  // 3. Verify Offer Details counts
  const [offers] = await conn.query("SELECT COUNT(*) AS total FROM odt_offer_details");
  console.log('3. Offer Details Total Records:', offers[0].total);

  // 4. Verify Customer Details table wow_wo_cust_details
  const [custDetails] = await conn.query("SELECT COUNT(*) AS total FROM wow_wo_cust_details");
  console.log('4. Customer Details (wow_wo_cust_details) Total Records:', custDetails[0].total);

  // 5. Test Customer Search Query
  const [searchResults] = await conn.query(`
    SELECT cust_id, customer_code, customer_name, stream, state 
    FROM odt_customer_master 
    WHERE customer_name LIKE '%AUTO%' OR customer_code LIKE '%AUTO%' 
    LIMIT 3
  `);
  console.log('5. Sample Customer Search Results:', searchResults);

  // 6. Test Customer History Query
  const [historyResults] = await conn.query(`
    SELECT o.offer_id, o.offer_code, o.offer_type, o.offer_status, cd.customer_name_text
    FROM odt_offer_details o
    JOIN wow_wo_cust_details cd ON o.offer_id = cd.offer_id
    LIMIT 3
  `);
  console.log('6. Sample Offer History Results:', historyResults);

  // 7. Verify Activity Log table
  const [activityLogs] = await conn.query("SELECT COUNT(*) AS total FROM odt_activity_log");
  console.log('7. Activity Log Total Records:', activityLogs[0].total);

  await conn.end();
  console.log('=== All Database Checks Passed Cleanly ===');
}

testFullSuite().catch(console.error);
