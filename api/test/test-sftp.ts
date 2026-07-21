import { SFTPService } from '../src/modules/integrations/sftp.service';
import { ConfigService } from '@nestjs/config';

const config = new ConfigService({
  SFTP_HOST: 'test.rebex.net',
  SFTP_PORT: 22,
  SFTP_USER: 'testuser',
  SFTP_PASSWORD: 'testpassword',
});

const sftp = new SFTPService(config);
sftp.upload('hello world', '/pub/example/test.txt')