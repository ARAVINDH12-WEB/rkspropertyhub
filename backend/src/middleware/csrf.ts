import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { AppError } from "./errorHandler";

const CSRF_COOKIE_NAME = "rks_csrf_token";

/**
 * Generates and sets a secure CSRF token in an http-readable cookie
 * and returns it to the client.
 */
export function getCsrfToken(req: Request, res: Response) {
  let token = req.cookies?.[CSRF_COOKIE_NAME];
  if (!token) {
    token = crypto.randomBytes(32).toString("hex");
    res.cookie(CSRF_COOKIE_NAME, token, {
      httpOnly: false, // Accessible by JavaScript to attach to headers
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
  }

  res.json({
    success: true,
    csrfToken: token,
  });
}

/**
 * CSRF Protection Middleware.
 * Validates either:
 * 1. Double Submit Token: `X-CSRF-Token` request header matches `rks_csrf_token` cookie, OR
 * 2. Origin/Referer header matches allowed frontend origin(s).
 */
export function verifyCsrf(req: Request, res: Response, next: NextFunction) {
  // Safe HTTP methods do not require CSRF verification
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return next();
  }

  // Exempt webhooks (e.g. Stripe, payment gateway callbacks)
  if (req.path.startsWith("/api/v1/webhooks")) {
    return next();
  }

  const cookieToken = req.cookies?.[CSRF_COOKIE_NAME];
  const headerToken = req.headers["x-csrf-token"] || req.headers["x-xsrf-token"];

  // 1. If CSRF header and cookie are present, compare them
  if (cookieToken && headerToken && cookieToken === headerToken) {
    return next();
  }

  // 2. Fallback: Origin validation against allowed frontend origins
  const origin = req.headers["origin"] || req.headers["referer"];
  const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

  if (origin && (origin.startsWith(allowedOrigin) || origin.includes("localhost"))) {
    return next();
  }

  // If both checks fail, reject request
  return next(
    new AppError("Invalid or missing CSRF token. Please refresh the page.", 403)
  );
}

/**
 * Honeypot & Anti-Bot Protection for public lead & contact forms.
 * Catches bots that automatically fill hidden honeypot fields or submit in < 500ms.
 */
export function verifyBotProtection(req: Request, res: Response, next: NextFunction) {
  const { _hp, _timestamp } = req.body;

  // 1. Honeypot check: Bots will populate the hidden field
  if (_hp && _hp.trim() !== "") {
    // Silently return success to mislead the bot, but drop the submission
    return res.status(200).json({
      success: true,
      message: "Thank you! Your inquiry has been received.",
    });
  }

  // 2. Submission speed check: Submissions faster than 400ms are almost certainly automated scripts
  if (_timestamp) {
    const elapsed = Date.now() - Number(_timestamp);
    if (elapsed < 400) {
      return next(new AppError("Submission was completed suspiciously fast. Please try again.", 400));
    }
  }

  next();
}
