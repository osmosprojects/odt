const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module');
const { OfferHistoryService } = require('./dist/modules/offer-history/offer-history.service');

async function testSkuApi() {
  console.log('=== VERIFYING PREVIOUS SKU API RESPONSE ===');
  const app = await NestFactory.createApplicationContext(AppModule, { logger: ['log', 'error', 'warn'] });
  const service = app.get(OfferHistoryService);

  const res = await service.lookupPreviousOffer({ customerName: 'Shree Balaji Autowheels (India) pvt ltd' });
  
  console.log('\n--- VERIFICATION OUTPUT ---');
  console.log('Success:', res.success);
  console.log('Offer Code:', res.previousOffer?.offerCode);
  console.log('SKUs Count:', res.previousOffer?.skus?.length);
  console.log('First SKU:', res.previousOffer?.skus?.[0]);

  await app.close();
}

testSkuApi().catch(console.error);
