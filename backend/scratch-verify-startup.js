const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module');

async function testStartup() {
  console.log('=== VERIFYING NESTJS APPLICATION STARTUP (DIST) ===');
  const app = await NestFactory.createApplicationContext(AppModule, { logger: ['log', 'error', 'warn'] });
  console.log('✅ NestJS application booted successfully!');
  await app.close();
  console.log('✅ Application context closed cleanly.');
}

testStartup().catch((err) => {
  console.error('❌ Application Startup Failed:', err);
  process.exit(1);
});
