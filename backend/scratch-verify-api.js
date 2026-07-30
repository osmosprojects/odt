const { Test } = require('@nestjs/testing');
const { AppModule } = require('./dist/app.module');
const { OfferHistoryController } = require('./dist/modules/offer-history/offer-history.controller');

async function testServiceDirectly() {
  console.log('=== Initializing NestJS Testing Module ===');
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const controller = moduleRef.get(OfferHistoryController);

  console.log('\n--- Invoking lookupPreviousOfferGet ---');
  const result = await controller.lookupPreviousOfferGet({
    customerCode: '13303368',
    custId: '1',
    customerName: 'Shree Balaji Autowheels (India) pvt ltd',
  });

  console.log('\n=== Controller Result ===');
  console.log('Success:', result.success);
  console.log('Has Previous Offer:', result.hasPreviousOffer);
  console.log('previousContract:', JSON.stringify(result.previousContract, null, 2));
  console.log('previousSkuDetails Count:', result.previousSkuDetails ? result.previousSkuDetails.length : 0);
  console.log('previousSkuDetails Sample:', JSON.stringify(result.previousSkuDetails ? result.previousSkuDetails.slice(0, 2) : [], null, 2));
  console.log('historicalPackage:', JSON.stringify(result.historicalPackage, null, 2));
  console.log('customerPerformance:', JSON.stringify(result.customerPerformance, null, 2));
  console.log('previousOfferSummary:', JSON.stringify(result.previousOfferSummary, null, 2));

  await moduleRef.close();
}

testServiceDirectly().catch(console.error);
