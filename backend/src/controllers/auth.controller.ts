import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../config/db";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from "../utils/jwt";
import { generateMfaSecret, verifyMfaToken } from "../utils/mfa";
import { generateSecureToken, hashToken } from "../utils/crypto";
import { createAuditLog, getClientInfo } from "../utils/audit";
import { AppError } from "../middleware/errorHandler";
import { AuthRequest } from "../middleware/auth";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Register a new user account.
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { ip, userAgent } = getClientInfo(req);
  try {
    const { name, email, password, phone, role } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new AppError("Email is already registered", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        role: role || "BUYER",
      },
    });

    const roleTyped = user.role as "BUYER" | "AGENT" | "ADMIN";
    const accessToken = generateAccessToken({ id: user.id, email: user.email, role: roleTyped });
    const refreshToken = generateRefreshToken({ id: user.id, email: user.email, role: roleTyped });

    // Store refresh token & set cookie
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });
    setRefreshTokenCookie(res, refreshToken);

    await createAuditLog({
      userId: user.id,
      action: "AUTH_REGISTER",
      ip,
      userAgent,
      details: { role: user.role, email: user.email },
    });

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: {
        token: accessToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isMfaEnabled: false,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login with rate limiting, account lockout defense, and TOTP MFA.
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { ip, userAgent } = getClientInfo(req);
  try {
    const { email, password, mfaToken } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      await createAuditLog({
        action: "AUTH_LOGIN_FAILED_UNKNOWN_EMAIL",
        ip,
        userAgent,
        details: { email },
      });
      throw new AppError("Invalid email or password", 401);
    }

    // 1. Check Account Lockout
    if (user.lockoutUntil && user.lockoutUntil > new Date()) {
      const remainingMinutes = Math.ceil(
        (user.lockoutUntil.getTime() - Date.now()) / (60 * 1000)
      );
      await createAuditLog({
        userId: user.id,
        action: "AUTH_LOGIN_BLOCKED_LOCKOUT",
        ip,
        userAgent,
        details: { remainingMinutes },
      });
      throw new AppError(
        `Account is temporarily locked due to multiple failed login attempts. Please try again in ${remainingMinutes} minute(s).`,
        403
      );
    }

    // 2. Validate Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const attempts = user.failedLoginAttempts + 1;
      const isNowLocked = attempts >= MAX_FAILED_ATTEMPTS;
      const lockoutUntil = isNowLocked ? new Date(Date.now() + LOCKOUT_DURATION_MS) : null;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: attempts,
          lockoutUntil,
        },
      });

      await createAuditLog({
        userId: user.id,
        action: isNowLocked ? "AUTH_USER_LOCKOUT" : "AUTH_LOGIN_PASSWORD_MISMATCH",
        ip,
        userAgent,
        details: { attempts, isNowLocked },
      });

      if (isNowLocked) {
        throw new AppError(
          "Too many failed login attempts. Your account has been locked for 15 minutes for your security.",
          403
        );
      }

      throw new AppError(`Invalid email or password. (${MAX_FAILED_ATTEMPTS - attempts} attempts remaining)`, 401);
    }

    // 3. Reset failed login counter on successful password match
    if (user.failedLoginAttempts > 0 || user.lockoutUntil) {
      await prisma.user.update({
        where: { id: user.id },
        data: { failedLoginAttempts: 0, lockoutUntil: null },
      });
    }

    // 4. Multi-Factor Authentication (TOTP)
    if (user.isMfaEnabled) {
      if (!mfaToken) {
        return res.status(200).json({
          success: true,
          mfaRequired: true,
          message: "Please enter your 6-digit Authenticator code to complete login.",
        });
      }

      const isValidMfa = user.mfaSecret && verifyMfaToken(mfaToken, user.mfaSecret);
      if (!isValidMfa) {
        await createAuditLog({
          userId: user.id,
          action: "AUTH_MFA_FAILED",
          ip,
          userAgent,
        });
        throw new AppError("Invalid 6-digit MFA verification code.", 401);
      }
    }

    // 5. Issue Access & Refresh Tokens
    const roleTyped = user.role as "BUYER" | "AGENT" | "ADMIN";
    const accessToken = generateAccessToken({ id: user.id, email: user.email, role: roleTyped });
    const refreshToken = generateRefreshToken({ id: user.id, email: user.email, role: roleTyped });

    // Store refresh token in DB & set in hardened httpOnly cookie
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });
    setRefreshTokenCookie(res, refreshToken);

    await createAuditLog({
      userId: user.id,
      action: "AUTH_LOGIN_SUCCESS",
      ip,
      userAgent,
      details: { role: user.role },
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token: accessToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isMfaEnabled: user.isMfaEnabled,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Rotate Refresh Token & Issue fresh Access Token.
 */
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const { ip, userAgent } = getClientInfo(req);
  try {
    const token = req.cookies?.rks_refresh_token;
    if (!token) {
      throw new AppError("No refresh token provided", 401);
    }

    const payload = verifyRefreshToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.id } });

    if (!user || user.refreshToken !== token) {
      // Possible token reuse attack detected! Invalidate stored token.
      if (user) {
        await prisma.user.update({ where: { id: user.id }, data: { refreshToken: null } });
      }
      clearRefreshTokenCookie(res);
      await createAuditLog({
        userId: user?.id,
        action: "AUTH_REFRESH_TOKEN_REUSE_DETECTED",
        ip,
        userAgent,
      });
      throw new AppError("Invalid or expired session. Please sign in again.", 401);
    }

    const roleTyped = user.role as "BUYER" | "AGENT" | "ADMIN";
    const newAccessToken = generateAccessToken({ id: user.id, email: user.email, role: roleTyped });
    const newRefreshToken = generateRefreshToken({ id: user.id, email: user.email, role: roleTyped });

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });
    setRefreshTokenCookie(res, newRefreshToken);

    res.json({
      success: true,
      data: {
        token: newAccessToken,
      },
    });
  } catch (error) {
    clearRefreshTokenCookie(res);
    next(error);
  }
};

/**
 * Logout and invalidate session.
 */
export const logout = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { ip, userAgent } = getClientInfo(req);
  try {
    if (req.user) {
      await prisma.user.update({
        where: { id: req.user.id },
        data: { refreshToken: null },
      });
      await createAuditLog({
        userId: req.user.id,
        action: "AUTH_LOGOUT",
        ip,
        userAgent,
      });
    }

    clearRefreshTokenCookie(res);
    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

/**
 * Setup TOTP Multi-Factor Authentication (generates QR code).
 */
export const setupMfa = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError("Not authenticated", 401);

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) throw new AppError("User not found", 404);

    const mfaData = await generateMfaSecret(user.email, "RKS Realty");

    // Store secret temporarily until verified
    await prisma.user.update({
      where: { id: user.id },
      data: { mfaSecret: mfaData.secret },
    });

    res.json({
      success: true,
      data: {
        qrCodeUrl: mfaData.qrCodeUrl,
        secret: mfaData.secret,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Confirm and Enable TOTP Multi-Factor Authentication.
 */
export const verifyAndEnableMfa = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { ip, userAgent } = getClientInfo(req);
  try {
    if (!req.user) throw new AppError("Not authenticated", 401);
    const { token } = req.body;

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user || !user.mfaSecret) {
      throw new AppError("MFA setup was not initiated", 400);
    }

    const isValid = verifyMfaToken(token, user.mfaSecret);
    if (!isValid) {
      throw new AppError("Invalid verification code. Please check your authenticator app.", 400);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isMfaEnabled: true },
    });

    await createAuditLog({
      userId: user.id,
      action: "AUTH_MFA_ENABLED",
      ip,
      userAgent,
    });

    res.json({ success: true, message: "Two-Factor Authentication is now enabled for your account!" });
  } catch (error) {
    next(error);
  }
};

/**
 * Forgot password request (generates secure token).
 */
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { ip, userAgent } = getClientInfo(req);
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success even if user not found to prevent user enumeration
    if (!user) {
      return res.json({
        success: true,
        message: "If an account exists with that email, a password reset link has been sent.",
      });
    }

    const rawToken = generateSecureToken(32);
    const hashedToken = hashToken(rawToken);
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: hashedToken,
        passwordResetExpires: expires,
      },
    });

    await createAuditLog({
      userId: user.id,
      action: "AUTH_PASSWORD_RESET_REQUESTED",
      ip,
      userAgent,
    });

    // In a production environment with email SMTP, send link via email.
    // For development convenience, we return the resetToken.
    res.json({
      success: true,
      message: "If an account exists with that email, a password reset link has been sent.",
      devToken: process.env.NODE_ENV !== "production" ? rawToken : undefined,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reset password using cryptographic token.
 */
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { ip, userAgent } = getClientInfo(req);
  try {
    const { token, password } = req.body;
    const hashed = hashToken(token);

    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: hashed,
        passwordResetExpires: { gt: new Date() },
      },
    });

    if (!user) {
      throw new AppError("Invalid or expired password reset token", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
        failedLoginAttempts: 0,
        lockoutUntil: null,
      },
    });

    await createAuditLog({
      userId: user.id,
      action: "AUTH_PASSWORD_RESET_SUCCESS",
      ip,
      userAgent,
    });

    res.json({ success: true, message: "Password has been successfully reset. You may now sign in." });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError("Not authenticated", 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isMfaEnabled: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
