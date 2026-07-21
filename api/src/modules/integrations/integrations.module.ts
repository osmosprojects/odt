import { Module } from '@nestjs/common';
import { SFTPService } from './sftp.service';
import { KerisService } from './kervice.integrations';

@Module({
  providers: [SFTPService, KerisService],
  exports: [SFTPService, KerisService],
})
export class IntegrationsModule {}