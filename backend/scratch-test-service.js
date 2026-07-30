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
    customerCode: '13302828',
    custId: '13302828',
    customerName: 'AUTOMOTIVE',
  });

  console.log('\n=== Controller Result ===');
  console.log('Success:', result.success);
  console.log('Has Previous Offer:', result.hasPreviousOffer);
  console.log('History Count:', result.offerHistory ? result.offerHistory.length : 0);
  if (result.previousOffer) {
    console.log('Latest Offer ID:', result.previousOffer.offer_id || result.previousOffer.offerId);
    console.log('Latest Offer Code:', result.previousOffer.offer_code || result.previousOffer.offerCode);
  }

  await moduleRef.close();
}

testServiceDirectly().catch(console.error);
