import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

// Encryption key must be 32 bytes (256 bits). Uses PII_ENCRYPTION_KEY or a fallback derived from JWT_SECRET
function getEncryptionKey(): Buffer {
  const secret = process.env.PII_ENCRYPTION_KEY || process.env.JWT_SECRET || "default_secure_key_for_rks_realty_32_bytes!!";
  return crypto.createHash("sha256").update(secret).digest();
}

/**
 * Encrypt sensitive PII text using AES-256-GCM.
 * Output format: iv:authTag:encryptedHex
 */
export function encryptPII(text: string): string {
  if (!text) return "";
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv);
  
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

/**
 * Decrypt sensitive PII text encrypted with encryptPII.
 */
export function decryptPII(cipherText: string): string {
  if (!cipherText || !cipherText.includes(":")) return cipherText;
  try {
    const [ivHex, tagHex, encryptedData] = cipherText.split(":");
    if (!ivHex || !tagHex || !encryptedData) return cipherText;

    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(tagHex, "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, getEncryptionKey(), iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (err) {
    console.error("PII Decryption failed:", err);
    return "[Encrypted Data]";
  }
}

/**
 * Generates a secure URL-safe random token.
 */
export function generateSecureToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString("hex");
}

/**
 * Hash a token with SHA-256 (useful for stored reset tokens).
 */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}
