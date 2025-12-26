import crypto from "crypto";
import { config } from "../config";

const ALGORITHM = "aes-256-gcm";
const KEY = config.encryptionKey; // Must be 32 chars

export const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(KEY), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
};

export const decrypt = (text: string): string => {
  const [ivHex, authTagHex, encryptedText] = text.split(":");
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(KEY),
    Buffer.from(ivHex, "hex")
  );
  decipher.setAuthTag(Buffer.from(authTagHex, "hex"));
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};
