// PHP equivalent: move_uploaded_file($_FILES['file']['tmp_name'], $dest)
import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
// Define a minimal local type for uploaded files to avoid depending on Multer ambient types
type UploadedFile = {
  originalname: string;
  mimetype: string;
  size: number;
  buffer?: Buffer;
  path?: string;
};

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

@Injectable()
export class FileService {
  saveUploadedFile(file: UploadedFile | any): { filename: string; path: string } {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(`File type ${file.mimetype} not allowed`);
    }
    if (file.size > MAX_SIZE_BYTES) {
      throw new BadRequestException('File exceeds 10MB limit');
    }

    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const filename = `${Date.now()}-${file.originalname}`;
    const destPath = path.join(UPLOAD_DIR, filename);

    try {
      // Support both memory storage (file.buffer) and disk storage (file.path)
      if (file.buffer && Buffer.isBuffer(file.buffer)) {
        fs.writeFileSync(destPath, file.buffer);
      } else if (file.path && typeof file.path === 'string') {
        fs.copyFileSync(file.path, destPath);
      } else {
        throw new Error('Uploaded file has no buffer or path');
      }
    } catch (err) {
      throw new BadRequestException(`Failed to save uploaded file: ${err}`);
    }

    return { filename, path: destPath };
  }
}