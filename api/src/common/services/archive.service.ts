import { Injectable } from '@nestjs/common';
import { Response } from 'express';
const archiver = require('archiver');

@Injectable()
export class ArchiveService {
  streamZip(res: Response, zipFilename: string, files: { name: string; content: Buffer | string }[]): void {
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename=${zipFilename}`,
    });

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(res);
    files.forEach((file) => archive.append(file.content, { name: file.name }));
    archive.finalize();
  }
}