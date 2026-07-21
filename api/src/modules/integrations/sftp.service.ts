import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Client from 'ssh2-sftp-client';

@Injectable()
export class SFTPService {
  private readonly logger = new Logger(SFTPService.name);

  constructor(private readonly configService: ConfigService) {}

  private getConfig() {
    return {
      host: this.configService.get<string>('SFTP_HOST'),
      port: this.configService.get<number>('SFTP_PORT') ?? 22,
      username: this.configService.get<string>('SFTP_USER'),
      password: this.configService.get<string>('SFTP_PASSWORD'),
    };
  }

  async upload(
    content: Buffer | string,
    remotePath: string,
  ): Promise<void> {
    const sftp = new Client();
    try {
      await sftp.connect(this.getConfig());
      this.logger.log(`Connected to SFTP. Uploading to ${remotePath}`);

      const buffer =
        typeof content === 'string' ? Buffer.from(content, 'utf-8') : content;

      await sftp.put(buffer, remotePath);
      this.logger.log(`Upload successful → ${remotePath}`);
    } catch (err) {
      this.logger.error(`SFTP upload failed for ${remotePath}`, err);
      throw err;
    } finally {
      await sftp.end();
    }
  }

  async download(remotePath: string): Promise<Buffer> {
    const sftp = new Client();
    try {
      await sftp.connect(this.getConfig());
      this.logger.log(`Downloading from SFTP: ${remotePath}`);
      const data = await sftp.get(remotePath);
      return data as Buffer;
    } catch (err) {
      this.logger.error(`SFTP download failed for ${remotePath}`, err);
      throw err;
    } finally {
      await sftp.end();
    }
  }

  async exists(remotePath: string): Promise<boolean> {
    const sftp = new Client();
    try {
      await sftp.connect(this.getConfig());
      const result = await sftp.exists(remotePath);
      return result !== false;
    } catch (err) {
      this.logger.error(`SFTP exists check failed for ${remotePath}`, err);
      throw err;
    } finally {
      await sftp.end();
    }
  }

  async list(remoteDir: string): Promise<string[]> {
    const sftp = new Client();
    try {
      await sftp.connect(this.getConfig());
      const files = await sftp.list(remoteDir);
      return files.map((f) => f.name);
    } catch (err) {
      this.logger.error(`SFTP list failed for ${remoteDir}`, err);
      throw err;
    } finally {
      await sftp.end();
    }
  }
}