import crypto from "node:crypto";
import { LRUCache } from "lru-cache";
import { config } from "@/config";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;
const ITERATIONS = 100000;

// ENCRYPTION_KEY is required and validated at startup via Zod schema
const MASTER_KEY = config.encryptionKey;

const keyCache = new LRUCache<string, Buffer>({
  max: 100,
  ttl: 5 * 60 * 1000,
});

function getKey(salt: Buffer): Buffer {
  const cacheKey = salt.toString("hex");
  let key = keyCache.get(cacheKey);
  if (!key) {
    key = crypto.pbkdf2Sync(MASTER_KEY, salt, ITERATIONS, KEY_LENGTH, "sha512");
    keyCache.set(cacheKey, key);
  }
  return key;
}

export const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const salt = crypto.randomBytes(SALT_LENGTH);
  const key = getKey(salt);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return Buffer.concat([salt, iv, tag, encrypted]).toString("hex");
};

export const decrypt = (ciphertext: string): string => {
  const data = Buffer.from(ciphertext, "hex");

  const salt = data.subarray(0, SALT_LENGTH);
  const iv = data.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const tag = data.subarray(
    SALT_LENGTH + IV_LENGTH,
    SALT_LENGTH + IV_LENGTH + TAG_LENGTH
  );
  const text = data.subarray(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);

  const key = getKey(salt);
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  return decipher.update(text) + decipher.final("utf8");
};
