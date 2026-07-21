// File: src/modules/mail/mail.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import { join } from 'path';
import { readFileSync } from 'fs';
import * as handlebars from 'handlebars';
import { MailService } from './mail.service';
import { NotificationController } from './notification.controller';
    
// Register the `eq` helper used in approval.hbs — Handlebars has no
// built-in equality helper, unlike PHP's inline if/else string checks.
handlebars.registerHelper('eq', (a: unknown, b: unknown) => a === b);

// Register the shared offer summary partial, reused across all approval
// email templates (per migration doc: "Reuse offer summary partial template").
handlebars.registerPartial(
  'offer-summary',
  readFileSync(join(__dirname, 'templates', 'partials', 'offer-summary.hbs'), 'utf8'),
);

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get<string>('MAIL_HOST'),
          port: config.get<number>('MAIL_PORT', 587),
          secure: config.get<boolean>('MAIL_SECURE', false),
          auth: {
            user: config.get<string>('MAIL_USER'),
            pass: config.get<string>('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: config.get<string>('MAIL_FROM', '"WOW Genie" <admin@wow.com>'),
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(undefined, { inlineCssEnabled: false }),
          options: { strict: true },
        },
      }),
    }),
  ],
  controllers: [NotificationController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}