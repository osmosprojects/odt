import { Module, Global } from '@nestjs/common';
import { SettingsService } from './services/settings.service';
import { ArchiveService } from './services/archive.service';
import { FileService } from './services/file.service';

@Global()
@Module({
  providers: [SettingsService,ArchiveService,FileService],
  exports: [SettingsService,ArchiveService,FileService],
})
export class CommonModule {}