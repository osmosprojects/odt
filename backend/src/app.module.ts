import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { MasterDataModule } from './modules/master-data/master-data.module';
import { OffersModule } from './modules/offers/offers.module';
import { OfferManagementModule } from './modules/offer-management/offer-management.module';
import { InputManagementModule } from './modules/input-management/input-management.module';
import { OfferLettersModule } from './modules/offer-letters/offer-letters.module';
import { ReportsModule } from './modules/reports/reports.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import {
  userDbConfig,
  roleDbConfig,
  offerDbConfig,
  masterDbConfig,
  notificationDbConfig,
  auditDbConfig,
} from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(userDbConfig),
    TypeOrmModule.forRoot(roleDbConfig),
    TypeOrmModule.forRoot(offerDbConfig),
    TypeOrmModule.forRoot(masterDbConfig),
    TypeOrmModule.forRoot(notificationDbConfig),
    TypeOrmModule.forRoot(auditDbConfig),
    AuthModule,
    MasterDataModule,
    OffersModule,
    OfferManagementModule,
    InputManagementModule,
    OfferLettersModule,
    ReportsModule,
    NotificationsModule,
  ],
})
export class AppModule {}
