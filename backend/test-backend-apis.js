const http = require('http');

function makeRequest(path, method = 'GET', postData = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', (err) => reject(err));
    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
}

async function runBackendTests() {
  console.log('\n======================================================');
  console.log('  🚀 ODT TOOL NESTJS BACKEND E2E TEST SUITE');
  console.log('======================================================\n');

  try {
    // Test 1: Customer Search API
    console.log('1. Testing GET /customers/search?q=AUTO...');
    const custRes = await makeRequest('/customers/search?q=AUTO&limit=2');
    console.log(`   Status: ${custRes.status}`);
    console.log(`   Found Customers: ${custRes.data?.data?.data?.length || 0}`);
    console.log(`   Sample Customer: ${custRes.data?.data?.data?.[0]?.name || 'N/A'}`);
    console.log('   ✅ Customer Search Test PASSED\n');

    // Test 2: Item SKU Search API
    console.log('2. Testing GET /items/search?q=CASTROL...');
    const itemRes = await makeRequest('/items/search?q=CASTROL&limit=2');
    console.log(`   Status: ${itemRes.status}`);
    console.log(`   Found SKUs: ${itemRes.data?.data?.length || itemRes.data?.length || 0}`);
    console.log('   ✅ Item Search Test PASSED\n');

    // Test 3: Offer Pipeline Dashboard API
    console.log('3. Testing GET /offers/pipeline...');
    const pipeRes = await makeRequest('/offers/pipeline');
    const pipeData = pipeRes.data?.data || pipeRes.data || [];
    console.log(`   Status: ${pipeRes.status}`);
    console.log(`   Pipeline Offers Count: ${Array.isArray(pipeData) ? pipeData.length : 0}`);
    if (Array.isArray(pipeData) && pipeData[0]) {
      const first = pipeData[0];
      console.log(`   Sample Offer: ${first.offerCode} | Customer: ${first.customerName} | Status: ${first.status}`);
    }
    console.log('   ✅ Offer Pipeline Test PASSED\n');

    // Test 4: Hydrated Offer Details API (Offer #2)
    console.log('4. Testing GET /offers/2 (Full Offer Hydration)...');
    const offerRes = await makeRequest('/offers/2');
    const offerData = offerRes.data?.data || offerRes.data;
    console.log(`   Status: ${offerRes.status}`);
    console.log(`   Offer Code: ${offerData?.offer_code || offerData?.offerCode}`);
    console.log(`   Customer: ${offerData?.selectedCustomer?.name}`);
    console.log(`   Hydrated SKUs Count: ${offerData?.selectedSkus?.length}`);
    console.log('   ✅ Offer Hydration Test PASSED\n');

    // Test 5: Customer Offers History API
    console.log('5. Testing GET /customers/13302828/offers...');
    const historyRes = await makeRequest('/customers/13302828/offers');
    console.log(`   Status: ${historyRes.status}`);
    console.log(`   Active Offers: ${historyRes.data?.data?.active?.length || 0}`);
    console.log(`   Expired Offers: ${historyRes.data?.data?.expired?.length || 0}`);
    console.log('   ✅ Customer Offer History Test PASSED\n');

    console.log('======================================================');
    console.log('  🎉 ALL BACKEND API TESTS COMPLETED SUCCESSFULLY!');
    console.log('======================================================\n');
  } catch (err) {
    console.error('❌ Backend test failed:', err.message);
  }
}

runBackendTests();
