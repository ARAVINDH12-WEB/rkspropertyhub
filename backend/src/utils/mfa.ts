import { generateSecret, generateURI, verify } from "otplib";
import QRCode from "qrcode";

export interface MfaSetupData {
  secret: string;
  qrCodeUrl: string;
  otpauthUrl: string;
}

/**
 * Generate a new TOTP MFA secret and QR code for an account.
 */
export async function generateMfaSecret(email: string, issuer = "RKS Realty"): Promise<MfaSetupData> {
  const secret = generateSecret();
  const otpauthUrl = generateURI({
    issuer,
    label: email,
    secret,
  });
  const qrCodeUrl = await QRCode.toDataURL(otpauthUrl);

  return { secret, qrCodeUrl, otpauthUrl };
}

/**
 * Verify a 6-digit TOTP token against a user's secret.
 */
export function verifyMfaToken(token: string, secret: string): boolean {
  try {
    const result = verify({
      token,
      secret,
    });
    return !!result;
  } catch (err) {
    return false;
  }
}
