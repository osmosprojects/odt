import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController, TestCryptoController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { OfferModule } from './modules/offer/offer.module';
import { CommonModule } from './common/common.module';
import { ApprovalModule } from './modules/approval/approval.module';
import { SkuModule } from './modules/sku/sku.module';
import { CustomerModule } from './modules/customer/customer.module';
import { PidModule } from './modules/pid/pid.module';
import { PidController } from './modules/pid/pid.controller';
import { ReportsModule } from './modules/reports/reports.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MailModule } from './modules/mail/mail.module';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { DatabaseService } from './database/database.service';
import { ItemModule } from './modules/item/item.module';
import { OfferHistoryModule } from './modules/offer-history/offer-history.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        join(process.cwd(), '.env'),
        join(process.cwd(), 'apps/api/.env'),
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 3307),
        username: config.get<string>('DB_USERNAME', 'root'),
        password: config.get<string>('DB_PASSWORD', 'V!n@y7997'),
        database: config.get<string>('DB_NAME', 'cilcc_odt_fresh_test'),
        autoLoadEntities: true,
        synchronize: false,
        charset: 'utf8mb4',
        logging: true,
        logger: 'advanced-console',
      }),
    }),
    AuthModule,
    OfferModule,
    CommonModule,
    ApprovalModule,
    SkuModule,
    CustomerModule,
    PidModule,
    ReportsModule,
    ScheduleModule.forRoot(),
    MailModule,
    EventEmitterModule.forRoot(),
    ItemModule,
    OfferHistoryModule,
  ],
  controllers: [AppController,TestCryptoController],
  providers: [
  AppService,
  DatabaseService,
],
})
export class AppModule {}
