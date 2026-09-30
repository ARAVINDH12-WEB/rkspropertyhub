import jwt from "jsonwebtoken";
import { Response } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "rks_realty_super_secret_jwt_key_2026_verified";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "rks_realty_refresh_token_secret_key_2026";
const ACCESS_TOKEN_EXPIRY = "15m"; // Short-lived access token
const REFRESH_TOKEN_EXPIRY = "7d"; // Long-lived refresh token

export interface TokenPayload {
  id: string;
  email: string;
  role: "BUYER" | "AGENT" | "ADMIN";
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
};

// Backward-compatible alias
export const generateToken = generateAccessToken;

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
};

// Backward-compatible alias
export const verifyToken = verifyAccessToken;

/**
 * Sets the Refresh Token in a hardened httpOnly, sameSite cookie.
 */
export const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
  res.cookie("rks_refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/v1/auth",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

/**
 * Clears the Refresh Token cookie on logout.
 */
export const clearRefreshTokenCookie = (res: Response) => {
  res.clearCookie("rks_refresh_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/v1/auth",
  });
};
