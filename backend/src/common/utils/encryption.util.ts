import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96-bit IV recommended for AES-GCM
const AUTH_TAG_LENGTH = 16;

function getEncryptionKey(): Buffer {
  const secret =
    process.env.APP_ENCRYPTION_KEY ||
    process.env.JWT_ACCESS_SECRET ||
    'appnix_default_secure_vault_secret_key_32_bytes!';
  return crypto.createHash('sha256').update(secret).digest();
}

/**
 * Encrypts a plaintext string or object into an AES-256-GCM authenticated ciphertext
 */
export function encryptPayload(data: any): string {
  if (data === null || data === undefined) return '';
  const text = typeof data === 'object' ? JSON.stringify(data) : String(data);

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return `enc:v1:${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypts an AES-256-GCM authenticated ciphertext back to original string or object
 */
export function decryptPayload<T = any>(encryptedText: string): T {
  if (!encryptedText || !encryptedText.startsWith('enc:v1:')) {
    try {
      return JSON.parse(encryptedText);
    } catch {
      return encryptedText as any;
    }
  }

  const parts = encryptedText.split(':');
  if (parts.length !== 5) {
    throw new Error('Invalid encrypted payload format');
  }

  const [, , ivHex, authTagHex, cipherHex] = parts;
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, getEncryptionKey(), iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(cipherHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  try {
    return JSON.parse(decrypted);
  } catch {
    return decrypted as any;
  }
}

/**
 * Masks sensitive keys (API tokens, secrets, passwords) for safe client responses
 */
export function maskSensitiveFields(credentials: Record<string, any>): Record<string, any> {
  if (!credentials || typeof credentials !== 'object') return {};
  const masked: Record<string, any> = {};

  for (const [key, value] of Object.entries(credentials)) {
    if (typeof value === 'string') {
      const lowerKey = key.toLowerCase();
      if (
        lowerKey.includes('key') ||
        lowerKey.includes('secret') ||
        lowerKey.includes('token') ||
        lowerKey.includes('pass') ||
        lowerKey.includes('json') ||
        lowerKey.includes('connection')
      ) {
        if (value.length > 8) {
          masked[key] = `${value.substring(0, 4)}••••••••${value.substring(value.length - 4)}`;
        } else {
          masked[key] = '••••••••';
        }
      } else {
        masked[key] = value;
      }
    } else {
      masked[key] = value;
    }
  }
  return masked;
}
