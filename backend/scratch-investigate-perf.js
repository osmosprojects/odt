const mysql = require('mysql2/promise');

async function runInvestigation() {
  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3307,
    user: 'root',
    password: 'V!n@y7997',
    database: 'cilcc_odt_fresh_test'
  });

  console.log('--- 1 & 2. SHOW INDEXES on odt_offer_details ---');
  const [indexesOffer] = await conn.query(`SHOW INDEX FROM odt_offer_details`);
  console.log(indexesOffer.map(i => ({ Table: i.Table, Key_name: i.Key_name, Column_name: i.Column_name })));

  console.log('\n--- SHOW INDEXES on wow_wo_cust_details ---');
  const [indexesCust] = await conn.query(`SHOW INDEX FROM wow_wo_cust_details`);
  console.log(indexesCust.map(i => ({ Table: i.Table, Key_name: i.Key_name, Column_name: i.Column_name })));

  console.log('\n--- SHOW PROCESSLIST ---');
  const [processlist] = await conn.query(`SHOW PROCESSLIST`);
  console.log(processlist);

  console.log('\n--- 5. SIMPLIFIED QUERY EXPERIMENTS & EXPLAIN ---');

  // Let's check row counts first
  const [[{ count: offerCount }]] = await conn.query(`SELECT COUNT(*) as count FROM odt_offer_details`);
  const [[{ count: custCount }]] = await conn.query(`SELECT COUNT(*) as count FROM wow_wo_cust_details`);
  console.log(`Row counts: odt_offer_details = ${offerCount}, wow_wo_cust_details = ${custCount}`);

  // Base query from findAllByCustomerIdentifiers when parameters are passed or not passed
  // Let's test with typical input e.g. customerCode='10001', custIdStr='10001', executiveCode='EXEC1', customerName='ACME'
  // Or test with NO parameters passed or specific parameter combinations
  
  const testParams = [
    { label: "No parameters (all records)", code: "", execCode: "", name: "" },
    { label: "With customerCode '10000'", code: "10000", execCode: "", name: "" },
    { label: "With customerName 'Industrial'", code: "", execCode: "", name: "Industrial" },
    { label: "With execCode 'EX01'", code: "", execCode: "EX01", name: "" }
  ];

  for (const t of testParams) {
    console.log(`\n=== Testing Scenario: ${t.label} ===`);
    let sql = `SELECT od.*, cd.customer_name_text AS customer_name_text, cd.bp_sales_rep_text AS bp_sales_rep_text, cd.cust_state AS cust_state, cd.segment_text AS segment_text, cd.sub_segment_text AS sub_segment_text, cd.customer_distributor_jde_ab_no_text AS customer_distributor_jde_ab_no_text, cd.customer_turfview_no_text AS customer_turfview_no_text FROM odt_offer_details od LEFT JOIN wow_wo_cust_details cd ON od.offer_id = cd.offer_id WHERE od.offer_status NOT IN ('DEL')`;
    
    const orConditions = [];
    const params = [];
    if (t.code) {
      orConditions.push(`(cd.customer_distributor_jde_ab_no_text IS NOT NULL AND cd.customer_distributor_jde_ab_no_text IN (?))`);
      params.push(t.code);
      orConditions.push(`(cd.customer_turfview_no_text IS NOT NULL AND cd.customer_turfview_no_text IN (?))`);
      params.push(t.code);
    }
    if (t.execCode) {
      orConditions.push(`(od.executive_code IS NOT NULL AND od.executive_code = ?)`);
      params.push(t.execCode);
    }
    if (t.name) {
      orConditions.push(`(cd.customer_name_text IS NOT NULL AND (TRIM(cd.customer_name_text) = ? OR cd.customer_name_text LIKE ?))`);
      params.push(t.name, `%${t.name}%`);
    }

    if (orConditions.length > 0) {
      sql += ` AND (${orConditions.join(' OR ')})`;
    }
    sql += ` ORDER BY od.start_date DESC, od.id DESC`;

    console.log("SQL:", sql);
    console.log("Params:", params);

    // Run EXPLAIN
    const [explain] = await conn.query(`EXPLAIN ${sql}`, params);
    console.log("EXPLAIN Result:");
    console.table(explain);

    // Measure Execution Time
    const start = Date.now();
    const [rows] = await conn.query(sql, params);
    const elapsed = Date.now() - start;
    console.log(`Execution Time: ${elapsed}ms | Rows returned: ${rows.length}`);
  }

  await conn.end();
}

runInvestigation().catch(console.error);
