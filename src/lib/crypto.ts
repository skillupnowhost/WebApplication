import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

/**
 * Encrypts Google OAuth tokens at rest — a refresh token is a long-lived
 * bearer credential to a mentor's real Calendar/Drive, so it must not sit
 * in dev.db as plaintext.
 */
function getKey() {
  const hex = process.env.GOOGLE_TOKEN_ENCRYPTION_KEY ?? "";
  if (hex.length !== 64) {
    throw new Error(
      "GOOGLE_TOKEN_ENCRYPTION_KEY must be a 64-character hex string (32 bytes) — see .env.example."
    );
  }
  return Buffer.from(hex, "hex");
}

export function encryptToken(plaintext: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [iv.toString("base64"), authTag.toString("base64"), ciphertext.toString("base64")].join(":");
}

export function decryptToken(stored: string): string {
  const [ivB64, tagB64, dataB64] = stored.split(":");
  const decipher = createDecipheriv("aes-256-gcm", getKey(), Buffer.from(ivB64, "base64"));
  decipher.setAuthTag(Buffer.from(tagB64, "base64"));
  return Buffer.concat([decipher.update(Buffer.from(dataB64, "base64")), decipher.final()]).toString("utf8");
}
