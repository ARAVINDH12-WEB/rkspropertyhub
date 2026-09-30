import { Router } from "express";
import {
  register,
  login,
  refreshToken,
  logout,
  getMe,
  setupMfa,
  verifyAndEnableMfa,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/auth";
import { authLimiter, passwordResetLimiter } from "../middleware/rateLimiter";
import {
  registerSchema,
  loginSchema,
  mfaVerifySchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../schemas/auth.schema";

const router = Router();

// Authentication flows with strict rate limiting
router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/refresh-token", authLimiter, refreshToken);
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, getMe);

// Two-Factor Authentication (TOTP)
router.post("/mfa/setup", authenticate, setupMfa);
router.post("/mfa/enable", authenticate, validate(mfaVerifySchema), verifyAndEnableMfa);

// Password recovery flow
router.post("/forgot-password", passwordResetLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", passwordResetLimiter, validate(resetPasswordSchema), resetPassword);

export default router;
