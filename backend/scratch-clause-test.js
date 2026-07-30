const mysql = require('mysql2/promise');

async function testClauses() {
  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3307,
    user: 'root',
    password: 'V!n@y7997',
    database: 'cilcc_odt_fresh_test'
  });

  const queries = [
    {
      name: "Step 1: Simple SELECT od.offer_id LIMIT 5",
      sql: "SELECT od.offer_id FROM odt_offer_details od LIMIT 5"
    },
    {
      name: "Step 2: Add LEFT JOIN wow_wo_cust_details cd",
      sql: "SELECT od.offer_id, cd.customer_name_text FROM odt_offer_details od LEFT JOIN wow_wo_cust_details cd ON od.offer_id = cd.offer_id LIMIT 5"
    },
    {
      name: "Step 3: Add offer_status filter WHERE od.offer_status NOT IN ('DEL')",
      sql: "SELECT od.offer_id, cd.customer_name_text FROM odt_offer_details od LEFT JOIN wow_wo_cust_details cd ON od.offer_id = cd.offer_id WHERE od.offer_status NOT IN ('DEL') LIMIT 5"
    },
    {
      name: "Step 4: Add customerCode filter on cd.customer_distributor_jde_ab_no_text",
      sql: "SELECT od.offer_id, cd.customer_name_text FROM odt_offer_details od LEFT JOIN wow_wo_cust_details cd ON od.offer_id = cd.offer_id WHERE od.offer_status NOT IN ('DEL') AND cd.customer_distributor_jde_ab_no_text = '01125828' LIMIT 5"
    },
    {
      name: "Step 5: Add customerName filter cd.customer_name_text LIKE '%Industrial%'",
      sql: "SELECT od.offer_id, cd.customer_name_text FROM odt_offer_details od LEFT JOIN wow_wo_cust_details cd ON od.offer_id = cd.offer_id WHERE od.offer_status NOT IN ('DEL') AND (cd.customer_name_text LIKE '%Industrial%') LIMIT 5"
    },
    {
      name: "Step 6: Add ORDER BY od.start_date DESC, od.id DESC without LIMIT",
      sql: "SELECT od.offer_id, cd.customer_name_text FROM odt_offer_details od LEFT JOIN wow_wo_cust_details cd ON od.offer_id = cd.offer_id WHERE od.offer_status NOT IN ('DEL') AND (cd.customer_name_text LIKE '%Industrial%') ORDER BY od.start_date DESC, od.id DESC"
    },
    {
      name: "Step 7: Full SELECT od.* (including 4 LONGTEXT columns) without LIMIT when no match/broad match (returns 24k rows)",
      sql: "SELECT od.*, cd.customer_name_text FROM odt_offer_details od LEFT JOIN wow_wo_cust_details cd ON od.offer_id = cd.offer_id WHERE od.offer_status NOT IN ('DEL') ORDER BY od.start_date DESC, od.id DESC LIMIT 1000"
    }
  ];

  for (const q of queries) {
    console.log(`\n--- ${q.name} ---`);
    console.log("SQL:", q.sql);
    const start = Date.now();
    try {
      const [rows] = await conn.query(q.sql);
      const elapsed = Date.now() - start;
      console.log(`Elapsed: ${elapsed}ms | Returned rows: ${rows.length}`);
    } catch (e) {
      console.error("Error:", e.message);
    }
  }

  await conn.end();
}

testClauses().catch(console.error);
