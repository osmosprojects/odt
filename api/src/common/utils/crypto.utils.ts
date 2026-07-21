import { BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';

// PHP equivalent: core_decrypt($_GET['offerID']) / base64_decode()
// Port from core_decrypt.php — pure utility, no DI needed.

const ALGORITHM = 'aes-256-cbc';
const defaultCryptoSecret = 'dev-crypto-secret-32-chars-long!!';

function getKey(): Buffer {
  const secret = process.env.CRYPTO_SECRET ?? defaultCryptoSecret;
  return crypto.createHash('sha256').update(secret).digest();
}

export function decryptOfferId(payload: string): number {
  try {
    const [ivPart, dataPart] = payload.split(':');
    if (!ivPart || !dataPart) throw new Error('Malformed payload');

    const iv = Buffer.from(ivPart, 'base64');
    const encrypted = Buffer.from(dataPart, 'base64');

    const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

    const id = parseInt(decrypted.toString('utf8'), 10);
    if (isNaN(id)) throw new Error('Decrypted value is not a numeric ID');
    return id;
  } catch (err) {
    throw new BadRequestException('Invalid or corrupted ID');
  }
}

export function encryptOfferId(id: number): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(String(id), 'utf8'), cipher.final()]);
  return `${iv.toString('base64')}:${encrypted.toString('base64')}`;
}