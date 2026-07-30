// File: src/modules/mail/mail.module.ts
import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import { join } from 'path';
import { readFileSync, existsSync } from 'fs';
import * as handlebars from 'handlebars';
import { MailService } from './mail.service';
import { NotificationController } from './notification.controller';

const logger = new Logger('MailModule');

// Register the `eq` helper used in approval.hbs — Handlebars has no
// built-in equality helper, unlike PHP's inline if/else string checks.
handlebars.registerHelper('eq', (a: unknown, b: unknown) => a === b);

/** Environment-safe template path resolution */
function getTemplatePath(filename: string): string | null {
  const primaryPath = join(__dirname, 'templates', filename);
  if (existsSync(primaryPath)) {
    return primaryPath;
  }
  const fallbackSrcPath = join(process.cwd(), 'src', 'modules', 'mail', 'templates', filename);
  if (existsSync(fallbackSrcPath)) {
    return fallbackSrcPath;
  }
  const fallbackDistPath = join(process.cwd(), 'dist', 'modules', 'mail', 'templates', filename);
  if (existsSync(fallbackDistPath)) {
    return fallbackDistPath;
  }
  return null;
}

/** Environment-safe template directory resolution */
function getTemplateDir(): string {
  const dirInDirname = join(__dirname, 'templates');
  if (existsSync(dirInDirname)) return dirInDirname;
  const dirInSrc = join(process.cwd(), 'src', 'modules', 'mail', 'templates');
  if (existsSync(dirInSrc)) return dirInSrc;
  const dirInDist = join(process.cwd(), 'dist', 'modules', 'mail', 'templates');
  if (existsSync(dirInDist)) return dirInDist;
  return dirInDirname;
}

// Safely register partial without crashing application startup if template is missing
const offerSummaryPath = getTemplatePath('offer-summary.hbs');
if (offerSummaryPath) {
  try {
    const templateContent = readFileSync(offerSummaryPath, 'utf8');
    handlebars.registerPartial('offer-summary', templateContent);
    logger.log(`[MailModule] Successfully registered partial 'offer-summary' from ${offerSummaryPath}`);
  } catch (err: any) {
    logger.warn(`[MailModule] Could not read offer-summary.hbs partial: ${err.message}`);
  }
} else {
  logger.warn(`[MailModule] Partial template 'offer-summary.hbs' not found at startup. Mail module continuing safely.`);
}

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
          dir: getTemplateDir(),
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