const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module');
const { OfferHistoryService } = require('./dist/modules/offer-history/offer-history.service');

async function testFullNestJs() {
  console.log('=== INITIALIZING NESTJS STANDALONE APP ===');
  const app = await NestFactory.createApplicationContext(AppModule, { logger: ['log', 'error', 'warn'] });
  const service = app.get(OfferHistoryService);

  console.log('\n==================================================');
  console.log('TEST 1: Search by customerName = "Shree Balaji Autowheels (India) pvt ltd"');
  console.log('==================================================');
  const res1 = await service.lookupPreviousOffer({ customerName: 'Shree Balaji Autowheels (India) pvt ltd' });
  console.log('Test 1 Result Metrics:', {
    AR_SEOL_current: res1.previousOffer?.AR_SEOL_current,
    total_investment_current: res1.previousOffer?.total_investment_current,
    rs_l_investment_current: res1.previousOffer?.rs_l_investment_current,
    gmpl_current: res1.previousOffer?.gmpl_current,
    kl_pm_current: res1.previousOffer?.kl_pm_current,
  });

  console.log('\n==================================================');
  console.log('TEST 2: Search by customerCode = "13302833"');
  console.log('==================================================');
  const res2 = await service.lookupPreviousOffer({ customerCode: '13302833' });
  console.log('Test 2 Result Metrics:', {
    AR_SEOL_current: res2.previousOffer?.AR_SEOL_current,
    total_investment_current: res2.previousOffer?.total_investment_current,
    rs_l_investment_current: res2.previousOffer?.rs_l_investment_current,
    gmpl_current: res2.previousOffer?.gmpl_current,
    kl_pm_current: res2.previousOffer?.kl_pm_current,
  });

  console.log('\n==================================================');
  console.log('TEST 3: Search by customerName = "Venus Cars"');
  console.log('==================================================');
  const res3 = await service.lookupPreviousOffer({ customerName: 'Venus Cars' });
  console.log('Test 3 Result Metrics:', {
    AR_SEOL_current: res3.previousOffer?.AR_SEOL_current,
    total_investment_current: res3.previousOffer?.total_investment_current,
    rs_l_investment_current: res3.previousOffer?.rs_l_investment_current,
    gmpl_current: res3.previousOffer?.gmpl_current,
    kl_pm_current: res3.previousOffer?.kl_pm_current,
  });

  await app.close();
}

testFullNestJs().catch(console.error);
