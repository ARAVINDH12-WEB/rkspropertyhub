import rateLimit from "express-rate-limit";

/**
 * Strict Rate Limiter for Authentication endpoints (login, register, token refresh).
 * Mitigates brute-force credential stuffing and password guessing.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 15 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again after 15 minutes.",
  },
});

/**
 * Rate Limiter for Password Reset requests.
 */
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 requests per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many password reset requests. Please check your inbox or try again in an hour.",
  },
});

/**
 * Rate Limiter for Public Lead Submissions, Contact Form, and Seller Valuations.
 * Blocks bot spam while allowing real human submissions.
 */
export const leadFormLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 submissions per hour per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "You have submitted multiple inquiries recently. An advisor will contact you soon!",
  },
});

/**
 * Rate Limiter for Public Catalog Search & Listing endpoints.
 * Protects property inventory from automated high-frequency scraping.
 */
export const publicApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // 150 queries per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "High traffic detected. Please slow down your requests.",
  },
});
